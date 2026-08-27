"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerSession } from "@/lib/game/player-session";
import { createOnlineRoom, joinOnlineRoom, getOnlineRooms, OnlineRoom } from "@/lib/game/online";
import { Swords, Plus, LogIn, Users, Cpu, User } from "lucide-react";

export default function HomeLobbyPage() {
  const router = useRouter();
  const { name, saveName } = usePlayerSession();

  const [inputName, setInputName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeRooms, setActiveRooms] = useState<OnlineRoom[]>([]);

  useEffect(() => {
    if (name) setInputName(name);
  }, [name]);

  useEffect(() => {
    const update = () => {
      const rooms = getOnlineRooms();
      const openRooms = Object.values(rooms).filter(
        (r) => r.status !== "canceled" && r.status !== "finished"
      );
      setActiveRooms(openRooms);
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      saveName(inputName);
    }
  };

  const handleCreateRoom = () => {
    const playerName = inputName.trim() || "Commander";
    saveName(playerName);

    const room = createOnlineRoom(playerName);
    router.push(`/room/${room.roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const playerName = inputName.trim() || "Commander";
    saveName(playerName);

    const room = joinOnlineRoom(joinCode, playerName);
    if (!room) {
      setErrorMsg("Invalid room code. Please check the code and try again.");
      return;
    }

    router.push(`/room/${room.roomId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 select-none">
      {/* Title Card */}
      <div className="bg-[#090D1F]/90 border border-cyan-500/40 rounded-3xl p-8 text-center space-y-4 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-4 py-1.5 rounded-full">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>INSTANT MULTIPLAYER LOBBY</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-wider">
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">MOHIRU'S</span>{" "}
          <span className="text-white">GOG</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
          Enter your name, create a room, share the 4-digit Room Code with a friend on another device, and play!
        </p>

        {/* Enter Player Name */}
        <form onSubmit={handleNameSave} className="max-w-md mx-auto flex items-center space-x-2 pt-2">
          <div className="relative flex-1">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Enter Your Name..."
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                saveName(e.target.value);
              }}
              className="w-full bg-[#050814] border border-cyan-900/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-bold"
            />
          </div>
        </form>
      </div>

      {/* Action Cards: Host or Join Room */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host Room Card */}
        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-cyan-400 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Create Game Room</h2>
            <p className="text-xs text-slate-400">
              Host a 2-player match as Player 1 (Cyan). Share your 4-digit Room Code with your friend.
            </p>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black py-3.5 rounded-xl text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center space-x-2"
          >
            <Swords className="w-4 h-4" />
            <span>Create Room</span>
          </button>
        </div>

        {/* Join Room Card */}
        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-fuchsia-400 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <LogIn className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Join Room Code</h2>
            <p className="text-xs text-slate-400">
              Enter your friend's 4-digit Room Code below to join their match as Player 2 (Magenta).
            </p>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-3">
            <input
              type="text"
              placeholder="Enter Room Code (e.g. GOG-A8B9)"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                setErrorMsg("");
              }}
              className="w-full bg-[#050814] border border-cyan-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono tracking-wider text-center font-bold"
            />

            {errorMsg && <p className="text-[11px] text-red-400 font-bold text-center">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-black py-3.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Join Room</span>
            </button>
          </form>
        </div>
      </div>

      {/* Open Active Rooms */}
      {activeRooms.length > 0 && (
        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-cyan-900/60 pb-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Active Open Rooms</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeRooms.map((room) => (
              <div
                key={room.roomId}
                onClick={() => {
                  const playerName = inputName.trim() || "Commander";
                  saveName(playerName);
                  joinOnlineRoom(room.roomId, playerName);
                  router.push(`/room/${room.roomId}`);
                }}
                className="bg-[#050814] p-3.5 rounded-xl border border-cyan-900/60 hover:border-cyan-400 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-black text-cyan-400">{room.roomId}</span>
                  <p className="text-[11px] text-slate-300 font-bold mt-0.5">Host: {room.hostUsername}</p>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    room.status === "waiting_for_player2"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  }`}
                >
                  {room.status === "waiting_for_player2" ? "Joinable" : "In Game"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
