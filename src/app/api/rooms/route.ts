import { NextResponse } from "next/server";

const memoryRooms: Record<string, any> = {};

export async function GET() {
  return NextResponse.json(Object.values(memoryRooms));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, roomId, hostUsername, joinUsername, player, setupBoard, from, to, username } = body;

    if (action === "create") {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const newRoomId = `GOG-${code}`;

      const room = {
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

    if (action === "join") {
      const cleanId = (roomId || "").toUpperCase().trim();
      let room = memoryRooms[cleanId];

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
        memoryRooms[cleanId] = room;
      } else {
        room.joinUsername = joinUsername || "Challenger_Commander";
        if (room.status === "waiting_for_player2") {
          room.status = "setup";
        }
      }

      return NextResponse.json(room);
    }

    if (action === "setup") {
      const cleanId = (roomId || "").toUpperCase().trim();
      let room = memoryRooms[cleanId];

      if (!room) {
        room = {
          roomId: cleanId,
          hostUsername: "Host_Commander",
          player1Ready: false,
          player2Ready: false,
          status: "setup",
          createdAt: Date.now(),
        };
        memoryRooms[cleanId] = room;
      }

      if (player === "player1") {
        room.player1Board = setupBoard;
        room.player1Ready = true;
      } else {
        room.player2Board = setupBoard;
        room.player2Ready = true;
      }

      // Auto-combine boards and start playing
      if (room.player1Board || room.player2Board) {
        const combinedBoard = Array(8).fill(null).map(() => Array(9).fill(null));

        if (room.player1Board) {
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 9; c++) {
              if (room.player1Board[r][c]) combinedBoard[r][c] = room.player1Board[r][c];
            }
          }
        }

        if (room.player2Board) {
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 9; c++) {
              if (room.player2Board[r][c]) combinedBoard[r][c] = room.player2Board[r][c];
            }
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

      return NextResponse.json(room);
    }

    if (action === "move") {
      const cleanId = (roomId || "").toUpperCase().trim();
      const room = memoryRooms[cleanId];
      if (!room || !room.gameState || room.status === "canceled") {
        return NextResponse.json({ error: "Invalid room state" }, { status: 400 });
      }

      const { makeMove } = await import("@/lib/game/engine");
      const { newState } = makeMove(room.gameState, from, to);
      room.gameState = newState;

      if (newState.status === "finished") {
        room.status = "finished";
      }

      return NextResponse.json(room);
    }

    if (action === "cancel") {
      const cleanId = (roomId || "").toUpperCase().trim();
      const room = memoryRooms[cleanId];
      if (room) {
        room.status = "canceled";
        room.canceledBy = username;
      }
      return NextResponse.json({ status: "canceled" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
