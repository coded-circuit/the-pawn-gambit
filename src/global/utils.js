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

export const TRANSITION_HALF_LIFE = 750;

Object.freeze(PieceType);
Object.freeze(PieceCooldown);
Object.freeze(PageName);

export class Vector2 {
  x = 0;
  y = 0;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export function isEven(number) {
  assert(
    !isNaN(number),
    "Trying to check the evenness of a number but isn't a number!"
  );
  return number % 2 === 0;
}

// FOR DEBUGGING:

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
