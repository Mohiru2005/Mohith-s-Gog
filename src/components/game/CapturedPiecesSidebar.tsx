"use client";

import React from "react";
import { Piece, PieceRank } from "@/lib/game/constants";
import { MoveRecord } from "@/lib/game/engine";
import { Swords, Trophy, Shield, Target, Flag, Crown, Star, Cpu } from "lucide-react";

interface CapturedPiecesSidebarProps {
  history: MoveRecord[];
  board?: (Piece | null)[][];
}

export function CapturedPiecesSidebar({ history }: CapturedPiecesSidebarProps) {
  const capturedByP1: Piece[] = [];
  const capturedByP2: Piece[] = [];

  history.forEach((rec) => {
    if (rec.result) {
      const { winner, defeatedPiece } = rec.result;
      if (winner === "attacker" && defeatedPiece) {
        if (rec.player === "player1") capturedByP1.push(defeatedPiece);
        else capturedByP2.push(defeatedPiece);
      } else if (winner === "defender" && defeatedPiece) {
        const defenderPlayer = rec.player === "player1" ? "player2" : "player1";
        if (defenderPlayer === "player1") capturedByP1.push(defeatedPiece);
        else capturedByP2.push(defeatedPiece);
      }
    }
  });

  const groupCaptured = (pieces: Piece[]) => {
    const counts: Record<string, { rank: PieceRank; count: number }> = {};
    pieces.forEach((p) => {
      if (!counts[p.rank]) {
        counts[p.rank] = { rank: p.rank, count: 0 };
      }
      counts[p.rank].count++;
    });
    return Object.values(counts);
  };

  const p1Grouped = groupCaptured(capturedByP1);
  const p2Grouped = groupCaptured(capturedByP2);

  return (
    <aside className="w-48 lg:w-52 shrink-0 bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-3 shadow-[0_0_25px_rgba(56,189,248,0.1)] flex flex-col space-y-3 select-none">
      <div className="flex items-center space-x-2 border-b border-cyan-900/60 pb-2">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-black text-cyan-300 tracking-wider uppercase">Captured Matrix</h3>
      </div>

      {/* Player 1 Trophies (Gold) */}
      <div className="bg-[#050814]/80 border border-amber-500/30 rounded-xl p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-amber-400">P1 (Gold) Trophies</span>
          <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black px-2 py-0.5 rounded-full">
            {capturedByP1.length} Total
          </span>
        </div>

        {p1Grouped.length === 0 ? (
          <p className="text-[10px] text-slate-500 italic py-1">No captures yet</p>
        ) : (
          <div className="space-y-1 max-h-32 overflow-y-auto pr-0.5">
            {p1Grouped.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-amber-950/40 border border-amber-500/30 px-2 py-1 rounded text-[10px]"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="font-bold text-amber-200 truncate">{item.rank}</span>
                </div>
                <span className="font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded text-[9px]">
                  x{item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player 2 Trophies (Cyan/Blue) */}
      <div className="bg-[#050814]/80 border border-cyan-500/30 rounded-xl p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-cyan-400">P2 (Cyan) Trophies</span>
          <span className="text-[10px] bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black px-2 py-0.5 rounded-full">
            {capturedByP2.length} Total
          </span>
        </div>

        {p2Grouped.length === 0 ? (
          <p className="text-[10px] text-slate-500 italic py-1">No captures yet</p>
        ) : (
          <div className="space-y-1 max-h-32 overflow-y-auto pr-0.5">
            {p2Grouped.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-cyan-950/40 border border-cyan-500/30 px-2 py-1 rounded text-[10px]"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="font-bold text-cyan-200 truncate">{item.rank}</span>
                </div>
                <span className="font-black text-cyan-400 bg-cyan-500/20 px-1.5 py-0.2 rounded text-[9px]">
                  x{item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Combat Log Feed */}
      <div className="flex-1 flex flex-col space-y-1.5 border-t border-cyan-900/60 pt-2">
        <div className="flex items-center space-x-1 text-[11px] font-extrabold text-cyan-300">
          <Swords className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Quantum Feed</span>
        </div>

        <div className="space-y-1 max-h-32 overflow-y-auto pr-0.5 text-[10px] text-slate-400 font-mono">
          {history.length === 0 ? (
            <p className="italic text-slate-600">No actions recorded</p>
          ) : (
            [...history].reverse().map((rec, idx) => (
              <div key={idx} className="bg-[#050814] p-1.5 rounded-lg border border-cyan-900/50">
                <span className={rec.player === "player1" ? "text-amber-400 font-bold" : "text-cyan-400 font-bold"}>
                  {rec.player === "player1" ? "P1" : "P2"}
                </span>{" "}
                ({rec.from.row},{rec.from.col}) &rarr; ({rec.to.row},{rec.to.col})
                {rec.result && (
                  <div className="text-emerald-400 font-sans font-bold text-[9px] mt-0.5">
                    ⚔️ {rec.result.winner === "attacker" ? "Attacker Victory" : rec.result.winner === "defender" ? "Defender Defended" : "Mutual Defeat"}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
