"use client";

import React, { useState } from "react";
import { SetupGrid } from "@/components/game/SetupGrid";
import { BoardState } from "@/lib/game/constants";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ShieldCheck, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const [completedBoard, setCompletedBoard] = useState<BoardState | null>(null);

  return (
    <AuthGuard>
      <div className="space-y-6 py-2 select-none">
        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
          <h1 className="text-2xl font-black text-cyan-300 mb-1">Custom Quantum Formation Setup</h1>
          <p className="text-xs text-slate-400">
            Design your 21-piece military strategy layout. Save your custom loadouts into your Quantum Arsenal Grid.
          </p>
        </div>

        {completedBoard ? (
          <div className="bg-[#090D1F] border border-cyan-500/50 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-[0_0_40px_rgba(56,189,248,0.2)]">
            <ShieldCheck className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-white">Quantum Formation Locked & Saved!</h2>
            <p className="text-xs text-slate-400">
              Your 21-unit deployment formation has been verified and locked into the matrix. Ready for battle!
            </p>

            <div className="flex space-x-3 justify-center pt-2">
              <button
                onClick={() => setCompletedBoard(null)}
                className="bg-[#050814] hover:bg-slate-900 text-slate-300 border border-cyan-500/30 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Modify Grid
              </button>
              <Link
                href="/online"
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black px-6 py-2 rounded-xl text-xs transition shadow-lg"
              >
                <span>Battle with this Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <SetupGrid player="player1" onSetupComplete={(b) => setCompletedBoard(b)} />
        )}
      </div>
    </AuthGuard>
  );
}
