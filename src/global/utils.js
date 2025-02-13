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
Object.freeze(PawnTypes);
Object.freeze(OfficerTypes);
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
const edgeToPawns = [
  PieceType.PAWN_S,
  PieceType.PAWN_W,
  PieceType.PAWN_E,
  PieceType.PAWN_N,
];
export function getPieceWithPos(difficulty) {
  const { edge, randomPoint: pos } = pickSpawnPoint();
  const type = choosePieceToSpawn(difficulty);
  assertIsValidNonPlayerPiece(type);
  assertIsVector(pos);

  if (edgeToPawns.includes(type)) {
    assertIsValidNonPlayerPiece(edgeToPawns[edge]);
    return { type: edgeToPawns[edge], pos };
  }
  return { type, pos };
}

function pickSpawnPoint() {
  const getRandomLane = () => Math.floor(Math.random() * 8);

  const edge = Math.floor(Math.random() * 4);
  let randomPoint = {};
  switch (edge) {
    case 0:
      randomPoint = { x: getRandomLane(), y: 0 };
      break;
    case 1:
      randomPoint = { x: 7, y: getRandomLane() };
      break;
    case 2:
      randomPoint = { x: 0, y: getRandomLane() };
      break;
    case 3:
      randomPoint = { x: getRandomLane(), y: 7 };
      break;
    default:
      assert(false, "Invalid edge!");
  }
  assert(isValidCell(randomPoint), "Invalid spawn point chosen!");
  return { edge, randomPoint };
}

function choosePieceToSpawn(difficulty) {
  const probabilities = pieceProbabilities[difficulty];
  const rand = Math.random();
  let cumulativeProb = 0;
  for (let i = 0; i < probabilities.length; i++) {
    const prob = probabilities[i];
    if (prob == null) continue;

    cumulativeProb += prob;
    if (rand < cumulativeProb) {
      return i;
    }
  }
  return probabilities.length - 1;
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

// ------------------------------------ TIMING UTILITIES ------------------------------------
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------------ SCORE/DIFFICULTY UTILITIES ------------------------------------
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

const pieceProbabilities = {
  // [P, Q, R, B, K, PN, PE, PW, PS]
  [Difficulty.EASY]: [null, 0.03, 0.07, 0.1, 0.2, 0.15, 0.15, 0.15, 0.15],
  [Difficulty.NORMAL]: [null, 0.08, 0.12, 0.15, 0.25, 0.1, 0.1, 0.1, 0.1],
  [Difficulty.HARD]: [
    null,
    0.15,
    0.15,
    0.2,
    0.25,
    0.0625,
    0.0625,
    0.0625,
    0.0625,
  ],
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
