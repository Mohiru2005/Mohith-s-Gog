"use client";

import React from "react";
import { PieceRank } from "@/lib/game/constants";
import {
  Flag as FlagIcon,
  Target,
  Shield,
  ChevronUp,
  Award,
  Medal,
  Compass,
  Zap,
  ShieldAlert,
  Crown,
  Star,
  BookOpen,
  Cpu,
} from "lucide-react";

const LEGEND_ITEMS: { rank: PieceRank; beats: string; count: number }[] = [
  { rank: "5 Star General", beats: "Beats 4★ & lower", count: 1 },
  { rank: "4 Star General", beats: "Beats 3★ & lower", count: 1 },
  { rank: "3 Star General", beats: "Beats 2★ & lower", count: 1 },
  { rank: "2 Star General", beats: "Beats 1★ & lower", count: 1 },
  { rank: "1 Star General", beats: "Beats Colonels", count: 1 },
  { rank: "Colonel", beats: "Beats Lt. Col", count: 1 },
  { rank: "Lieutenant Colonel", beats: "Beats Major", count: 1 },
  { rank: "Major", beats: "Beats Captain", count: 1 },
  { rank: "Captain", beats: "Beats 1st Lt.", count: 1 },
  { rank: "1st Lieutenant", beats: "Beats 2nd Lt.", count: 1 },
  { rank: "2nd Lieutenant", beats: "Beats Sergeant", count: 1 },
  { rank: "Sergeant", beats: "Beats Privates", count: 1 },
  { rank: "Private", beats: "Defeats Spy!", count: 6 },
  { rank: "Spy", beats: "Defeats Officers!", count: 2 },
  { rank: "Flag", beats: "Loses to all", count: 1 },
];

export function RankLegendSidebar() {
  const renderIcon = (rank: PieceRank) => {
    switch (rank) {
      case "Flag":
        return <FlagIcon className="w-3 h-3 text-red-400" />;
      case "Spy":
        return <Target className="w-3 h-3 text-fuchsia-400" />;
      case "Private":
        return <Shield className="w-3 h-3 text-emerald-300" />;
      case "Sergeant":
        return <ChevronUp className="w-3 h-3 text-cyan-300" />;
      case "2nd Lieutenant":
        return <Award className="w-3 h-3 text-cyan-300" />;
      case "1st Lieutenant":
        return <Medal className="w-3 h-3 text-teal-300" />;
      case "Captain":
        return <Compass className="w-3 h-3 text-indigo-300" />;
      case "Major":
        return <Zap className="w-3 h-3 text-amber-300" />;
      case "Lieutenant Colonel":
        return <ShieldAlert className="w-3 h-3 text-pink-300" />;
      case "Colonel":
        return <Crown className="w-3 h-3 text-amber-400" />;
      default:
        return <Star className="w-3 h-3 fill-amber-400 text-amber-400" />;
    }
  };

  return (
    <aside className="w-44 lg:w-48 shrink-0 bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-2.5 shadow-[0_0_25px_rgba(56,189,248,0.1)] flex flex-col space-y-2 select-none">
      <div className="flex items-center space-x-1.5 border-b border-cyan-900/60 pb-1.5">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <h3 className="text-xs font-black text-cyan-300 tracking-wider uppercase">Quantum Ranks</h3>
      </div>

      <div className="space-y-1 max-h-[460px] overflow-y-auto pr-0.5 text-[10px]">
        {LEGEND_ITEMS.map((item) => (
          <div
            key={item.rank}
            className={`flex items-center justify-between px-1.5 py-1 rounded-lg border transition ${
              item.rank === "Spy"
                ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-200"
                : item.rank === "Private"
                ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-200"
                : item.rank === "Flag"
                ? "bg-red-950/40 border-red-800/40 text-red-200"
                : "bg-[#050814]/80 border-cyan-900/40 text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-1.5 truncate">
              <div className="w-4 h-4 rounded bg-[#050814] border border-cyan-500/30 flex items-center justify-center shrink-0">
                {renderIcon(item.rank)}
              </div>
              <div className="truncate">
                <div className="font-bold leading-tight text-[10px] text-slate-100 truncate">
                  {item.rank} ({item.count})
                </div>
                <div className="text-[8px] text-cyan-400/60 leading-none truncate">{item.beats}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
