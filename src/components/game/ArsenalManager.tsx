"use client";

import React, { useState, useEffect } from "react";
import {
  SavedLoadout,
  getSavedLoadouts,
  saveLoadout,
  deleteLoadout,
  applyLoadoutToBoard,
} from "@/lib/game/arsenal";
import { BoardState } from "@/lib/game/constants";
import { Shield, Plus, Trash2, BookmarkCheck, Check, FolderOpen, Cpu } from "lucide-react";

interface ArsenalManagerProps {
  player: "player1" | "player2";
  currentBoard?: BoardState;
  onApplyLoadout: (board: BoardState) => void;
}

export function ArsenalManager({ player, currentBoard, onApplyLoadout }: ArsenalManagerProps) {
  const [loadouts, setLoadouts] = useState<SavedLoadout[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newLoadoutName, setNewLoadoutName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setLoadouts(getSavedLoadouts());
  }, []);

  const handleSaveCurrent = () => {
    if (!currentBoard) return;

    const saved = saveLoadout(newLoadoutName, currentBoard, player);
    setLoadouts(getSavedLoadouts());
    setSelectedId(saved.id);
    setNewLoadoutName("");
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleApply = (loadout: SavedLoadout) => {
    const board = applyLoadoutToBoard(loadout, player);
    onApplyLoadout(board);
    setSelectedId(loadout.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteLoadout(id);
    setLoadouts(updated);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="w-full bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(56,189,248,0.1)] space-y-4">
      <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Quantum Arsenal Grid</h3>
        </div>

        {currentBoard && (
          <button
            onClick={() => setIsSaving(!isSaving)}
            className="flex items-center space-x-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold px-3 py-1.5 rounded-xl text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Current Grid</span>
          </button>
        )}
      </div>

      {isSaving && (
        <div className="bg-[#050814] border border-cyan-500/40 rounded-xl p-3 space-y-2 animate-in fade-in">
          <label className="text-[11px] font-bold text-cyan-300 block">Loadout Name</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. Quantum Vanguard, Shield Defense..."
              value={newLoadoutName}
              onChange={(e) => setNewLoadoutName(e.target.value)}
              className="flex-1 bg-[#090D1F] border border-cyan-900/60 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSaveCurrent}
              className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black px-4 py-1.5 rounded-lg text-xs transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-2 rounded-lg flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Formation saved to Quantum Arsenal!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loadouts.map((loadout) => {
          const isSelected = selectedId === loadout.id;
          return (
            <div
              key={loadout.id}
              onClick={() => handleApply(loadout)}
              className={`relative cursor-pointer p-3 rounded-xl border transition-all ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg"
                  : "bg-[#050814]/80 border-cyan-900/40 hover:border-cyan-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5 truncate">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-bold text-xs text-white truncate">{loadout.name}</span>
                </div>

                {!loadout.id.startsWith("preset-") && (
                  <button
                    onClick={(e) => handleDelete(loadout.id, e)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                    title="Delete saved loadout"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-cyan-900/40">
                <span>{loadout.positions.length} Units</span>
                <span className="font-mono text-cyan-400 font-bold flex items-center space-x-1">
                  {isSelected ? (
                    <>
                      <BookmarkCheck className="w-3 h-3 text-emerald-400 inline" />
                      <span className="text-emerald-400">Deployed</span>
                    </>
                  ) : (
                    <span>Click to Deploy</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
