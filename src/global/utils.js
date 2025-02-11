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

  constructor(x = 0, y = 0) {
    assert(!isNaN(x) && !isNaN(y), "Invalid vector2 initialization!");
    this.x = x;
    this.y = y;
  }

  distance(to) {
    assert(to instanceof Vector2, "Invalid distance input!");
    return Math.sqrt(Math.pow(this.x - to.x, 2) + Math.pow(this.y - to.y, 2));
  }

  add(to) {
    assert(to instanceof Vector2, "Invalid add input!");
    return new Vector2(this.x + to.x, this.y + to.y);
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
