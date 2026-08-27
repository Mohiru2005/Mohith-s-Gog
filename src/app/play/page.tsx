"use client";

import React, { useState } from "react";
import { BOARD_COLS, BOARD_ROWS, BoardState } from "@/lib/game/constants";
import { GameState } from "@/lib/game/engine";
import { SetupGrid } from "@/components/game/SetupGrid";
import { GameBoard } from "@/components/game/GameBoard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RefreshCw, Users, Cpu } from "lucide-react";

export default function PlayPage() {
  const [setupStep, setSetupStep] = useState<"player1_setup" | "player2_setup" | "playing">("player1_setup");
  const [player1Board, setPlayer1Board] = useState<BoardState | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleP1SetupComplete = (boardP1: BoardState) => {
    setPlayer1Board(boardP1);
    setSetupStep("player2_setup");
  };

  const handleP2SetupComplete = (boardP2: BoardState) => {
    if (!player1Board) return;

    const combinedBoard = Array(BOARD_ROWS)
      .fill(null)
      .map(() => Array(BOARD_COLS).fill(null));

    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (player1Board[r][c]) combinedBoard[r][c] = player1Board[r][c];
        if (boardP2[r][c]) combinedBoard[r][c] = boardP2[r][c];
      }
    }

    setGameState({
      board: combinedBoard,
      currentTurn: "player1",
      status: "playing",
      winner: null,
      history: [],
    });
    setSetupStep("playing");
  };

  const handleReset = () => {
    setGameState(null);
    setPlayer1Board(null);
    setSetupStep("player1_setup");
  };

  return (
    <AuthGuard>
      <div className="space-y-6 py-2 select-none">
        <div className="flex items-center justify-between bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Local 1v1 Pass & Play Match</h1>
              <p className="text-xs text-slate-400">
                {setupStep === "player1_setup" && "Step 1: Player 1 (Cyan) Army Placement"}
                {setupStep === "player2_setup" && "Step 2: Player 2 (Magenta) Army Placement"}
                {setupStep === "playing" && "Quantum Battle in Progress"}
              </p>
            </div>
          </div>

          {setupStep !== "player1_setup" && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 bg-[#050814] hover:bg-slate-900 text-cyan-300 font-bold px-4 py-2 rounded-xl text-xs border border-cyan-500/30 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restart Setup</span>
            </button>
          )}
        </div>

        {setupStep === "player1_setup" && (
          <div className="space-y-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold p-3 rounded-xl text-center">
              ★ Player 1 (Cyan): Deploy your 21 units on rows 5, 6, and 7.
            </div>
            <SetupGrid player="player1" onSetupComplete={handleP1SetupComplete} />
          </div>
        )}

        {setupStep === "player2_setup" && (
          <div className="space-y-4">
            <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold p-3 rounded-xl text-center">
              ★ Player 2 (Magenta): Deploy your 21 units on rows 0, 1, and 2.
            </div>
            <SetupGrid player="player2" onSetupComplete={handleP2SetupComplete} />
          </div>
        )}

        {setupStep === "playing" && gameState && (
          <GameBoard
            initialState={gameState}
            onRestart={handleReset}
            perspective="player1"
          />
        )}
      </div>
    </AuthGuard>
  );
}
