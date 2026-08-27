import type Peer from "peerjs";
import { OnlineRoom } from "./online";

export type P2PMessage =
  | { type: "JOIN_REQUEST"; username: string }
  | { type: "SETUP_SUBMITTED"; player: "player1" | "player2"; setupBoard: any }
  | { type: "MOVE_EXECUTED"; from: any; to: any }
  | { type: "MATCH_CANCELED"; username: string };

export class P2PManager {
  private peer: Peer | null = null;
  private conn: any = null;
  private roomId: string;
  private isHost: boolean;
  private onRoomUpdate: (room: OnlineRoom) => void;

  constructor(roomId: string, isHost: boolean, onRoomUpdate: (room: OnlineRoom) => void) {
    this.roomId = roomId.toUpperCase().trim();
    this.isHost = isHost;
    this.onRoomUpdate = onRoomUpdate;
  }

  public async init(currentRoom: OnlineRoom): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const { default: Peer } = await import("peerjs");
      const cleanCode = this.roomId.replace(/[^A-Z0-9]/g, "");

      if (this.isHost) {
        // Host initializes Peer with predictable room ID
        const hostPeerId = `gog-room-${cleanCode.toLowerCase()}`;
        this.peer = new Peer(hostPeerId);

        this.peer.on("connection", (connection) => {
          this.conn = connection;
          this.setupDataListeners(currentRoom);
        });
      } else {
        // Joiner connects to Host's Peer ID
        const hostPeerId = `gog-room-${cleanCode.toLowerCase()}`;
        this.peer = new Peer();

        this.peer.on("open", () => {
          this.conn = this.peer?.connect(hostPeerId);
          if (this.conn) {
            this.conn.on("open", () => {
              this.sendMessage({ type: "JOIN_REQUEST", username: currentRoom.joinUsername || "Challenger" });
            });
            this.setupDataListeners(currentRoom);
          }
        });
      }
    } catch (e) {
      console.error("PeerJS init error:", e);
    }
  }

  private setupDataListeners(room: OnlineRoom) {
    if (!this.conn) return;

    this.conn.on("data", (data: P2PMessage) => {
      if (data.type === "JOIN_REQUEST") {
        room.joinUsername = data.username;
        if (room.status === "waiting_for_player2") room.status = "setup";
        this.onRoomUpdate({ ...room });
      }

      if (data.type === "SETUP_SUBMITTED") {
        if (data.player === "player1") {
          room.player1Board = data.setupBoard;
          room.player1Ready = true;
        } else {
          room.player2Board = data.setupBoard;
          room.player2Ready = true;
        }

        if (room.player1Ready && room.player2Ready && room.player1Board && room.player2Board) {
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
        }
        this.onRoomUpdate({ ...room });
      }

      if (data.type === "MOVE_EXECUTED" && room.gameState) {
        import("./engine").then(({ makeMove }) => {
          try {
            const { newState } = makeMove(room.gameState!, data.from, data.to);
            room.gameState = newState;
            if (newState.status === "finished") room.status = "finished";
            this.onRoomUpdate({ ...room });
          } catch (e) {}
        });
      }

      if (data.type === "MATCH_CANCELED") {
        room.status = "canceled";
        room.canceledBy = data.username;
        this.onRoomUpdate({ ...room });
      }
    });
  }

  public sendMessage(msg: P2PMessage) {
    if (this.conn && this.conn.open) {
      this.conn.send(msg);
    }
  }

  public destroy() {
    try {
      this.conn?.close();
      this.peer?.destroy();
    } catch (e) {}
  }
}
