"use client";

import React, { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/game/constants";
import { GameState, isValidMove, makeMove, Position } from "@/lib/game/engine";
import { PieceTile } from "./PieceTile";
import { Trophy, RefreshCw, ArrowLeft, Volume2 } from "lucide-react";

interface GameBoardProps {
  initialState: GameState;
  onMoveExecuted?: (newState: GameState) => void;
  onRestart?: () => void;
  perspective?: "player1" | "player2";
}

export function GameBoard({ initialState, onMoveExecuted, onRestart, perspective = "player1" }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);

  const isMyTurn = gameState.currentTurn === perspective;

  const handleSquareClick = (row: number, col: number) => {
    if (gameState.status !== "playing" || !isMyTurn) return;

    const clickedPiece = gameState.board[row][col];

    // Select friendly piece
    if (clickedPiece && clickedPiece.player === perspective) {
      setSelectedPos({ row, col });
      return;
    }

    // Move selected piece to target square
    if (selectedPos) {
      if (isValidMove(gameState.board, selectedPos, { row, col }, perspective)) {
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
    if (!selectedPos || !isMyTurn) return false;
    return isValidMove(gameState.board, selectedPos, { row: r, col: c }, perspective);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 max-w-4xl mx-auto p-4 select-none">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div
            className={`w-4 h-4 rounded-full ${
              gameState.currentTurn === "player1" ? "bg-amber-500 animate-pulse" : "bg-slate-500"
            }`}
          />
          <span className="font-bold text-slate-200">
            Player 1 (Command)
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
          <span className="text-sm font-semibold text-amber-400">
            {gameState.status === "playing"
              ? `Turn: ${gameState.currentTurn === "player1" ? "Player 1" : "Player 2"}`
              : "Game Over"}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-200">
            Player 2 (Opponent)
          </span>
          <div
            className={`w-4 h-4 rounded-full ${
              gameState.currentTurn === "player2" ? "bg-slate-400 animate-pulse" : "bg-slate-500"
            }`}
          />
        </div>
      </div>

      {/* Board Grid */}
      <div className="relative p-3 bg-gradient-to-b from-amber-950/80 via-slate-900 to-amber-950/90 rounded-2xl border-4 border-amber-800/60 shadow-2xl">
        <div className="grid grid-rows-8 gap-1.5 bg-slate-950/80 p-2 rounded-xl border border-amber-900/40">
          {Array.from({ length: BOARD_ROWS }).map((_, r) => (
            <div key={r} className="grid grid-cols-9 gap-1.5">
              {Array.from({ length: BOARD_COLS }).map((_, c) => {
                const piece = gameState.board[r][c];
                const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                const isTarget = isLegalTarget(r, c);
                const isOpponentPiece = piece && piece.player !== perspective;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all ${
                      (r + c) % 2 === 0
                        ? "bg-slate-800/80 border border-slate-700/50"
                        : "bg-slate-900/90 border border-slate-800/60"
                    } ${isTarget ? "ring-2 ring-emerald-400 bg-emerald-950/50 cursor-pointer" : ""}`}
                  >
                    <PieceTile
                      piece={piece}
                      isSelected={isSelected}
                      isOpponentPOV={isOpponentPiece}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-extrabold text-amber-400 mb-2">VICTORY!</h2>
            <p className="text-xl text-slate-200 font-bold mb-1">
              Winner: {gameState.winner === "player1" ? "Player 1" : "Player 2"}
            </p>
            {gameState.winReason && (
              <p className="text-sm text-slate-400 italic mb-6">{gameState.winReason}</p>
            )}

            <div className="flex space-x-3 justify-center">
              {onRestart && (
                <button
                  onClick={onRestart}
                  className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition"
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
  );
}
