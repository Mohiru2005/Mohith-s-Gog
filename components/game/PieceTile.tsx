"use client";

import React from "react";
import { Piece } from "@/lib/game/constants";
import { Shield, Flag as FlagIcon, User, Star, EyeOff } from "lucide-react";

interface PieceTileProps {
  piece: Piece | null;
  isSelected?: boolean;
  isOpponentPOV?: boolean;
  onClick?: () => void;
}

export function PieceTile({ piece, isSelected, isOpponentPOV, onClick }: PieceTileProps) {
  if (!piece) return null;

  const isHidden = isOpponentPOV && !piece.revealed;

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex flex-col items-center justify-center rounded-lg p-1 select-none transition-all cursor-pointer shadow-md ${
        piece.player === "player1"
          ? "bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-500 text-amber-100"
          : "bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 text-slate-100"
      } ${isSelected ? "ring-4 ring-yellow-400 scale-105 z-10 animate-pulse" : "hover:scale-102"}`}
    >
      {isHidden ? (
        <div className="flex flex-col items-center justify-center text-slate-400">
          <EyeOff className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Unknown</span>
        </div>
      ) : (
        <>
          {piece.rank === "Flag" && <FlagIcon className="w-6 h-6 text-red-400 mb-1 animate-bounce" />}
          {piece.rank.includes("General") && <Star className="w-6 h-6 text-yellow-300 mb-1" />}
          {piece.rank === "Spy" && <Shield className="w-6 h-6 text-purple-300 mb-1" />}
          {!["Flag", "Spy"].includes(piece.rank) && !piece.rank.includes("General") && (
            <User className="w-5 h-5 text-amber-200 mb-1" />
          )}

          <span className="text-[11px] font-extrabold text-center leading-tight tracking-tight">
            {piece.rank}
          </span>
        </>
      )}
    </div>
  );
}
