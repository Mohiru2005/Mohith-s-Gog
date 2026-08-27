import { BOARD_COLS, BOARD_ROWS, BoardState } from "./constants";
import { GameState, makeMove, Position } from "./engine";

export interface OnlineRoom {
  roomId: string;
  hostUsername: string;
  joinUsername?: string;
  player1Ready: boolean;
  player2Ready: boolean;
  player1Board?: BoardState;
  player2Board?: BoardState;
  gameState?: GameState;
  status: "waiting_for_player2" | "setup" | "playing" | "finished" | "canceled";
  canceledBy?: string;
  createdAt: number;
}

const ONLINE_ROOMS_STORAGE_KEY = "gog_online_rooms_v1";

let memoryRoomsStore: Record<string, OnlineRoom> = {};

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GOG-${code}`;
}

export function getOnlineRooms(): Record<string, OnlineRoom> {
  if (typeof window === "undefined") {
    return memoryRoomsStore;
  }
  try {
    const raw = localStorage.getItem(ONLINE_ROOMS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : memoryRoomsStore;
  } catch (e) {
    return memoryRoomsStore;
  }
}

export function saveOnlineRooms(rooms: Record<string, OnlineRoom>): void {
  memoryRoomsStore = { ...rooms };
  if (typeof window === "undefined") return;
  localStorage.setItem(ONLINE_ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  try {
    window.dispatchEvent(new Event("storage"));
  } catch (e) {}
}

export function createOnlineRoom(hostUsername: string): OnlineRoom {
  const roomId = generateRoomCode();
  const room: OnlineRoom = {
    roomId,
    hostUsername: hostUsername || "Host_Commander",
    player1Ready: false,
    player2Ready: false,
    status: "waiting_for_player2",
    createdAt: Date.now(),
  };

  const rooms = getOnlineRooms();
  rooms[roomId] = room;
  saveOnlineRooms(rooms);

  if (typeof window !== "undefined") {
    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", hostUsername }),
    }).catch(() => {});
  }

  return room;
}

export function joinOnlineRoom(roomId: string, joinUsername: string): OnlineRoom | null {
  const cleanId = roomId.toUpperCase().trim();
  const rooms = getOnlineRooms();
  let room = rooms[cleanId];

  if (!room) {
    room = {
      roomId: cleanId,
      hostUsername: "Host_Commander",
      joinUsername,
      player1Ready: false,
      player2Ready: false,
      status: "setup",
      createdAt: Date.now(),
    };
    rooms[cleanId] = room;
    saveOnlineRooms(rooms);
  } else {
    room.joinUsername = joinUsername || "Challenger_Commander";
    if (room.status === "waiting_for_player2") {
      room.status = "setup";
    }
    saveOnlineRooms(rooms);
  }

  if (typeof window !== "undefined") {
    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", roomId: cleanId, joinUsername }),
    }).catch(() => {});
  }

  return room;
}

export function submitPlayerSetup(
  roomId: string,
  player: "player1" | "player2",
  setupBoard: BoardState
): OnlineRoom | null {
  const cleanId = roomId.toUpperCase().trim();
  const rooms = getOnlineRooms();
  const room = rooms[cleanId];
  if (!room || room.status === "canceled") return null;

  if (player === "player1") {
    room.player1Board = setupBoard;
    room.player1Ready = true;
  } else {
    room.player2Board = setupBoard;
    room.player2Ready = true;
  }

  // Strictly require BOTH players to be ready before combining boards and starting
  if (room.player1Ready && room.player2Ready && room.player1Board && room.player2Board) {
    const combinedBoard = Array(BOARD_ROWS)
      .fill(null)
      .map(() => Array(BOARD_COLS).fill(null));

    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (room.player1Board[r][c]) combinedBoard[r][c] = room.player1Board[r][c];
        if (room.player2Board[r][c]) combinedBoard[r][c] = room.player2Board[r][c];
      }
    }

    room.gameState = {
      board: combinedBoard,
      currentTurn: "player1",
      status: "playing",
      winner: null,
      history: [],
    };
    room.status = "playing";
  }

  saveOnlineRooms(rooms);

  if (typeof window !== "undefined") {
    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setup", roomId: cleanId, player, setupBoard }),
    }).catch(() => {});
  }

  return room;
}

export function executeOnlineMove(
  roomId: string,
  from: Position,
  to: Position
): OnlineRoom | null {
  const cleanId = roomId.toUpperCase().trim();
  const rooms = getOnlineRooms();
  const room = rooms[cleanId];
  if (!room || !room.gameState || room.status === "canceled") return null;

  try {
    const { newState } = makeMove(room.gameState, from, to);
    room.gameState = newState;
    if (newState.status === "finished") {
      room.status = "finished";
    }
    saveOnlineRooms(rooms);

    if (typeof window !== "undefined") {
      fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move", roomId: cleanId, from, to }),
      }).catch(() => {});
    }

    return room;
  } catch (e) {
    console.error("Execute online move error:", e);
    return null;
  }
}

export function cancelOnlineRoom(roomId: string, username: string): OnlineRoom | null {
  const cleanId = roomId.toUpperCase().trim();
  const rooms = getOnlineRooms();
  const room = rooms[cleanId];
  if (!room) return null;

  room.status = "canceled";
  room.canceledBy = username;
  if (room.gameState) {
    room.gameState.status = "finished";
    room.gameState.winReason = `Match canceled by ${username}`;
    room.gameState.winner = room.hostUsername === username ? "player2" : "player1";
  }

  saveOnlineRooms(rooms);

  if (typeof window !== "undefined") {
    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel", roomId: cleanId, username }),
    }).catch(() => {});
  }

  return room;
}

export function removeCanceledRoom(roomId: string): void {
  const cleanId = roomId.toUpperCase().trim();
  const rooms = getOnlineRooms();
  delete rooms[cleanId];
  saveOnlineRooms(rooms);
}
