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

  // Flag vs Flag
  if (attackerRank === "Flag" && defenderRank === "Flag") {
    return {
      winner: "attacker",
      winningPiece: attacker,
      defeatedPiece: defender,
      flagCaptured: true,
    };
  }

  // Flag capture by non-flag piece
  if (defenderRank === "Flag") {
    return {
      winner: "attacker",
      winningPiece: attacker,
      defeatedPiece: defender,
      flagCaptured: true,
    };
  }

  // Flag attacking non-flag piece loses
  if (attackerRank === "Flag") {
    return {
      winner: "defender",
      winningPiece: defender,
      defeatedPiece: attacker,
      flagCaptured: true,
    };
  }

  // Spy vs Spy mutual destruction
  if (attackerRank === "Spy" && defenderRank === "Spy") {
    return {
      winner: "both_eliminated",
      winningPiece: null,
      defeatedPiece: null,
      flagCaptured: false,
    };
  }

  // Spy vs Private interaction (Private eliminates Spy)
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

  // Spy vs Any other Officer or General (Spy eliminates Officer/General)
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

  // Rank comparison for Generals & Officers
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
