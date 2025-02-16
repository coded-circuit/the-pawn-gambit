import {
  Difficulty,
  PieceType,
  assert,
  assertIsVector,
  assertIsValidNonPlayerPiece,
} from "../../../global/utils";
import { isValidCell } from "./grid";

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
  // [Difficulty.HARD]: [null, 0.5, 0.5, 0, 0, 0, 0, 0, 0],
};
const edgeToPawns = [
  PieceType.PAWN_S,
  PieceType.PAWN_W,
  PieceType.PAWN_E,
  PieceType.PAWN_N,
];

Object.freeze(pieceProbabilities);
Object.freeze(edgeToPawns);

export function getNumberToSpawn(difficulty) {
  const rand = Math.random();
  switch (difficulty) {
    case Difficulty.EASY:
      if (rand < 0.3) return 1;
      return 0;
    case Difficulty.NORMAL:
      if (rand < 0.1) return 2;
      if (rand < 0.5) return 1;
      return 0;
    case Difficulty.HARD:
      if (rand < 0.2) return 2;
      if (rand < 0.5) return 1;
      return 0;
    default:
      assert(false, "Invalid difficulty in getNumberToSpawn!", difficulty);
  }
}

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
