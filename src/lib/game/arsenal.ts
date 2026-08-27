import { BOARD_COLS, BOARD_ROWS, BoardState, PieceRank } from "./constants";

export interface SavedLoadout {
  id: string;
  name: string;
  createdAt: number;
  positions: { row: number; col: number; rank: PieceRank }[];
}

const ARSENAL_STORAGE_KEY = "gog_army_arsenal_loadouts_v1";

export const DEFAULT_PRESET_LOADOUTS: SavedLoadout[] = [
  {
    id: "preset-iron-wall",
    name: "Iron Wall Defense",
    createdAt: Date.now(),
    positions: [
      { row: 7, col: 0, rank: "Flag" },
      { row: 7, col: 1, rank: "5 Star General" },
      { row: 7, col: 2, rank: "4 Star General" },
      { row: 7, col: 3, rank: "3 Star General" },
      { row: 7, col: 4, rank: "2 Star General" },
      { row: 7, col: 5, rank: "1 Star General" },
      { row: 7, col: 6, rank: "Colonel" },
      { row: 7, col: 7, rank: "Lieutenant Colonel" },
      { row: 7, col: 8, rank: "Major" },
      { row: 6, col: 0, rank: "Captain" },
      { row: 6, col: 1, rank: "1st Lieutenant" },
      { row: 6, col: 2, rank: "2nd Lieutenant" },
      { row: 6, col: 3, rank: "Sergeant" },
      { row: 6, col: 4, rank: "Spy" },
      { row: 6, col: 5, rank: "Spy" },
      { row: 6, col: 6, rank: "Private" },
      { row: 6, col: 7, rank: "Private" },
      { row: 6, col: 8, rank: "Private" },
      { row: 5, col: 0, rank: "Private" },
      { row: 5, col: 1, rank: "Private" },
      { row: 5, col: 2, rank: "Private" },
    ],
  },
  {
    id: "preset-vanguard-blitz",
    name: "Vanguard Blitz Attack",
    createdAt: Date.now() - 1000,
    positions: [
      { row: 5, col: 0, rank: "Spy" },
      { row: 5, col: 1, rank: "5 Star General" },
      { row: 5, col: 2, rank: "Private" },
      { row: 5, col: 3, rank: "Spy" },
      { row: 5, col: 4, rank: "4 Star General" },
      { row: 5, col: 5, rank: "Private" },
      { row: 5, col: 6, rank: "3 Star General" },
      { row: 5, col: 7, rank: "Private" },
      { row: 5, col: 8, rank: "Private" },
      { row: 6, col: 0, rank: "2 Star General" },
      { row: 6, col: 1, rank: "1 Star General" },
      { row: 6, col: 2, rank: "Colonel" },
      { row: 6, col: 3, rank: "Lieutenant Colonel" },
      { row: 6, col: 4, rank: "Major" },
      { row: 6, col: 5, rank: "Captain" },
      { row: 6, col: 6, rank: "1st Lieutenant" },
      { row: 6, col: 7, rank: "2nd Lieutenant" },
      { row: 6, col: 8, rank: "Sergeant" },
      { row: 7, col: 0, rank: "Flag" },
      { row: 7, col: 1, rank: "Private" },
      { row: 7, col: 2, rank: "Private" },
    ],
  },
];

export function getSavedLoadouts(): SavedLoadout[] {
  if (typeof window === "undefined") return DEFAULT_PRESET_LOADOUTS;
  try {
    const raw = localStorage.getItem(ARSENAL_STORAGE_KEY);
    if (!raw) return DEFAULT_PRESET_LOADOUTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESET_LOADOUTS;
  } catch (e) {
    return DEFAULT_PRESET_LOADOUTS;
  }
}

export function saveLoadout(name: string, board: BoardState, player: "player1" | "player2"): SavedLoadout {
  const allowedRows = player === "player1" ? [5, 6, 7] : [0, 1, 2];
  const positions: { row: number; col: number; rank: PieceRank }[] = [];

  for (const r of allowedRows) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece) {
        positions.push({ row: r, col: c, rank: piece.rank });
      }
    }
  }

  const newLoadout: SavedLoadout = {
    id: `loadout-${Date.now()}`,
    name: name.trim() || `Tactical Loadout #${Date.now().toString().slice(-4)}`,
    createdAt: Date.now(),
    positions,
  };

  const existing = getSavedLoadouts();
  const updated = [newLoadout, ...existing];
  if (typeof window !== "undefined") {
    localStorage.setItem(ARSENAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return newLoadout;
}

export function deleteLoadout(id: string): SavedLoadout[] {
  const existing = getSavedLoadouts();
  const updated = existing.filter((l) => l.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(ARSENAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function applyLoadoutToBoard(loadout: SavedLoadout, player: "player1" | "player2"): BoardState {
  const board: BoardState = Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null));

  const targetRows = player === "player1" ? [5, 6, 7] : [0, 1, 2];
  const defaultRows = [5, 6, 7];

  loadout.positions.forEach((pos, idx) => {
    // Map relative row (0, 1, 2 from designated setup region)
    const relRowIndex = defaultRows.indexOf(pos.row);
    const actualRow = relRowIndex !== -1 ? targetRows[relRowIndex] : targetRows[idx % 3];

    board[actualRow][pos.col] = {
      id: `${player}-${pos.rank}-${idx}`,
      rank: pos.rank,
      player,
    };
  });

  return board;
}
