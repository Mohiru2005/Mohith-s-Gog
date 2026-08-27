"use client";

import React, { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/game/constants";
import { GameState, isValidMove, makeMove, Position } from "@/lib/game/engine";
import { PieceTile } from "./PieceTile";
import { RankLegendSidebar } from "./RankLegendSidebar";
import { CapturedPiecesSidebar } from "./CapturedPiecesSidebar";
import { Trophy, RefreshCw, Eye, EyeOff, Swords, Cpu } from "lucide-react";

interface GameBoardProps {
  initialState: GameState;
  onMoveExecuted?: (newState: GameState) => void;
  onRestart?: () => void;
  perspective?: "player1" | "player2";
  allowBothPlayers?: boolean;
}

export function GameBoard({
  initialState,
  onMoveExecuted,
  onRestart,
  perspective = "player1",
  allowBothPlayers = true,
}: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [revealAll, setRevealAll] = useState<boolean>(false);

  const activePlayer = allowBothPlayers ? gameState.currentTurn : perspective;

  const handleSquareClick = (row: number, col: number) => {
    if (gameState.status !== "playing") return;

    const clickedPiece = gameState.board[row][col];

    if (clickedPiece && clickedPiece.player === activePlayer) {
      setSelectedPos({ row, col });
      return;
    }

    if (selectedPos) {
      if (isValidMove(gameState.board, selectedPos, { row, col }, activePlayer)) {
        try {
          const { newState } = makeMove(gameState, selectedPos, { row, col });
          setGameState(newState);
          setSelectedPos(null);
          if (onMoveExecuted) onMoveExecuted(newState);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSelectedPos(null);
      }
    }
  };

  const isLegalTarget = (r: number, c: number) => {
    if (!selectedPos) return false;
    return isValidMove(gameState.board, selectedPos, { row: r, col: c }, activePlayer);
  };

  return (
    <div className="flex flex-row items-start justify-center gap-2 md:gap-3 lg:gap-4 w-full max-w-7xl mx-auto p-1 sm:p-2 md:p-4 select-none">
      {/* Left Box: Quantum Rank Matrix */}
      <RankLegendSidebar />

      {/* Center: Main Quantum Game Board Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 w-full min-w-[320px]">
        {/* Quantum Status Bar */}
        <div className="w-full flex items-center justify-between bg-[#090D1F]/90 border border-cyan-500/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                gameState.currentTurn === "player1" ? "bg-amber-400 ring-4 ring-amber-500/30 animate-pulse" : "bg-slate-700"
              }`}
            />
            <span className={`font-black text-xs sm:text-sm ${gameState.currentTurn === "player1" ? "text-amber-400" : "text-slate-500"}`}>
              P1 (Gold)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-[#050814] px-3 py-1 rounded-full border border-cyan-500/30">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-black text-cyan-300">
                {gameState.status === "playing"
                  ? `Active Turn: ${gameState.currentTurn === "player1" ? "P1 Gold" : "P2 Cyan"}`
                  : "Game Over"}
              </span>
            </div>

            <button
              onClick={() => setRevealAll(!revealAll)}
              className="flex items-center space-x-1 bg-[#050814] hover:bg-slate-900 text-slate-300 border border-cyan-500/30 font-bold px-2 py-1 rounded-lg text-xs transition"
              title="Toggle visibility of hidden piece ranks"
            >
              {revealAll ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="hidden sm:inline">{revealAll ? "Visible Ranks" : "Fog of War"}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`font-black text-xs sm:text-sm ${gameState.currentTurn === "player2" ? "text-cyan-400" : "text-slate-500"}`}>
              P2 (Cyan)
            </span>
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                gameState.currentTurn === "player2" ? "bg-cyan-400 ring-4 ring-cyan-500/30 animate-pulse" : "bg-slate-700"
              }`}
            />
          </div>
        </div>

        {/* Board Grid */}
        <div className="relative p-2.5 bg-gradient-to-b from-[#090D1F] via-[#050814] to-[#090D1F] rounded-2xl border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(56,189,248,0.15)] overflow-x-auto max-w-full">
          <div className="grid grid-rows-8 gap-1.5 bg-[#050814] p-2 rounded-xl border border-cyan-900/60">
            {Array.from({ length: BOARD_ROWS }).map((_, r) => (
              <div key={r} className="grid grid-cols-9 gap-1.5">
                {Array.from({ length: BOARD_COLS }).map((_, c) => {
                  const piece = gameState.board[r][c];
                  const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                  const isTarget = isLegalTarget(r, c);
                  const isOpponentPiece = piece && piece.player !== activePlayer;
                  const hideRank = isOpponentPiece && !revealAll;

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleSquareClick(r, c)}
                      className={`w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center transition-all ${
                        (r + c) % 2 === 0
                          ? "bg-slate-900/90 border border-cyan-900/40"
                          : "bg-[#090D1F] border border-cyan-900/60"
                      } ${isTarget ? "ring-2 ring-emerald-400 bg-emerald-950/60 cursor-pointer scale-102" : ""}`}
                    >
                      <PieceTile
                        piece={piece}
                        isSelected={isSelected}
                        isOpponentPOV={hideRank}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Game Over Modal */}
        {gameState.status === "finished" && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#090D1F] border-2 border-cyan-500/60 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(56,189,248,0.3)] animate-in fade-in zoom-in space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h2 className="text-3xl font-black text-amber-400 tracking-wider">VICTORY DETECTED!</h2>
              <p className="text-xl text-white font-bold">
                Winner: {gameState.winner === "player1" ? "Player 1 (Gold)" : "Player 2 (Cyan)"}
              </p>
              {gameState.winReason && (
                <p className="text-xs text-cyan-400/80 italic">{gameState.winReason}</p>
              )}

              <div className="flex space-x-3 justify-center pt-2">
                {onRestart && (
                  <button
                    onClick={onRestart}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg transition"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Play Again</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Box: Quantum Captured Feed */}
      <CapturedPiecesSidebar history={gameState.history} board={gameState.board} />
    </div>
  );
}
