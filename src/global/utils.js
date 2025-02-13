// ------------------------------------ CONSTANTS AND ENUMS ------------------------------------
export const TRANSITION_HALF_LIFE = 750;

export const PieceType = {
  PLAYER: 0,
  QUEEN: 1,
  ROOK: 2,
  BISHOP: 3,
  KNIGHT: 4,
  PAWN_N: 5,
  PAWN_E: 6,
  PAWN_W: 7,
  PAWN_S: 8,
};
export const PieceCooldown = {
  [PieceType.PLAYER]: null,
  [PieceType.QUEEN]: 5,
  [PieceType.ROOK]: 4,
  [PieceType.BISHOP]: 4,
  [PieceType.KNIGHT]: 3,
  [PieceType.PAWN_N]: 2,
  [PieceType.PAWN_E]: 2,
  [PieceType.PAWN_W]: 2,
  [PieceType.PAWN_S]: 2,
};
export const PageName = {
  MAIN_MENU: 0,
  GAME: 1,
  OPTIONS: 2,
  CREDITS: 3,
};
export const PieceMovementFunc = {
  [PieceType.PLAYER]: (pos, playerPos, occupied) => {
    assert(false, "Player does not have a movement function");
  },
  [PieceType.QUEEN]: (pos, playerPos, occupied) => {
    return [].concat(
      getMoveCellsByDirection(pos, 1, 0, playerPos, occupied),
      getMoveCellsByDirection(pos, 1, 1, playerPos, occupied),
      getMoveCellsByDirection(pos, 0, 1, playerPos, occupied),
      getMoveCellsByDirection(pos, -1, 1, playerPos, occupied),
      getMoveCellsByDirection(pos, -1, 0, playerPos, occupied),
      getMoveCellsByDirection(pos, -1, -1, playerPos, occupied),
      getMoveCellsByDirection(pos, 0, -1, playerPos, occupied),
      getMoveCellsByDirection(pos, 1, -1, playerPos, occupied)
    );
  },
  [PieceType.ROOK]: (pos, playerPos, occupied) => {
    return [].concat(
      getMoveCellsByDirection(pos, 1, 0, playerPos, occupied),
      getMoveCellsByDirection(pos, 0, 1, playerPos, occupied),
      getMoveCellsByDirection(pos, -1, 0, playerPos, occupied),
      getMoveCellsByDirection(pos, 0, -1, playerPos, occupied)
    );
  },
  [PieceType.BISHOP]: (pos, playerPos, occupied) => {
    return [].concat(
      getMoveCellsByDirection(pos, 1, 1, playerPos, occupied),
      getMoveCellsByDirection(pos, -1, 1, playerPos, occupied),
      getMoveCellsByDirection(pos, -1, -1, playerPos, occupied),
      getMoveCellsByDirection(pos, 1, -1, playerPos, occupied)
    );
  },
  [PieceType.KNIGHT]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: -1 },
      { x: 1, y: -2 },
      { x: -1, y: -2 },
      { x: -2, y: -1 },
      { x: -2, y: 1 },
      { x: -1, y: 2 },
    ]);
  },
  [PieceType.PAWN_N]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [{ x: 0, y: -1 }]);
  },
  [PieceType.PAWN_E]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [{ x: 1, y: 0 }]);
  },
  [PieceType.PAWN_W]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [{ x: -1, y: 0 }]);
  },
  [PieceType.PAWN_S]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [{ x: 0, y: 1 }]);
  },
};
export const PieceCaptureFunc = {
  [PieceType.PLAYER]: PieceMovementFunc[PieceType.PLAYER],
  [PieceType.QUEEN]: PieceMovementFunc[PieceType.QUEEN],
  [PieceType.ROOK]: PieceMovementFunc[PieceType.ROOK],
  [PieceType.BISHOP]: PieceMovementFunc[PieceType.BISHOP],
  [PieceType.KNIGHT]: PieceMovementFunc[PieceType.KNIGHT],
  [PieceType.PAWN_N]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
    ]);
  },
  [PieceType.PAWN_E]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [
      { x: 1, y: -1 },
      { x: 1, y: 1 },
    ]);
  },
  [PieceType.PAWN_W]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [
      { x: -1, y: -1 },
      { x: -1, y: 1 },
    ]);
  },
  [PieceType.PAWN_S]: (pos, playerPos, occupied) => {
    return getMoveCellsByOffset(pos, playerPos, occupied, [
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ]);
  },
};
export const Difficulty = {
  EASY: 0,
  NORMAL: 1,
  HARD: 2,
};

Object.freeze(PieceType);
Object.freeze(PieceCooldown);
Object.freeze(PageName);
Object.freeze(PieceMovementFunc);
Object.freeze(PieceCaptureFunc);
Object.freeze(Difficulty);

// ------------------------------------ MATH UTILITIES ------------------------------------
export function getDistance(v1, v2) {
  assertIsVector(v1);
  assertIsVector(v2);
  return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
}

export function getVectorSum(v1, v2) {
  assertIsVector(v1);
  assertIsVector(v2);
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

export function isEven(number) {
  assert(
    !isNaN(number),
    "Trying to check the evenness of a number but isn't a number!"
  );
  return number % 2 === 0;
}

// ------------------------------------ GRID UTILITIES ------------------------------------

export function isValidCell(vector) {
  assertIsVector(vector);
  return vector.x >= 0 && vector.x < 8 && vector.y >= 0 && vector.y < 8;
}

export function arrayHasVector(array, vector) {
  assertIsVector(vector);
  return (
    array.find((item) => item.x === vector.x && item.y === vector.y) !==
    undefined
  );
}
// ------------------------------------ DEBUGGING UTILITIES ------------------------------------
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertIsVector(vector) {
  assert(
    vector.hasOwnProperty("x") && vector.hasOwnProperty("y"),
    `Vector assertion failed: ${vector}`
  );
}

// ------------------------------------ TIMING UTILITIES ------------------------------------
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------------ SCORE UTILITIES ------------------------------------
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

// ------------------------------------ MOVEMENT UTILITIES ------------------------------------
function getMoveCellsByOffset(piecePos, playerPos, obs, offsets) {
  assertIsVector(piecePos);
  assertIsVector(playerPos);
  const obstacles = removeVectorInArray(obs, playerPos);
  const { x: origX, y: origY } = piecePos;

  const output = [];
  offsets.forEach((offset) => {
    assertIsVector(offset);
    const move = { x: origX + offset.x, y: origY + offset.y };
    if (isValidCell(move) && !arrayHasVector(obstacles, move)) {
      output.push(move);
    }
  });
  return output;
}

function getMoveCellsByDirection(piecePos, dirX, dirY, playerPos, obs) {
  assertIsVector(piecePos);
  assertIsVector(playerPos);
  const obstacles = removeVectorInArray(obs, playerPos);
  const { x: origX, y: origY } = piecePos;

  const output = [];
  const currCell = { x: origX + dirX, y: origY + dirY };
  while (isValidCell(currCell) && !arrayHasVector(obstacles, currCell)) {
    output.push({ ...currCell });
    currCell.x += dirX;
    currCell.y += dirY;
  }
  return output;
}

function removeVectorInArray(array, vector) {
  assertIsVector(vector);
  return array.filter((item) => {
    return item.x !== vector.x || item.y !== vector.y;
  });
}
