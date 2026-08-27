"use client";

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Trophy } from "lucide-react";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "General_Eisenhower", wins: 142, losses: 18, matches: 160 },
  { rank: 2, name: "SalpakanKing_PH", wins: 128, losses: 24, matches: 152 },
  { rank: 3, name: "VanguardSpy99", wins: 115, losses: 31, matches: 146 },
  { rank: 4, name: "TacticalMind_2026", wins: 98, losses: 29, matches: 127 },
  { rank: 5, name: "BlitzMaster", wins: 84, losses: 35, matches: 119 },
];

export default function LeaderboardPage() {
  return (
    <AuthGuard>
      <div className="space-y-6 py-2 select-none">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Match Statistics</h1>
              <p className="text-xs text-zinc-400">Top commander match records</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 uppercase text-[10px] tracking-wider text-zinc-400 font-extrabold border-b border-zinc-800">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Commander</th>
                <th className="p-3">Total Matches</th>
                <th className="p-3">W / L Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {MOCK_LEADERBOARD.map((p) => (
                <tr key={p.rank} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3 font-black">
                    {p.rank === 1 && <span className="text-yellow-400">🥇 #1</span>}
                    {p.rank === 2 && <span className="text-zinc-300">🥈 #2</span>}
                    {p.rank === 3 && <span className="text-amber-600">🥉 #3</span>}
                    {p.rank > 3 && <span>#{p.rank}</span>}
                  </td>
                  <td className="p-3 font-bold text-white">{p.name}</td>
                  <td className="p-3 text-amber-300 font-bold">{p.matches} Matches</td>
                  <td className="p-3 text-zinc-400 font-semibold">
                    <span className="text-emerald-400 font-extrabold">{p.wins} Wins</span> / <span className="text-red-400 font-extrabold">{p.losses} Losses</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
