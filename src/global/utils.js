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
export const PageName = {
  MAIN_MENU: 0,
  GAME: 1,
  HOW_TO_PLAY: 2,
  OPTIONS: 3,
  CREDITS: 4,
};
export const Difficulty = {
  EASY: 0,
  NORMAL: 1,
  HARD: 2,
};

Object.freeze(PieceType);
Object.freeze(PageName);
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

export function arrayHasVector(array, vector) {
  assertIsVector(vector);
  return (
    array.find((item) => item.x === vector.x && item.y === vector.y) !==
    undefined
  );
}

export function removeVectorInArray(array, vector) {
  assertIsVector(vector);
  return array.filter((item) => {
    return item.x !== vector.x || item.y !== vector.y;
  });
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

export function assertIsValidNonPlayerPiece(pieceType) {
  assert(
    pieceType > 0 && pieceType < Object.keys(PieceType).length,
    `Non-player piece type assertion failed: ${pieceType}`
  );
}

export function assertIsValidPlayerMovement(v1, v2) {
  assertIsVector(v1);
  assertIsVector(v2);
  const dist = getDistance(v1, v2);
  assert(dist === 1, `Invalid player movement! (${dist})`);
}

// ------------------------------------ TIMING UTILITIES ------------------------------------
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
