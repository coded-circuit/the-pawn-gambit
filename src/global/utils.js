export const PieceType = {
  PLAYER: 0,
  QUEEN: 1,
  ROOK: 2,
  BISHOP: 3,
  KNIGHT: 4,
  PAWN: 5,
};

export const PieceCooldown = {
  [PieceType.PLAYER]: null,
  [PieceType.QUEEN]: 5,
  [PieceType.ROOK]: 4,
  [PieceType.BISHOP]: 4,
  [PieceType.KNIGHT]: 3,
  [PieceType.PAWN]: 3,
};

export const PageName = {
  MAIN_MENU: 0,
  GAME: 1,
  OPTIONS: 2,
  CREDITS: 3,
};

export const PieceMovementFunc = {
  [PieceType.PLAYER]: (x, y, occupiedCells) => {
    assert(false, "Player does not have a movement function");
  },
  [PieceType.QUEEN]: (x, y, occupiedCells) => {
    return [].concat(
      getMoveCellsByDirection(x, y, 1, 0, occupiedCells),
      getMoveCellsByDirection(x, y, 1, 1, occupiedCells),
      getMoveCellsByDirection(x, y, 0, 1, occupiedCells),
      getMoveCellsByDirection(x, y, -1, 1, occupiedCells),
      getMoveCellsByDirection(x, y, -1, 0, occupiedCells),
      getMoveCellsByDirection(x, y, -1, -1, occupiedCells),
      getMoveCellsByDirection(x, y, 0, -1, occupiedCells),
      getMoveCellsByDirection(x, y, 1, -1, occupiedCells)
    );
  },
  [PieceType.ROOK]: (x, y, occupiedCells) => {
    return [].concat(
      getMoveCellsByDirection(x, y, 1, 0, occupiedCells),
      getMoveCellsByDirection(x, y, 0, 1, occupiedCells),
      getMoveCellsByDirection(x, y, -1, 0, occupiedCells),
      getMoveCellsByDirection(x, y, 0, -1, occupiedCells)
    );
  },
  [PieceType.BISHOP]: (x, y, occupiedCells) => {
    return [].concat(
      getMoveCellsByDirection(x, y, 1, 1, occupiedCells),
      getMoveCellsByDirection(x, y, -1, 1, occupiedCells),
      getMoveCellsByDirection(x, y, -1, -1, occupiedCells),
      getMoveCellsByDirection(x, y, 1, -1, occupiedCells)
    );
  },
  [PieceType.KNIGHT]: (x, y, occupiedCells) => {
    return [].concat(
      getMoveCellsByOffset(
        x,
        y,
        [
          { x: 1, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: -1 },
          { x: 1, y: -2 },
          { x: -1, y: -2 },
          { x: -2, y: -1 },
          { x: -2, y: 1 },
          { x: -1, y: 2 },
        ],
        occupiedCells
      )
    );
  },
  [PieceType.PAWN]: (x, y, occupiedCells) => {}, // TODO: Pawns
};

export const TRANSITION_HALF_LIFE = 750;

Object.freeze(PieceType);
Object.freeze(PieceCooldown);
Object.freeze(PageName);

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
function getMoveCellsByOffset(origX, origY, offsets, obstacles = []) {
  const output = [];
  offsets.forEach((offset) => {
    assertIsVector(offset);
    const move = { x: origX + offset.x, y: origY + offset.y };
    if (!arrayHasVector(obstacles, move) && isValidCell(move)) {
      output.push(move);
    }
  });
  return output;
}

function getMoveCellsByDirection(origX, origY, dirX, dirY, obstacles = []) {
  const output = [];
  const currCell = { x: origX + dirX, y: origY + dirY };
  while (isValidCell(currCell) && !arrayHasVector(obstacles, currCell)) {
    output.push({ ...currCell });
    currCell.x += dirX;
    currCell.y += dirY;
  }
  return output;
}

function arrayHasVector(array, vector) {
  assertIsVector(vector);
  return (
    array.find((item) => item.x === vector.x && item.y === vector.y) !==
    undefined
  );
}
