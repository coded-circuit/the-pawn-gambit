import {
  PieceType,
  assert,
  assertIsVector,
  arrayHasVector,
  removeVectorInArray,
} from "../../../global/utils";

import { isValidCell } from "./grid";

export const PawnTypes = [
  PieceType.PAWN_N,
  PieceType.PAWN_E,
  PieceType.PAWN_W,
  PieceType.PAWN_S,
];
export const OfficerTypes = [
  PieceType.QUEEN,
  PieceType.ROOK,
  PieceType.BISHOP,
  PieceType.KNIGHT,
];
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
  [PieceType.PLAYER]: (pos, playerPos, occupied) => {
    assert(false, "Player does not have a movement function");
  },
  [PieceType.QUEEN]: (pos, playerPos, occupied) => {
    return [].concat(
      getCaptureCellsByDirection(pos, 1, 0, playerPos, occupied),
      getCaptureCellsByDirection(pos, 1, 1, playerPos, occupied),
      getCaptureCellsByDirection(pos, 0, 1, playerPos, occupied),
      getCaptureCellsByDirection(pos, -1, 1, playerPos, occupied),
      getCaptureCellsByDirection(pos, -1, 0, playerPos, occupied),
      getCaptureCellsByDirection(pos, -1, -1, playerPos, occupied),
      getCaptureCellsByDirection(pos, 0, -1, playerPos, occupied),
      getCaptureCellsByDirection(pos, 1, -1, playerPos, occupied)
    );
  },
  [PieceType.ROOK]: (pos, playerPos, occupied) => {
    return [].concat(
      getCaptureCellsByDirection(pos, 1, 0, playerPos, occupied),
      getCaptureCellsByDirection(pos, 0, 1, playerPos, occupied),
      getCaptureCellsByDirection(pos, -1, 0, playerPos, occupied),
      getCaptureCellsByDirection(pos, 0, -1, playerPos, occupied)
    );
  },
  [PieceType.BISHOP]: (pos, playerPos, occupied) => {
    return [].concat(
      getCaptureCellsByDirection(pos, 1, 1, playerPos, occupied),
      getCaptureCellsByDirection(pos, -1, 1, playerPos, occupied),
      getCaptureCellsByDirection(pos, -1, -1, playerPos, occupied),
      getCaptureCellsByDirection(pos, 1, -1, playerPos, occupied)
    );
  },
  [PieceType.KNIGHT]: (pos, playerPos, occupied) => {
    return getCaptureCellsByOffset(pos, playerPos, occupied, [
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
    return getCaptureCellsByOffset(pos, playerPos, occupied, [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
    ]);
  },
  [PieceType.PAWN_E]: (pos, playerPos, occupied) => {
    return getCaptureCellsByOffset(pos, playerPos, occupied, [
      { x: 1, y: -1 },
      { x: 1, y: 1 },
    ]);
  },
  [PieceType.PAWN_W]: (pos, playerPos, occupied) => {
    return getCaptureCellsByOffset(pos, playerPos, occupied, [
      { x: -1, y: -1 },
      { x: -1, y: 1 },
    ]);
  },
  [PieceType.PAWN_S]: (pos, playerPos, occupied) => {
    return getCaptureCellsByOffset(pos, playerPos, occupied, [
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ]);
  },
};

Object.freeze(PawnTypes);
Object.freeze(OfficerTypes);
Object.freeze(PieceCooldown);
Object.freeze(PieceMovementFunc);
Object.freeze(PieceCaptureFunc);

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

function getCaptureCellsByOffset(piecePos, playerPos, obs, offsets) {
  assertIsVector(piecePos);
  assertIsVector(playerPos);
  const { x: origX, y: origY } = piecePos;

  const output = [];
  offsets.forEach((offset) => {
    assertIsVector(offset);
    const move = { x: origX + offset.x, y: origY + offset.y };
    if (isValidCell(move)) {
      output.push(move);
    }
  });
  return output;
}

function getCaptureCellsByDirection(piecePos, dirX, dirY, playerPos, obs) {
  assertIsVector(piecePos);
  assertIsVector(playerPos);
  const obstacles = removeVectorInArray(obs, playerPos);
  const { x: origX, y: origY } = piecePos;

  const output = [];
  const currCell = { x: origX + dirX, y: origY + dirY };
  while (isValidCell(currCell)) {
    output.push({ ...currCell });
    if (arrayHasVector(obstacles, currCell)) {
      break;
    }
    currCell.x += dirX;
    currCell.y += dirY;
  }
  return output;
}
