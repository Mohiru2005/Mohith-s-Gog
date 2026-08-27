"use client";

import React, { useState } from "react";
import { BOARD_COLS, BOARD_ROWS, BoardState, INITIAL_PIECES_LIST, PieceRank } from "@/lib/game/constants";
import { PieceTile } from "./PieceTile";
import { ArsenalManager } from "./ArsenalManager";
import { Shuffle, CheckCircle, Cpu } from "lucide-react";

interface SetupGridProps {
  player: "player1" | "player2";
  onSetupComplete: (board: BoardState) => void;
}

export function SetupGrid({ player, onSetupComplete }: SetupGridProps) {
  const allowedRows = player === "player1" ? [5, 6, 7] : [0, 1, 2];

  const [board, setBoard] = useState<BoardState>(() => {
    return Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
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

  const handleApplyArsenalLoadout = (newBoard: BoardState) => {
    setBoard(newBoard);
    setUnplaced([]);
    setSelectedUnplacedIndex(null);
  };

  const handleCellClick = (r: number, c: number) => {
    if (!allowedRows.includes(r)) return;

    const currentPiece = board[r][c];

    if (selectedUnplacedIndex !== null && unplaced[selectedUnplacedIndex]) {
      const rankToPlace = unplaced[selectedUnplacedIndex];
      const newBoard = board.map((row) => [...row]);

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
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = null;
      setBoard(newBoard);
      setUnplaced([...unplaced, currentPiece.rank]);
    }
  };

  const isReady = unplaced.length === 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-4xl mx-auto p-2 sm:p-4 select-none">
      {/* Arsenal Loadout Library Header */}
      <ArsenalManager
        player={player}
        currentBoard={isReady ? board : undefined}
        onApplyLoadout={handleApplyArsenalLoadout}
      />

      {/* Main Setup Controls */}
      <div className="w-full flex items-center justify-between bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
        <div>
          <h2 className="text-lg font-black text-cyan-300">Quantum Army Placement</h2>
          <p className="text-xs text-slate-400">
            Deploy your 21 military units manually, select an Arsenal grid, or auto-deploy.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleRandomize}
            className="flex items-center space-x-2 bg-[#050814] hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            <Shuffle className="w-4 h-4" />
            <span>Auto Deploy</span>
          </button>

          <button
            disabled={!isReady}
            onClick={() => onSetupComplete(board)}
            className={`flex items-center space-x-2 font-bold px-6 py-2 rounded-xl text-xs transition shadow-lg ${
              isReady
                ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 cursor-pointer font-black"
                : "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm Grid ({21 - unplaced.length}/21)</span>
          </button>
        </div>
      </div>

      {/* 9x8 Setup Grid */}
      <div className="relative p-3 bg-gradient-to-b from-[#090D1F] via-[#050814] to-[#090D1F] rounded-2xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
        <div className="grid grid-rows-8 gap-1.5 bg-[#050814] p-2 rounded-xl border border-cyan-900/60">
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
                      className={`w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-all ${
                        isAllowed
                          ? "bg-cyan-950/30 border-2 border-dashed border-cyan-500/50 hover:bg-cyan-900/40 cursor-pointer"
                          : "bg-[#050814] border border-slate-800 opacity-40 cursor-not-allowed"
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

      {/* Unplaced Reserve Dock */}
      {unplaced.length > 0 && (
        <div className="w-full bg-[#090D1F] border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-bold uppercase text-cyan-400 mb-3 tracking-wider">
            Unplaced Unit Reserve ({unplaced.length} Remaining)
          </h3>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
            {unplaced.map((rank, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedUnplacedIndex(idx === selectedUnplacedIndex ? null : idx)}
                className={`w-11 h-11 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center p-1 border transition ${
                  selectedUnplacedIndex === idx
                    ? "bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400 scale-105"
                    : "bg-[#050814] text-slate-300 border-cyan-900/60 hover:bg-slate-900"
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
