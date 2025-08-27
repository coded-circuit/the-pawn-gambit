import { createSlice, nanoid } from "@reduxjs/toolkit";

import {
  PieceType,
  arrayHasVector,
  assert,
  assertIsVector,
  extractOccupiedCells
} from "../global/utils";

import {
  OfficerTypes,
  PawnTypes,
  PieceCaptureFunc,
  PieceCooldown,
  PieceMovementFunc,
} from "../features/game/logic/piece";

import { BlackPieceType } from "../features/game/logic/piece";
import {
  getPassiveXPIncrease,
  getPieceCaptureGems,
  getPieceCaptureXPIncrease,
  getSurvivalGems,
} from "../features/game/logic/score";
export const playerCaptureCooldown = 6;
const playerSpawnPos = { x: 3, y: 4 };

const initialState = {
  // { pieceId: { position, type, cooldown }, }
  pieces: {},

  player: {
    position: { ...playerSpawnPos },
    type: BlackPieceType.BLACK_PAWN,
    captureCooldownLeft: playerCaptureCooldown,
  },

  // { pieceId: { x, y }, }
  movingPieces: {},

  // [ { x, y }, ]  Can have duplicates
  captureCells: [],

  // [ [false, pieceId, ...], ] 2d matrix, either false or a pieceId
  occupiedCellsMatrix: new Array(8).fill().map(() => new Array(8).fill(false)),

  // [ pieceId, ]
  queuedForDeletion: [],

  turnNumber: 0,
  xp: 0,
  gems: 0,
  isGameOver: false,
  livesLeft: 4,
  totalXP: 0,
  totalGems: 0,
  totalTurnsSurvived: 0,
  playerPieceType: BlackPieceType.BLACK_PAWN,
};

initialState.occupiedCellsMatrix[playerSpawnPos.y][playerSpawnPos.x] =
  "ThePlayer";

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetState: {
      reducer() {
        return initialState;
      },
    },
    addXP: {
      reducer(state, action) {
        state.xp += action.payload.xp;
      },
      prepare(xp) {
        return { payload: { xp } };
      },
    },
    restartGame: {
      reducer(state) {
        if (state.livesLeft > 0) {
          state.livesLeft -= 1;
          state.totalXP = state.xp;
          state.totalGems = state.gems;
          state.totalTurnsSurvived = state.totalTurnsSurvived + state.turnNumber;
          state.xp = state.totalXP;
          state.gems = state.totalGems - 20;
          state.turnNumber = 0;
          state.isGameOver = false;
          // This correctly resets the piece back to a Pawn
          state.playerPieceType = BlackPieceType.BLACK_PAWN;
          state.player.type = BlackPieceType.BLACK_PAWN;
          state.pieces = {};
          state.player.position = { ...playerSpawnPos };
          state.player.captureCooldownLeft = playerCaptureCooldown;
          state.movingPieces = {};
          state.captureCells = [];
          state.occupiedCellsMatrix = new Array(8)
            .fill()
            .map(() => new Array(8).fill(false));
          state.occupiedCellsMatrix[playerSpawnPos.y][playerSpawnPos.x] =
            "ThePlayer";
          state.queuedForDeletion = [];
        }
      },
      prepare() {
        return { payload: {} };
      },
    },
    endGame: {
      reducer(state) {
        state.isGameOver = true;
        state.totalXP = state.xp;
        state.totalGems = state.gems;
        state.totalTurnsSurvived = state.totalTurnsSurvived + state.turnNumber;
      },
    },
    // --- MODIFIED REDUCER ---
    upgradePlayerPiece: {
      reducer(state) {
        const currentPiece = state.playerPieceType;
        let nextPiece = null;
        let cost = 0;

        switch (currentPiece) {
          case BlackPieceType.BLACK_PAWN:
            nextPiece = BlackPieceType.BLACK_ROOK;
            cost = 10;
            break;
          case BlackPieceType.BLACK_ROOK:
            nextPiece = BlackPieceType.BLACK_BISHOP;
            cost = 20;
            break;
          case BlackPieceType.BLACK_BISHOP:
            nextPiece = BlackPieceType.BLACK_QUEEN;
            cost = 30;
            break;
          default:
            // Already at max level (Queen) or an unknown type, so do nothing.
            return;
        }

        if (state.gems >= cost) {
          state.gems -= cost;
          state.playerPieceType = nextPiece;
          // Keep the player object in sync
          state.player.type = nextPiece;
        }
      },
      prepare() {
        // No payload needed from the UI
        return { payload: {} };
      },
    },
    movePlayer: {
      reducer(state, action) {
        const { targetPos, isCapturing, difficulty } = action.payload;
        console.log("[movePlayer] Reducer called with target:", targetPos, {
          isCapturing,
          pieceType: state.playerPieceType,
        });
        // Compute valid movement and capture cells for the current player piece
        const occupied = extractOccupiedCells(state.occupiedCellsMatrix);
        const validMoves = PieceMovementFunc[state.playerPieceType](
          state.player.position,
          state.player.position,
          occupied
        );
        const validCaptures = PieceCaptureFunc[state.playerPieceType](
          state.player.position,
          state.player.position,
          occupied
        );
        const isValidNonCaptureMove = arrayHasVector(validMoves, targetPos) && !isCapturing;
        const isValidCaptureMove = arrayHasVector(validCaptures, targetPos) && isCapturing;
        if (!isValidNonCaptureMove && !isValidCaptureMove) {
          console.error("[movePlayer] Move rejected! Not a valid move/capture", {
            validMoves,
            validCaptures,
            targetPos,
            isCapturing,
          });
          return;
        }

        state.turnNumber += 1;
        state.xp += getPassiveXPIncrease(difficulty, state.turnNumber);
        state.gems += getSurvivalGems();
        if (state.player.captureCooldownLeft > 0) {
          state.player.captureCooldownLeft -= 1;
        }
        // Clears queued for deletion
        state.queuedForDeletion.forEach((pieceId) => {
          delete state.pieces[pieceId];
          delete state.movingPieces[pieceId];
        });
        state.queuedForDeletion = [];
        if (isValidCaptureMove) {
          const capturedPieceId =
            state.occupiedCellsMatrix[targetPos.y][targetPos.x];

          state.xp += getPieceCaptureXPIncrease(
            state.pieces[capturedPieceId].type
          );
          state.gems += getPieceCaptureGems(state.pieces[capturedPieceId].type);
          queueDelete(state, capturedPieceId);
          state.player.captureCooldownLeft = playerCaptureCooldown;
        }
        const currPosition = state.player.position;
        const newPosition = targetPos;
        moveOccupiedCell(state, currPosition, newPosition, "ThePlayer");
        state.player.position.x = newPosition.x;
        state.player.position.y = newPosition.y;
      },
      prepare(targetPos, isCapturing, difficulty) {
        return { payload: { targetPos, isCapturing, difficulty } };
      },
    },

    addPiece: {
      reducer(state, action) {
        const { x, y, type } = action.payload;
        assert(
          state.occupiedCellsMatrix[y][x] === false,
          `Trying to add a piece to an occupied cell (${x}, ${y})`
        );
        assert(type !== PieceType.PLAYER, "Trying to add a new player!");

        const { pieceId, newPiece } = createPiece(x, y, type);
        state.pieces[pieceId] = newPiece;
        state.occupiedCellsMatrix[y][x] = pieceId;
        // console.log("ADDED NEW PIECE!", pieceId, newPiece);
      },
      prepare(x, y, type) {
        return { payload: { x, y, type } };
      },
    },

    processPieces: {
      reducer(state) {
        const currPlayerPos = state.player.position;

        // loop over all moving pieces, check for captures, and generate moves
        const occupiedCells = extractOccupiedCells(state.occupiedCellsMatrix);
        const pieceMovesThisTurn = [];
        let gameOver = false;
        Object.keys(state.movingPieces).forEach((pieceId) => {
          assert(
            state.movingPieces[pieceId] === null,
            "Piece was initialized with non-null move!"
          );
          if (gameOver) return;

          const piece = state.pieces[pieceId];

          let pieceCaptureCells = PieceCaptureFunc[piece.type](
            piece.position,
            currPlayerPos,
            occupiedCells
          );

          if (arrayHasVector(pieceCaptureCells, currPlayerPos)) {
            gameOver = true;
            state.occupiedCellsMatrix[currPlayerPos.y][currPlayerPos.x] = false;
            moveOccupiedCell(state, piece.position, currPlayerPos, pieceId);
            state.pieces[pieceId].position.x = currPlayerPos.x;
            state.pieces[pieceId].position.y = currPlayerPos.y;
            return;
          }

          const pieceMoveCells = PieceMovementFunc[piece.type](
            piece.position,
            currPlayerPos,
            occupiedCells
          );

          if (pieceMoveCells.length <= 0) {
            delete state.movingPieces[pieceId];
            return;
          }

          const maxRetries = 3;
          let retry = 0;
          let move = null;
          while (retry < maxRetries) {
            const newMove =
              pieceMoveCells[Math.floor(Math.random() * pieceMoveCells.length)];
            if (!arrayHasVector(pieceMovesThisTurn, newMove)) {
              move = newMove;
              break;
            }
            retry++;
          }

          if (move === null) {
            delete state.movingPieces[pieceId];
          } else {
            pieceMovesThisTurn.push(move);
            state.movingPieces[pieceId] = move;
          }
        });
        if (gameOver) {
          state.movingPieces = {};
          state.captureCells = [];
          Object.keys(state.pieces).forEach((pieceId) => {
            state.pieces[pieceId].cooldown = 99;
          });
          state.isGameOver = true;
          return state;
        }

        Object.keys(state.movingPieces).forEach((pieceId) => {
          const piecePos = state.pieces[pieceId].position;
          const newPosition = state.movingPieces[pieceId];

          if (
            newPosition.x === currPlayerPos.x &&
            newPosition.y === currPlayerPos.y
          ) {
            return;
          }

          assert(newPosition !== null, "Moving with a null move!");
          assert(
            !(newPosition.x === piecePos.x && newPosition.y === piecePos.y),
            "Moving to own position!"
          );

          moveOccupiedCell(state, piecePos, newPosition, pieceId);
          state.pieces[pieceId].position.x = newPosition.x;
          state.pieces[pieceId].position.y = newPosition.y;
          state.pieces[pieceId].movesMade += 1;

          const piece = state.pieces[pieceId];
          const pos = state.pieces[pieceId].position;
          if (PawnTypes.includes(piece.type)) {
            if (piece.movesMade === 7) {
              queueDelete(state, pieceId);

              const promotionType =
                OfficerTypes[Math.floor(Math.random() * OfficerTypes.length)];
              const { pieceId: newPieceId, newPiece } = createPiece(
                pos.x,
                pos.y,
                promotionType
              );
              state.pieces[newPieceId] = newPiece;
              state.occupiedCellsMatrix[pos.y][pos.x] = newPieceId;
            }
          }
        });

        Object.keys(state.movingPieces).forEach((pieceId) => {
          const piecePos = state.pieces[pieceId].position;
          const newPosition = state.movingPieces[pieceId];

          if (
            newPosition.x === currPlayerPos.x &&
            newPosition.y === currPlayerPos.y
          ) {
            return;
          }

          assert(newPosition !== null, "Moving with a null move!");
          assert(
            !(newPosition.x === piecePos.x && newPosition.y === piecePos.y),
            "Moving to own position!"
          );

          moveOccupiedCell(state, piecePos, newPosition, pieceId);
          state.pieces[pieceId].position.x = newPosition.x;
          state.pieces[pieceId].position.y = newPosition.y;
          state.pieces[pieceId].movesMade += 1;

          const piece = state.pieces[pieceId];
          const pos = state.pieces[pieceId].position;
          if (PawnTypes.includes(piece.type)) {
            if (piece.movesMade === 7) {
              queueDelete(state, pieceId);

              const promotionType =
                OfficerTypes[Math.floor(Math.random() * OfficerTypes.length)];
              const { pieceId: newPieceId, newPiece } = createPiece(
                pos.x,
                pos.y,
                promotionType
              );
              state.pieces[newPieceId] = newPiece;
              state.occupiedCellsMatrix[pos.y][pos.x] = newPieceId;
            }
          }
        });

        Object.keys(state.pieces).forEach((pieceId) => {
          const piece = state.pieces[pieceId];

          if (piece.cooldown === 0) {
            piece.cooldown = PieceCooldown[piece.type];
            delete state.movingPieces[pieceId];
          } else {
            piece.cooldown -= 1;

            if (piece.cooldown === 0) {
              state.movingPieces[pieceId] = null;
            }
          }
        });
      },
    },

    updateCaptureTiles: {
      reducer(state) {
        const currPlayerPos = state.player.position;

        state.captureCells = [];
        const newOccCells = extractOccupiedCells(state.occupiedCellsMatrix);
        Object.keys(state.movingPieces).forEach((pieceId) => {
          const piece = state.pieces[pieceId];
          const pieceCaptureCells = PieceCaptureFunc[piece.type](
            piece.position,
            currPlayerPos,
            newOccCells
          );
          state.captureCells = state.captureCells.concat(pieceCaptureCells);
        });
      },
    },
  },
});

export const selectAllPieces = (state) => state.game.pieces;
export const selectOccupiedCellsMatrix = (state) =>
  state.game.occupiedCellsMatrix;
export const selectCaptureCells = (state) => state.game.captureCells;
export const selectPlayerPosition = (state) => state.game.player.position;
export const selectPlayerCaptureCooldown = (state) =>
  state.game.player.captureCooldownLeft;
export const selectTurnNumber = (state) => state.game.turnNumber;
export const selectXP = (state) => state.game.xp;
export const selectGems = (state) => state.game.gems;
export const selectIsGameOver = (state) => state.game.isGameOver;
export const selectLivesLeft = (state) => state.game.livesLeft;
export const selectTotalXP = (state) => state.game.totalXP;
export const selectTotalGems = (state) => state.game.totalGems;
export const selectTotalTurnsSurvived = (state) =>
  state.game.totalTurnsSurvived;
export const selectPlayerPieceType = (state) => state.game.playerPieceType;

export const {
  resetState,
  movePlayer,
  addPiece,
  processPieces,
  updateCaptureTiles,
  addXP,
  restartGame,
  endGame,
  upgradePlayerPiece,
} = gameSlice.actions;
export default gameSlice.reducer;

function moveOccupiedCell(state, v1, v2, pieceId) {
  assertIsVector(v1);
  assertIsVector(v2);
  if (v1.x === v2.x && v1.y === v2.y) {
    assert(false, "Moving to own cell!");
    return;
  }

  assert(
    state.occupiedCellsMatrix[v1.y][v1.x] !== false,
    "Moving a non-occupied cell!"
  );
  state.occupiedCellsMatrix[v1.y][v1.x] = false;
  assert(
    state.occupiedCellsMatrix[v2.y][v2.x] === false,
    "Moving to an occupied cell!"
  );
  state.occupiedCellsMatrix[v2.y][v2.x] = pieceId;
}
function createPiece(x, y, type) {
  const pieceId = nanoid();
  const newPiece = {
    position: { x, y },
    type,
    cooldown: PieceCooldown[type],
    isCaptured: false,
    movesMade: 0,
  };
  return { pieceId, newPiece };
}

function queueDelete(state, pieceId) {
  const pos = state.pieces[pieceId].position;
  state.occupiedCellsMatrix[pos.y][pos.x] = false;
  state.pieces[pieceId].isCaptured = true;
  state.pieces[pieceId].cooldown = 150;
  delete state.movingPieces[pieceId];
  state.queuedForDeletion.push(pieceId);
}