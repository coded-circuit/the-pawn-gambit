import { Difficulty, PieceType } from "../../../global/utils";

const survivalTurnMilestones = {
  0: 50, // 0-49
  50: 100,
  100: 200,
  200: 300,
  300: 500,
};
const difficultyMultiplier = {
  [Difficulty.EASY]: 1.0,
  [Difficulty.NORMAL]: 1.5,
  [Difficulty.HARD]: 2.0,
};
const pieceCaptureReward = {
  [PieceType.PLAYER]: null,
  [PieceType.QUEEN]: 2000,
  [PieceType.ROOK]: 1500,
  [PieceType.BISHOP]: 800,
  [PieceType.KNIGHT]: 800,
  [PieceType.PAWN_N]: 300,
  [PieceType.PAWN_E]: 300,
  [PieceType.PAWN_W]: 300,
  [PieceType.PAWN_S]: 300,
};

Object.freeze(survivalTurnMilestones);
Object.freeze(difficultyMultiplier);
Object.freeze(pieceCaptureReward);

export function getPassiveScoreIncrease(difficulty, turnNumber) {
  let prevMilestone = 0;
  for (let milestone in survivalTurnMilestones) {
    if (turnNumber > Number(milestone)) {
      prevMilestone = milestone;
      continue;
    }
    return (
      survivalTurnMilestones[prevMilestone] * difficultyMultiplier[difficulty]
    );
  }
  return (
    survivalTurnMilestones[prevMilestone] * difficultyMultiplier[difficulty]
  );
}

export function getPieceCaptureScoreIncrease(difficulty, pieceType) {
  return pieceCaptureReward[pieceType] * difficultyMultiplier[difficulty];
}
