export type PieceRank =
  | "Flag"
  | "Private"
  | "Sergeant"
  | "2nd Lieutenant"
  | "1st Lieutenant"
  | "Captain"
  | "Major"
  | "Lieutenant Colonel"
  | "Colonel"
  | "1 Star General"
  | "2 Star General"
  | "3 Star General"
  | "4 Star General"
  | "5 Star General"
  | "Spy";

export interface Piece {
  id: string;
  rank: PieceRank;
  player: "player1" | "player2";
  revealed?: boolean;
}

export const PIECE_RANKS: Record<PieceRank, number> = {
  Flag: 0,
  Private: 1,
  Sergeant: 2,
  "2nd Lieutenant": 3,
  "1st Lieutenant": 4,
  Captain: 5,
  Major: 6,
  "Lieutenant Colonel": 7,
  Colonel: 8,
  "1 Star General": 9,
  "2 Star General": 10,
  "3 Star General": 11,
  "4 Star General": 12,
  "5 Star General": 13,
  Spy: 14,
};

export const INITIAL_PIECES_LIST: PieceRank[] = [
  "Flag",
  "Spy",
  "Spy",
  "Private",
  "Private",
  "Private",
  "Private",
  "Private",
  "Private",
  "Sergeant",
  "2nd Lieutenant",
  "1st Lieutenant",
  "Captain",
  "Major",
  "Lieutenant Colonel",
  "Colonel",
  "1 Star General",
  "2 Star General",
  "3 Star General",
  "4 Star General",
  "5 Star General",
];

export const BOARD_ROWS = 8;
export const BOARD_COLS = 9;

export type BoardState = (Piece | null)[][];
