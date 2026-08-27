"use client";

import React from "react";
import { Piece, PieceRank } from "@/lib/game/constants";
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
  HelpCircle,
} from "lucide-react";

interface PieceTileProps {
  piece: Piece | null;
  isSelected?: boolean;
  isOpponentPOV?: boolean;
  onClick?: () => void;
}

export function PieceTile({ piece, isSelected, isOpponentPOV, onClick }: PieceTileProps) {
  if (!piece) return null;

  const isHidden = isOpponentPOV && !piece.revealed;

  const renderRoleSymbol = (rank: PieceRank) => {
    switch (rank) {
      case "Flag":
        return <FlagIcon className="w-5 h-5 text-red-400 mb-0.5 animate-bounce" />;
      case "Spy":
        return <Target className="w-5 h-5 text-fuchsia-300 mb-0.5 animate-pulse" />;
      case "Private":
        return <Shield className="w-4 h-4 text-emerald-300 mb-0.5" />;
      case "Sergeant":
        return <ChevronUp className="w-5 h-5 text-cyan-300 mb-0.5" />;
      case "2nd Lieutenant":
        return <Award className="w-4 h-4 text-cyan-300 mb-0.5" />;
      case "1st Lieutenant":
        return <Medal className="w-4 h-4 text-teal-300 mb-0.5" />;
      case "Captain":
        return <Compass className="w-4 h-4 text-indigo-300 mb-0.5" />;
      case "Major":
        return <Zap className="w-4 h-4 text-amber-300 mb-0.5" />;
      case "Lieutenant Colonel":
        return <ShieldAlert className="w-4 h-4 text-pink-300 mb-0.5" />;
      case "Colonel":
        return <Crown className="w-4 h-4 text-cyan-300 mb-0.5" />;
      case "1 Star General":
        return (
          <div className="flex items-center space-x-0.5 mb-0.5">
            <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
          </div>
        );
      case "2 Star General":
        return (
          <div className="flex items-center space-x-0.5 mb-0.5">
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
          </div>
        );
      case "3 Star General":
        return (
          <div className="flex items-center space-x-0.5 mb-0.5">
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
          </div>
        );
      case "4 Star General":
        return (
          <div className="flex items-center space-x-0.5 mb-0.5">
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
          </div>
        );
      case "5 Star General":
        return (
          <div className="flex flex-col items-center mb-0.5">
            <Crown className="w-3 h-3 text-cyan-300 mb-0.5" />
            <div className="flex items-center space-x-0.5">
              <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
              <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
              <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
              <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
              <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
            </div>
          </div>
        );
      default:
        return <Shield className="w-4 h-4 text-slate-300 mb-0.5" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex flex-col items-center justify-center rounded-lg p-1 select-none transition-all cursor-pointer shadow-md ${
        isHidden
          ? "bg-gradient-to-b from-[#0B0F19] via-[#050814] to-black border-2 border-cyan-900/80 text-cyan-500"
          : piece.player === "player1"
          ? "bg-gradient-to-b from-cyan-900 via-cyan-950 to-[#050814] border-2 border-cyan-400/80 text-cyan-100"
          : "bg-gradient-to-b from-fuchsia-900 via-fuchsia-950 to-[#050814] border-2 border-fuchsia-400/80 text-fuchsia-100"
      } ${isSelected ? "ring-4 ring-cyan-400 scale-105 z-10 animate-pulse shadow-cyan-500/50" : "hover:scale-102"}`}
    >
      {isHidden ? (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <HelpCircle className="w-5 h-5 text-cyan-400/60 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-wider text-cyan-300/80">
            {piece.player === "player1" ? "CYAN UNIT" : "MAGENTA UNIT"}
          </span>
        </div>
      ) : (
        <>
          {renderRoleSymbol(piece.rank)}
          <span className="text-[10px] font-black text-center leading-tight tracking-tighter">
            {piece.rank}
          </span>
        </>
      )}
    </div>
  );
}
