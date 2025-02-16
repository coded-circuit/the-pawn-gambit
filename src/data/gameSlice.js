import { createSlice, nanoid } from "@reduxjs/toolkit";

import {
  PieceType,
  assert,
  assertIsVector,
  getVectorSum,
  arrayHasVector,
  assertIsValidPlayerMovement,
} from "../global/utils";

import {
  PieceCooldown,
  PieceMovementFunc,
  PieceCaptureFunc,
  PawnTypes,
  OfficerTypes,
} from "../features/game/logic/piece";

import {
  getPassiveScoreIncrease,
  getPieceCaptureScoreIncrease,
} from "../features/game/logic/score";

export const playerCaptureCooldown = 6;
const playerSpawnPos = { x: 3, y: 4 };
const initialState = {
  // { pieceId: { position, type, cooldown }, }
  pieces: {},

  player: {
    position: { ...playerSpawnPos },
    type: PieceType.PLAYER,
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
  score: 0,
  isGameOver: false,
};
initialState.occupiedCellsMatrix[playerSpawnPos.y][playerSpawnPos.x] =
  "ThePlayer";

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetState: {
      reducer(state) {
        return initialState;
      },
    },

    movePlayer: {
      reducer(state, action) {
        const { x, y, isCapturing, difficulty } = action.payload;
        state.turnNumber += 1;
        state.score += getPassiveScoreIncrease(difficulty, state.turnNumber);
        if (state.player.captureCooldownLeft > 0) {
          state.player.captureCooldownLeft -= 1;
        }
        if (x === 0 && y === 0) return state;

        const currPosition = state.player.position;
        const newPosition = getVectorSum(currPosition, { x, y });

        // Clears queued for deletion
        state.queuedForDeletion.forEach((pieceId) => {
          delete state.pieces[pieceId];
          delete state.movingPieces[pieceId];
        });
        state.queuedForDeletion = [];

        if (isCapturing) {
          assert(
            state.occupiedCellsMatrix[newPosition.y][newPosition.x] !== false,
            "Player trying to capture an unoccupied cell!"
          );
          const capturedPieceId =
            state.occupiedCellsMatrix[newPosition.y][newPosition.x];

          // Update player score
          state.score += getPieceCaptureScoreIncrease(
            difficulty,
            state.pieces[capturedPieceId].type
          );

          // Instead of deleting immediately, queue it for deletion for next player move
          queueDelete(state, capturedPieceId);

          // Reset player capture cooldown
          state.player.captureCooldownLeft = playerCaptureCooldown;
        }

        assertIsValidPlayerMovement(currPosition, newPosition);

        // Since player doesn't have a piece id, set it as "ThePlayer"
        moveOccupiedCell(state, currPosition, newPosition, "ThePlayer");
        state.player.position.x = newPosition.x;
        state.player.position.y = newPosition.y;
      },
      prepare(x, y, isCapturing, difficulty) {
        return { payload: { x, y, isCapturing, difficulty } };
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

          // Check if player is on a capture cell
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

          // If the piece doesn't have anywhere to move, remove from moving pieces
          if (pieceMoveCells.length <= 0) {
            delete state.movingPieces[pieceId];
            return;
          }

          // If it does have moves, try finding a valid one by checking if a random
          // move was already chosen by a different piece, up to three times.
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

          // If no move was selected, remove from moving pieces.
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

        // move moving pieces
        Object.keys(state.movingPieces).forEach((pieceId) => {
          const piecePos = state.pieces[pieceId].position;
          const newPosition = state.movingPieces[pieceId];

          // If moving to player's position, return
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

          // Check for promoting pawns
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

        // update ALL of the pieces' cooldowns
        Object.keys(state.pieces).forEach((pieceId) => {
          // console.log("UPDATING PIECE:", pieceId);
          const piece = state.pieces[pieceId];

          // If cooldown is currently zero, reset and remove from moving pieces
          if (piece.cooldown === 0) {
            piece.cooldown = PieceCooldown[piece.type];
            delete state.movingPieces[pieceId];
          }

          // If cooldown is not zero, reduce by one
          else {
            piece.cooldown -= 1;

            // If cooldown is now zero, add to moving pieces with null move
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

        // loop over all the NEW moving pieces and update capture cells
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

// SELECT FUNCTIONS --------------------------------------
export const selectAllPieces = (state) => state.game.pieces;
export const selectOccupiedCellsMatrix = (state) =>
  state.game.occupiedCellsMatrix;
export const selectCaptureCells = (state) => state.game.captureCells;
export const selectPlayerPosition = (state) => state.game.player.position;
export const selectPlayerCaptureCooldown = (state) =>
  state.game.player.captureCooldownLeft;
export const selectTurnNumber = (state) => state.game.turnNumber;
export const selectScore = (state) => state.game.score;
export const selectIsGameOver = (state) => state.game.isGameOver;

// ACTION EXPORTS --------------------------------------
export const {
  resetState,
  movePlayer,
  addPiece,
  processPieces,
  updateCaptureTiles,
} = gameSlice.actions;
export default gameSlice.reducer;

// -------------------------------------- PRIVATE FUNCTIONS --------------------------------------
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
    state.occupiedCellsMatrix[v1.y][v1.x] === false,
    "Moving to an occupied cell!"
  );
  state.occupiedCellsMatrix[v2.y][v2.x] = pieceId;
}

function extractOccupiedCells(matrix) {
  const output = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (matrix[y][x] !== false) {
        output.push({ x, y });
      }
    }
  }
  return output;
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
