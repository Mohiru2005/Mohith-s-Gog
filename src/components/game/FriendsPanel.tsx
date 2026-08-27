"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Friend,
  getFriends,
  addFriend,
  removeFriend,
  sendMatchInvite,
} from "@/lib/game/friends";
import { createOnlineRoom } from "@/lib/game/online";
import { Users, UserPlus, Send, Trash2, Check, Cpu } from "lucide-react";

interface FriendsPanelProps {
  currentRoomId?: string;
}

export function FriendsPanel({ currentRoomId }: FriendsPanelProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [invitedFriend, setInvitedFriend] = useState<string | null>(null);

  useEffect(() => {
    setFriends(getFriends());
  }, []);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    const updated = addFriend(newFriendName);
    setFriends(updated);
    setNewFriendName("");
  };

  const handleRemoveFriend = (username: string) => {
    const updated = removeFriend(username);
    setFriends(updated);
  };

  const handleInvite = (friendUsername: string) => {
    if (!user) return;

    let targetRoomId = currentRoomId;
    if (!targetRoomId) {
      const room = createOnlineRoom(user.username);
      targetRoomId = room.roomId;
    }

    sendMatchInvite(user.username, friendUsername, targetRoomId);
    setInvitedFriend(friendUsername);
    setTimeout(() => setInvitedFriend(null), 3000);

    if (!currentRoomId) {
      router.push(`/room/${targetRoomId}`);
    }
  };

  return (
    <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(56,189,248,0.1)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black text-white">Quantum Allies</h3>
        </div>
        <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold px-2 py-0.5 rounded-full">
          {friends.length} Friends
        </span>
      </div>

      <form onSubmit={handleAddFriend} className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter Commander Callsign..."
          value={newFriendName}
          onChange={(e) => setNewFriendName(e.target.value)}
          className="flex-1 bg-[#050814] border border-cyan-900/60 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {friends.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-2">No friends added yet</p>
        ) : (
          friends.map((f) => {
            const isJustInvited = invitedFriend === f.username;
            return (
              <div
                key={f.username}
                className="flex items-center justify-between bg-[#050814] p-2.5 rounded-xl border border-cyan-900/40 hover:border-cyan-500/30 transition"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="relative">
                    <span className="text-base">{f.avatar}</span>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#050814] ${
                        f.status === "online"
                          ? "bg-emerald-400"
                          : f.status === "in_game"
                          ? "bg-amber-400"
                          : "bg-slate-600"
                      }`}
                    />
                  </div>

                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{f.username}</p>
                    <p className="text-[9px] text-cyan-400/60 capitalize">{f.status.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => handleInvite(f.username)}
                    className={`flex items-center space-x-1 font-bold px-2.5 py-1 rounded-lg text-[10px] transition ${
                      isJustInvited
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {isJustInvited ? <Check className="w-3 h-3 text-emerald-400" /> : <Send className="w-3 h-3" />}
                    <span>{isJustInvited ? "Invited!" : "Invite"}</span>
                  </button>

                  <button
                    onClick={() => handleRemoveFriend(f.username)}
                    className="text-slate-600 hover:text-red-400 p-1 transition"
                    title="Remove Friend"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
