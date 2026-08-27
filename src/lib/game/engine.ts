import { BOARD_COLS, BOARD_ROWS, BoardState, Piece, PieceRank } from "./constants";
import { arbitrateBattle, BattleResult } from "./arbitration";

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: BoardState;
  currentTurn: "player1" | "player2";
  status: "setup" | "playing" | "finished";
  winner: "player1" | "player2" | "draw" | null;
  winReason?: string;
  history: MoveRecord[];
}

export interface MoveRecord {
  from: Position;
  to: Position;
  player: "player1" | "player2";
  result?: BattleResult;
}

export function createEmptyBoard(): BoardState {
  return Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null));
}

export function isValidMove(
  board: BoardState,
  from: Position,
  to: Position,
  player: "player1" | "player2"
): boolean {
  if (
    from.row < 0 ||
    from.row >= BOARD_ROWS ||
    from.col < 0 ||
    from.col >= BOARD_COLS ||
    to.row < 0 ||
    to.row >= BOARD_ROWS ||
    to.col < 0 ||
    to.col >= BOARD_COLS
  ) {
    return false;
  }

  const piece = board[from.row][from.col];
  if (!piece || piece.player !== player) {
    return false;
  }

  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  // Orthogonal movement of exactly 1 square
  if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
    return false;
  }

  const targetPiece = board[to.row][to.col];
  // Cannot attack friendly piece
  if (targetPiece && targetPiece.player === player) {
    return false;
  }

  return true;
}

export function makeMove(
  state: GameState,
  from: Position,
  to: Position
): { newState: GameState; battleResult?: BattleResult } {
  if (state.status !== "playing") {
    throw new Error("Game is not in playing state");
  }

  const { board, currentTurn } = state;
  if (!isValidMove(board, from, to, currentTurn)) {
    throw new Error("Invalid move");
  }

  const newBoard = board.map((row) => [...row]);
  const movingPiece = newBoard[from.row][from.col]!;
  const targetPiece = newBoard[to.row][to.col];

  let battleResult: BattleResult | undefined;
  newBoard[from.row][from.col] = null;

  if (targetPiece) {
    battleResult = arbitrateBattle(movingPiece, targetPiece);
    if (battleResult.winner === "attacker") {
      newBoard[to.row][to.col] = movingPiece;
    } else if (battleResult.winner === "defender") {
      newBoard[to.row][to.col] = targetPiece;
    } else {
      newBoard[to.row][to.col] = null; // Both eliminated
    }
  } else {
    newBoard[to.row][to.col] = movingPiece;
  }

  const nextTurn: "player1" | "player2" = currentTurn === "player1" ? "player2" : "player1";
  let winner: "player1" | "player2" | "draw" | null = null;
  let winReason: string | undefined;

  // Win Condition 1: Flag Captured
  if (battleResult?.flagCaptured) {
    winner = battleResult.winner === "attacker" ? currentTurn : nextTurn;
    winReason = "Enemy Flag Captured!";
  }

  // Win Condition 2: Flag Reached Opponent's Back Rank
  if (!winner) {
    const landedPiece = newBoard[to.row][to.col];
    if (landedPiece && landedPiece.rank === "Flag") {
      if (landedPiece.player === "player1" && to.row === 0) {
        winner = "player1";
        winReason = "Flag safely invaded enemy territory!";
      } else if (landedPiece.player === "player2" && to.row === BOARD_ROWS - 1) {
        winner = "player2";
        winReason = "Flag safely invaded enemy territory!";
      }
    }
  }

  // Win Condition 3: Opponent has no movable pieces
  if (!winner) {
    const opponentPieces = countPlayerPieces(newBoard, nextTurn);
    if (opponentPieces === 0) {
      winner = currentTurn;
      winReason = "All opponent pieces eliminated!";
    }
  }

  const newState: GameState = {
    ...state,
    board: newBoard,
    currentTurn: nextTurn,
    status: winner ? "finished" : "playing",
    winner,
    winReason,
    history: [
      ...state.history,
      {
        from,
        to,
        player: currentTurn,
        result: battleResult,
      },
    ],
  };

  return { newState, battleResult };
}

export function countPlayerPieces(board: BoardState, player: "player1" | "player2"): number {
  let count = 0;
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      if (board[r][c]?.player === player) {
        count++;
      }
    }
  }
  return count;
}
