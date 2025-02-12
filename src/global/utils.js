import { useSelector } from "react-redux";

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
    console.log("KNIGHT MOVES!");
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

export const TRANSITION_HALF_LIFE = 750;

Object.freeze(PieceType);
Object.freeze(PieceCooldown);
Object.freeze(PageName);
Object.freeze(PieceMovementFunc);
Object.freeze(PieceCaptureFunc);

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

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export function arrayHasVector(array, vector) {
  assertIsVector(vector);
  return (
    array.find((item) => item.x === vector.x && item.y === vector.y) !==
    undefined
  );
}

function removeVectorInArray(array, vector) {
  assertIsVector(vector);
  return array.filter((item) => {
    return item.x !== vector.x || item.y !== vector.y;
  });
}
console.log(
  PieceMovementFunc[PieceType.KNIGHT]({ x: 1, y: 0 }, { x: 5, y: 5 }, [])
);
