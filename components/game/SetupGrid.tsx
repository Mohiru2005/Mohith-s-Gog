"use client";

import React, { useState } from "react";
import { BOARD_COLS, BOARD_ROWS, BoardState, INITIAL_PIECES_LIST, Piece, PieceRank } from "@/lib/game/constants";
import { PieceTile } from "./PieceTile";
import { Shuffle, CheckCircle, Sparkles } from "lucide-react";

interface SetupGridProps {
  player: "player1" | "player2";
  onSetupComplete: (board: BoardState) => void;
}

export function SetupGrid({ player, onSetupComplete }: SetupGridProps) {
  const allowedRows = player === "player1" ? [5, 6, 7] : [0, 1, 2];

  const [board, setBoard] = useState<BoardState>(() => {
    const b = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
    return b;
  });

  const [unplaced, setUnplaced] = useState<PieceRank[]>(INITIAL_PIECES_LIST);
  const [selectedUnplacedIndex, setSelectedUnplacedIndex] = useState<number | null>(null);

  const handleRandomize = () => {
    const newBoard = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
    const shuffled = [...INITIAL_PIECES_LIST].sort(() => Math.random() - 0.5);

    let idx = 0;
    for (const r of allowedRows) {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (idx < shuffled.length) {
          newBoard[r][c] = {
            id: `${player}-${shuffled[idx]}-${idx}`,
            rank: shuffled[idx],
            player,
          };
          idx++;
        }
      }
    }

    setBoard(newBoard);
    setUnplaced([]);
    setSelectedUnplacedIndex(null);
  };

  const handleCellClick = (r: number, c: number) => {
    if (!allowedRows.includes(r)) return;

    const currentPiece = board[r][c];

    // Placing a selected unplaced piece
    if (selectedUnplacedIndex !== null && unplaced[selectedUnplacedIndex]) {
      const rankToPlace = unplaced[selectedUnplacedIndex];
      const newBoard = board.map((row) => [...row]);

      // If square was occupied, return old piece to unplaced pool
      const newUnplaced = [...unplaced];
      newUnplaced.splice(selectedUnplacedIndex, 1);
      if (currentPiece) {
        newUnplaced.push(currentPiece.rank);
      }

      newBoard[r][c] = {
        id: `${player}-${rankToPlace}-${Date.now()}`,
        rank: rankToPlace,
        player,
      };

      setBoard(newBoard);
      setUnplaced(newUnplaced);
      setSelectedUnplacedIndex(null);
    } else if (currentPiece) {
      // Remove piece back to pool
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = null;
      setBoard(newBoard);
      setUnplaced([...unplaced, currentPiece.rank]);
    }
  };

  const isReady = unplaced.length === 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-4xl mx-auto p-4 select-none">
      <div className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div>
          <h2 className="text-xl font-extrabold text-amber-400">Tactical Setup Phase</h2>
          <p className="text-xs text-slate-400">
            Arrange your 21 pieces on your 3 designated rows before battle begins.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleRandomize}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold px-4 py-2 rounded-xl transition"
          >
            <Shuffle className="w-4 h-4" />
            <span>Auto Deploy</span>
          </button>

          <button
            disabled={!isReady}
            onClick={() => onSetupComplete(board)}
            className={`flex items-center space-x-2 font-bold px-6 py-2 rounded-xl transition shadow-lg ${
              isReady
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirm Setup ({21 - unplaced.length}/21)</span>
          </button>
        </div>
      </div>

      {/* 9x8 Setup Grid */}
      <div className="relative p-3 bg-slate-900 rounded-2xl border-4 border-amber-900/60 shadow-2xl">
        <div className="grid grid-rows-8 gap-1.5 bg-slate-950 p-2 rounded-xl">
          {Array.from({ length: BOARD_ROWS }).map((_, r) => {
            const isAllowed = allowedRows.includes(r);
            return (
              <div key={r} className="grid grid-cols-9 gap-1.5">
                {Array.from({ length: BOARD_COLS }).map((_, c) => {
                  const piece = board[r][c];

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all ${
                        isAllowed
                          ? "bg-amber-950/30 border-2 border-dashed border-amber-600/50 hover:bg-amber-900/40 cursor-pointer"
                          : "bg-slate-900/40 border border-slate-800 opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <PieceTile piece={piece} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unplaced Pieces Dock */}
      {unplaced.length > 0 && (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">
            Unplaced Army Reserve ({unplaced.length} Remaining)
          </h3>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
            {unplaced.map((rank, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedUnplacedIndex(idx === selectedUnplacedIndex ? null : idx)}
                className={`w-12 h-12 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center p-1 border transition ${
                  selectedUnplacedIndex === idx
                    ? "bg-amber-600 text-white border-amber-400 ring-2 ring-yellow-400 scale-105"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <span>{rank}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
