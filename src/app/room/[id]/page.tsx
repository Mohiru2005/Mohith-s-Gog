"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { usePlayerSession } from "@/lib/game/player-session";
import {
  OnlineRoom,
  getOnlineRooms,
  saveOnlineRooms,
  submitPlayerSetup,
  executeOnlineMove,
  cancelOnlineRoom,
} from "@/lib/game/online";
import { BOARD_COLS, BOARD_ROWS, BoardState } from "@/lib/game/constants";
import { SetupGrid } from "@/components/game/SetupGrid";
import { GameBoard } from "@/components/game/GameBoard";
import { P2PManager } from "@/lib/game/p2p";
import { Copy, Check, Users, RefreshCw, ShieldCheck, LogOut, XCircle, Cpu } from "lucide-react";

export default function OnlineRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;

  const router = useRouter();
  const { name } = usePlayerSession();

  const [room, setRoom] = useState<OnlineRoom | null>(null);
  const [copied, setCopied] = useState(false);

  const p2pRef = useRef<P2PManager | null>(null);

  const currentUsername = name || "Commander";
  const isHost = currentUsername === room?.hostUsername;
  const myPlayer: "player1" | "player2" = isHost ? "player1" : "player2";

  useEffect(() => {
    const cleanId = roomId.toUpperCase().trim();
    const rooms = getOnlineRooms();
    let current = rooms[cleanId];

    if (current) {
      setRoom({ ...current });

      // Initialize WebRTC P2P Manager
      const manager = new P2PManager(cleanId, currentUsername === current.hostUsername, (updatedRoom) => {
        setRoom({ ...updatedRoom });
        rooms[cleanId] = updatedRoom;
        saveOnlineRooms(rooms);
      });

      manager.init(current);
      p2pRef.current = manager;
    }

    const fetchRoom = async () => {
      // Bi-directional state sync backup
      try {
        const res = await fetch(`/api/rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "sync", roomId: cleanId, clientRoom: current }),
        });

        if (res.ok) {
          const serverRoom: OnlineRoom = await res.json();
          if (serverRoom && serverRoom.roomId) {
            const serverHistoryLength = serverRoom.gameState?.history?.length || 0;
            const clientHistoryLength = current?.gameState?.history?.length || 0;

            if (serverHistoryLength >= clientHistoryLength) {
              current = { ...current, ...serverRoom };
            } else {
              current = { ...serverRoom, ...current };
            }

            rooms[cleanId] = current;
            saveOnlineRooms(rooms);
            setRoom({ ...current });
          }
        }
      } catch (e) {}
    };

    fetchRoom();
    const interval = setInterval(fetchRoom, 500);
    window.addEventListener("storage", fetchRoom);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", fetchRoom);
      p2pRef.current?.destroy();
    };
  }, [roomId, currentUsername]);

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelMatch = () => {
    if (!room) return;
    p2pRef.current?.sendMessage({ type: "MATCH_CANCELED", username: currentUsername });
    const updated = cancelOnlineRoom(roomId, currentUsername);
    if (updated) setRoom({ ...updated });
    router.push("/");
  };

  const handleSetupComplete = (board: BoardState) => {
    p2pRef.current?.sendMessage({ type: "SETUP_SUBMITTED", player: myPlayer, setupBoard: board });
    const updated = submitPlayerSetup(roomId, myPlayer, board);
    if (updated) setRoom({ ...updated });
  };

  const handleMoveExecuted = async (newState: any) => {
    const lastMove = newState.history[newState.history.length - 1];
    if (lastMove) {
      p2pRef.current?.sendMessage({ type: "MOVE_EXECUTED", from: lastMove.from, to: lastMove.to });
      const updated = executeOnlineMove(roomId, lastMove.from, lastMove.to);
      if (updated) setRoom({ ...updated });

      try {
        const cleanId = roomId.toUpperCase().trim();
        await fetch(`/api/rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "move",
            roomId: cleanId,
            from: lastMove.from,
            to: lastMove.to,
            clientRoom: updated,
          }),
        });
      } catch (e) {}
    }
  };

  if (!room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading Room ({roomId})...</p>
      </div>
    );
  }

  const isMySetupDone = myPlayer === "player1" ? room.player1Ready : room.player2Ready;

  return (
    <div className="space-y-6 py-2 select-none">
      {/* Room Header & Share Code Bar */}
      <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(56,189,248,0.1)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white">Quantum Match Room</h1>
              <span className="font-mono text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-md">
                {room.roomId}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              You are playing as <strong className={myPlayer === "player1" ? "text-cyan-400" : "text-fuchsia-400"}>
                {myPlayer === "player1" ? "Player 1 (Cyan)" : "Player 2 (Magenta)"}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 bg-[#050814] hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs border border-cyan-500/30 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          <button
            onClick={handleCancelMatch}
            className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold px-3 py-1.5 rounded-xl text-xs border border-red-500/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cancel Match</span>
          </button>
        </div>
      </div>

      {/* Canceled Match Status */}
      {room.status === "canceled" && (
        <div className="bg-[#090D1F] border border-red-500/40 rounded-2xl p-10 text-center space-y-4 max-w-md mx-auto shadow-2xl">
          <XCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-extrabold text-white">Match Canceled</h2>
          <p className="text-xs text-slate-400">
            {room.canceledBy ? `Match was canceled by ${room.canceledBy}.` : "This match room has been canceled."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition shadow-lg inline-flex items-center space-x-2"
          >
            <span>Return to Lobby</span>
          </button>
        </div>
      )}

      {/* Waiting for Player 2 */}
      {room.status === "waiting_for_player2" && !room.joinUsername && (
        <div className="bg-[#090D1F] border border-cyan-500/40 rounded-2xl p-10 text-center space-y-4 max-w-md mx-auto shadow-2xl">
          <Users className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-extrabold text-white">Waiting for Player 2...</h2>
          <p className="text-xs text-slate-400">
            Share Room Code <strong className="font-mono text-cyan-300 text-sm">{room.roomId}</strong> with your friend so they can join on another device!
          </p>
          <button
            onClick={handleCancelMatch}
            className="bg-[#050814] hover:bg-slate-900 text-red-400 font-bold px-4 py-2 rounded-xl text-xs transition border border-cyan-900/60"
          >
            Cancel Match Request
          </button>
        </div>
      )}

      {/* Setup Phase */}
      {(room.status === "setup" || room.joinUsername) && room.status !== "playing" && room.status !== "canceled" && (
        <div>
          {!isMySetupDone ? (
            <div className="space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold p-3 rounded-xl text-center">
                ★ Deploy your 21 units for {myPlayer === "player1" ? "Player 1 (Rows 5-7)" : "Player 2 (Rows 0-2)"}
              </div>
              <SetupGrid player={myPlayer} onSetupComplete={handleSetupComplete} />
            </div>
          ) : (
            <div className="bg-[#090D1F] border border-cyan-500/40 rounded-2xl p-10 text-center space-y-4 max-w-md mx-auto shadow-2xl">
              <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
              <h2 className="text-xl font-extrabold text-white">Formation Locked!</h2>
              <p className="text-xs text-slate-400">
                Waiting for opponent to complete their army deployment...
              </p>
              <button
                onClick={handleCancelMatch}
                className="bg-[#050814] hover:bg-slate-900 text-red-400 font-bold px-4 py-2 rounded-xl text-xs transition border border-cyan-900/60"
              >
                Cancel Match
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live Battle Playing */}
      {room.status === "playing" && room.gameState && (
        <GameBoard
          initialState={room.gameState}
          onMoveExecuted={handleMoveExecuted}
          onRestart={handleCancelMatch}
          perspective={myPlayer}
          allowBothPlayers={false}
        />
      )}
    </div>
  );
}
