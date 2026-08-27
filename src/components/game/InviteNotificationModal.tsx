"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MatchInvite, getPendingInvites, clearInvite } from "@/lib/game/friends";
import { joinOnlineRoom } from "@/lib/game/online";
import { Cpu, Check, X, Sparkles } from "lucide-react";

export function InviteNotificationModal() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeInvite, setActiveInvite] = useState<MatchInvite | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkInvites = () => {
      const pending = getPendingInvites(user.username);
      if (pending.length > 0) {
        setActiveInvite(pending[0]);
      }
    };

    checkInvites();
    const interval = setInterval(checkInvites, 1000);
    window.addEventListener("storage", checkInvites);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkInvites);
    };
  }, [user]);

  if (!activeInvite || !user) return null;

  const handleAccept = () => {
    const invite = activeInvite;
    clearInvite(invite.id);
    setActiveInvite(null);

    joinOnlineRoom(invite.roomId, user.username);
    router.push(`/room/${invite.roomId}`);
  };

  const handleDecline = () => {
    clearInvite(activeInvite.id);
    setActiveInvite(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 max-w-sm w-full select-none">
      <div className="bg-[#090D1F] border-2 border-cyan-500/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(56,189,248,0.3)] space-y-3 relative">
        <div className="flex items-center space-x-2 border-b border-cyan-900/60 pb-2">
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Quantum Invite Received</h4>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white font-bold">
            <strong className="text-cyan-300">{activeInvite.senderUsername}</strong> invited you to a Games of the Generals match!
          </p>
          <p className="text-[10px] text-cyan-400/80 font-mono">Room Code: {activeInvite.roomId}</p>
        </div>

        <div className="flex space-x-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1 shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Accept & Join</span>
          </button>

          <button
            onClick={handleDecline}
            className="bg-[#050814] hover:bg-slate-900 text-slate-300 font-bold px-3 py-2 rounded-xl text-xs border border-cyan-900/60 transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
