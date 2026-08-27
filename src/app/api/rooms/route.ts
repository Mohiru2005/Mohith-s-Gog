import { NextResponse } from "next/server";

// Serverless process memory store
const memoryRooms: Record<string, any> = {};

export async function GET() {
  return NextResponse.json(Object.values(memoryRooms));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, roomId, hostUsername, joinUsername, player, setupBoard, clientRoom, from, to, username } = body;

    const cleanId = (roomId || "").toUpperCase().trim();
    let room = memoryRooms[cleanId] || clientRoom || null;

    if (action === "create") {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const newRoomId = `GOG-${code}`;

      room = {
        roomId: newRoomId,
        hostUsername: hostUsername || "Host_Commander",
        player1Ready: false,
        player2Ready: false,
        status: "waiting_for_player2",
        createdAt: Date.now(),
      };

      memoryRooms[newRoomId] = room;
      return NextResponse.json(room);
    }

    if (action === "sync") {
      if (!room && clientRoom?.roomId) {
        room = clientRoom;
        memoryRooms[cleanId] = clientRoom;
      }

      if (room && clientRoom) {
        // Merge player setups from client if provided
        if (clientRoom.player1Board) {
          room.player1Board = clientRoom.player1Board;
          room.player1Ready = true;
        }
        if (clientRoom.player2Board) {
          room.player2Board = clientRoom.player2Board;
          room.player2Ready = true;
        }
        if (clientRoom.joinUsername) {
          room.joinUsername = clientRoom.joinUsername;
          if (room.status === "waiting_for_player2") room.status = "setup";
        }
      }

      // If BOTH setups exist, guarantee transition to playing state
      if (room && room.player1Board && room.player2Board) {
        const combinedBoard = Array(8).fill(null).map(() => Array(9).fill(null));

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 9; c++) {
            if (room.player1Board[r][c]) combinedBoard[r][c] = room.player1Board[r][c];
            if (room.player2Board[r][c]) combinedBoard[r][c] = room.player2Board[r][c];
          }
        }

        room.gameState = room.gameState || {
          board: combinedBoard,
          currentTurn: "player1",
          status: "playing",
          winner: null,
          history: [],
        };
        room.status = "playing";
        room.player1Ready = true;
        room.player2Ready = true;
      }

      if (room) memoryRooms[cleanId] = room;
      return NextResponse.json(room || { error: "Not found" });
    }

    if (action === "join") {
      if (!room) {
        room = {
          roomId: cleanId,
          hostUsername: "Host_Commander",
          joinUsername: joinUsername || "Challenger_Commander",
          player1Ready: false,
          player2Ready: false,
          status: "setup",
          createdAt: Date.now(),
        };
      } else {
        room.joinUsername = joinUsername || "Challenger_Commander";
        if (room.status === "waiting_for_player2") {
          room.status = "setup";
        }
      }

      memoryRooms[cleanId] = room;
      return NextResponse.json(room);
    }

    if (action === "setup") {
      if (!room) {
        room = {
          roomId: cleanId,
          hostUsername: "Host_Commander",
          player1Ready: false,
          player2Ready: false,
          status: "setup",
          createdAt: Date.now(),
        };
      }

      if (player === "player1") {
        room.player1Board = setupBoard;
        room.player1Ready = true;
      } else {
        room.player2Board = setupBoard;
        room.player2Ready = true;
      }

      if (clientRoom?.player1Board) {
        room.player1Board = clientRoom.player1Board;
        room.player1Ready = true;
      }
      if (clientRoom?.player2Board) {
        room.player2Board = clientRoom.player2Board;
        room.player2Ready = true;
      }

      // Check if BOTH setups are ready
      if (room.player1Board && room.player2Board) {
        const combinedBoard = Array(8).fill(null).map(() => Array(9).fill(null));

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 9; c++) {
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
        room.player1Ready = true;
        room.player2Ready = true;
      }

      memoryRooms[cleanId] = room;
      return NextResponse.json(room);
    }

    if (action === "move") {
      if (!room || !room.gameState || room.status === "canceled") {
        return NextResponse.json({ error: "Invalid room state" }, { status: 400 });
      }

      const { makeMove } = await import("@/lib/game/engine");
      const { newState } = makeMove(room.gameState, from, to);
      room.gameState = newState;

      if (newState.status === "finished") {
        room.status = "finished";
      }

      memoryRooms[cleanId] = room;
      return NextResponse.json(room);
    }

    if (action === "cancel") {
      if (room) {
        room.status = "canceled";
        room.canceledBy = username;
        memoryRooms[cleanId] = room;
      }
      return NextResponse.json({ status: "canceled" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
