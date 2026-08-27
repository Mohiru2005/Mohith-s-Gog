import { Piece, PIECE_RANKS } from "./constants";

export type BattleResult = {
  winner: "attacker" | "defender" | "both_eliminated";
  winningPiece: Piece | null;
  defeatedPiece: Piece | null;
  flagCaptured: boolean;
};

export function arbitrateBattle(attacker: Piece, defender: Piece): BattleResult {
  const attackerRank = attacker.rank;
  const defenderRank = defender.rank;

  // Flag capture
  if (defenderRank === "Flag") {
    return {
      winner: "attacker",
      winningPiece: attacker,
      defeatedPiece: defender,
      flagCaptured: true,
    };
  }
  if (attackerRank === "Flag") {
    return {
      winner: "defender",
      winningPiece: defender,
      defeatedPiece: attacker,
      flagCaptured: true,
    };
  }

  // Spy vs Private interaction
  if (attackerRank === "Spy" && defenderRank === "Private") {
    return {
      winner: "defender",
      winningPiece: defender,
      defeatedPiece: attacker,
      flagCaptured: false,
    };
  }
  if (attackerRank === "Private" && defenderRank === "Spy") {
    return {
      winner: "attacker",
      winningPiece: attacker,
      defeatedPiece: defender,
      flagCaptured: false,
    };
  }

  // Spy vs Any other piece
  if (attackerRank === "Spy") {
    return {
      winner: "attacker",
      winningPiece: attacker,
      defeatedPiece: defender,
      flagCaptured: false,
    };
  }
  if (defenderRank === "Spy") {
    return {
      winner: "defender",
      winningPiece: defender,
      defeatedPiece: attacker,
      flagCaptured: false,
    };
  }

  // Rank comparison
  const valAttacker = PIECE_RANKS[attackerRank];
  const valDefender = PIECE_RANKS[defenderRank];

  if (valAttacker === valDefender) {
    return {
      winner: "both_eliminated",
      winningPiece: null,
      defeatedPiece: null,
      flagCaptured: false,
    };
  }

  if (valAttacker > valDefender) {
    return {
      winner: "attacker",
      winningPiece: attacker,
      defeatedPiece: defender,
      flagCaptured: false,
    };
  }

  return {
    winner: "defender",
    winningPiece: defender,
    defeatedPiece: attacker,
    flagCaptured: false,
  };
}
