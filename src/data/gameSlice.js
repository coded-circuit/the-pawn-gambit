import { createSlice, nanoid } from "@reduxjs/toolkit";
import {
  assert,
  PieceType,
  getDistance,
  getVectorSum,
  PieceCooldown,
  assertIsVector,
  PieceCaptureFunc,
  arrayHasVector,
  PieceMovementFunc,
  getPassiveScoreIncrease,
  Difficulty,
  getPieceCaptureScoreIncrease,
} from "../global/utils";

export const playerCaptureCooldown = 10;
const playerSpawnPos = { x: 3, y: 4 };
const initialState = {
  // pieceId: { position, type, cooldown }
  pieces: {},

  player: {
    position: { ...playerSpawnPos },
    type: PieceType.PLAYER,
    captureCooldownLeft: playerCaptureCooldown,
  },

  // pieceId: { x, y }
  movingPieces: {},

  // []{ x, y }, Can have duplicates
  captureCells: [],

  // 2d matrix, either false or a pieceId
  occupiedCellsMatrix: new Array(8).fill().map(() => new Array(8).fill(false)),

  turnNumber: 0,
  score: 0,
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
        state.turnNumber += 1;
        state.score += getPassiveScoreIncrease(
          Difficulty.EASY,
          state.turnNumber
        );
        const { x, y, isCapturing } = action.payload;
        if (state.player.captureCooldownLeft > 0) {
          state.player.captureCooldownLeft -= 1;
        }
        if (x === 0 && y === 0) return state;

        const currPosition = state.player.position;
        const newPosition = getVectorSum(currPosition, { x, y });

        if (isCapturing) {
          assert(
            state.occupiedCellsMatrix[newPosition.y][newPosition.x] !== false,
            "Player trying to capture an unoccupied cell!"
          );
          const capturedPieceId =
            state.occupiedCellsMatrix[newPosition.y][newPosition.x];

          state.score += getPieceCaptureScoreIncrease(
            Difficulty.EASY,
            state.pieces[capturedPieceId].type
          );
          state.occupiedCellsMatrix[newPosition.y][newPosition.x] = false;
          delete state.pieces[capturedPieceId];
          delete state.movingPieces[capturedPieceId];
          state.player.captureCooldownLeft = playerCaptureCooldown;
        }

        verifyPlayerMovement(currPosition, newPosition);
        moveOccupiedCell(state, currPosition, newPosition, "ThePlayer");
        state.player.position.x = newPosition.x;
        state.player.position.y = newPosition.y;
      },
      prepare(x, y, isCapturing) {
        return { payload: { x, y, isCapturing } };
      },
    },

    addPiece: {
      reducer(state, action) {
        const { x, y, type } = action.payload;
        assert(
          state.occupiedCellsMatrix[y][x] === false,
          "Trying to add a piece to an occupied cell"
        );
        assert(type !== PieceType.PLAYER, "Trying to add a new player!");

        const pieceId = nanoid();
        const newPiece = {
          position: { x, y },
          type,
          cooldown: PieceCooldown[type],
        };
        state.pieces[pieceId] = newPiece;
        state.occupiedCellsMatrix[y][x] = pieceId;
        // console.log("ADDED NEW PIECE!", pieceId, newPiece);
      },
      prepare(x, y, type) {
        // TODO: ID input might be replaced
        return { payload: { x, y, type } };
      },
    },

    processPieces: {
      reducer(state) {
        const currPlayerPos = state.player.position;

        // loop over all moving pieces and check for captures
        const occupiedCells = extractOccupiedCells(state.occupiedCellsMatrix);
        Object.keys(state.movingPieces).forEach((pieceId) => {
          const piece = state.pieces[pieceId];
          const pieceCaptureCells = PieceCaptureFunc[piece.type](
            piece.position,
            currPlayerPos,
            occupiedCells
          );
          if (arrayHasVector(pieceCaptureCells, currPlayerPos)) {
            alert("GAME OVER"); // GAME OVER
            return state;
          }
        });

        // loop over all moving pieces and move them
        Object.keys(state.movingPieces).forEach((pieceId) => {
          // console.log("MOVING PIECE:", pieceId);
          const piecePos = state.pieces[pieceId].position;
          const newPosition = state.movingPieces[pieceId];
          if (
            !(
              newPosition.x === currPlayerPos.x &&
              newPosition.y === currPlayerPos.y
            )
          ) {
            // console.log("piecePos:", piecePos);
            // console.log("newPosition:", newPosition);
            moveOccupiedCell(state, piecePos, newPosition, pieceId);
            state.pieces[pieceId].position.x = newPosition.x;
            state.pieces[pieceId].position.y = newPosition.y;
          } else {
            // console.log(
            //   "A piece was blocked by the player!",
            //   pieceId,
            //   state.pieces[pieceId].type
            // );
          }
        });

        // loop over all pieces, and update moving pieces array
        const newOccupiedCells = extractOccupiedCells(
          state.occupiedCellsMatrix
        );
        const nextTurnMoves = [];
        Object.keys(state.pieces).forEach((pieceId) => {
          // console.log("UPDATING PIECE:", pieceId);
          const piece = state.pieces[pieceId];

          // If cooldown is currently zero, reset and remove from moving pieces
          if (piece.cooldown === 0) {
            piece.cooldown = PieceCooldown[piece.type];
            delete state.movingPieces[pieceId];
          }

          // Non-zero cooldown is reduced by one
          else {
            piece.cooldown -= 1;
            // TODO: optimization for non-pawns to add capture cells here
            // If cooldown is now zero, set for movement
            if (piece.cooldown === 0) {
              // console.log("PIECE WILL BE MOVING:", pieceId, { ...piece });
              const moveCells = PieceMovementFunc[piece.type](
                piece.position,
                currPlayerPos,
                newOccupiedCells
              );

              // If the piece has a place to move to, find a tile that isn't already
              // another piece's next move, by picking a random tile three times. If
              // the piece can't move anywhere, either because it has reached the retry
              // limit or moveCells is empty, move to itself
              if (moveCells.length > 0) {
                const maxRetries = 3;
                let retry = 0;
                let move = { ...piece.position };
                while (retry < maxRetries) {
                  const newMove =
                    moveCells[Math.floor(Math.random() * moveCells.length)];
                  if (!arrayHasVector(nextTurnMoves, newMove)) {
                    move = newMove;
                    break;
                  }
                  retry++;
                }
                nextTurnMoves.push(move);
                state.movingPieces[pieceId] = move;
              } else {
                let move = { ...piece.position };
                nextTurnMoves.push(move);
                state.movingPieces[pieceId] = move;
              }
            }
          }
        });

        // loop over all the NEW moving pieces and update capture cells
        state.captureCells = [];
        Object.keys(state.movingPieces).forEach((pieceId) => {
          const piece = state.pieces[pieceId];
          const pieceCaptureCells = PieceCaptureFunc[piece.type](
            piece.position,
            currPlayerPos,
            newOccupiedCells
          );
          state.captureCells = state.captureCells.concat(pieceCaptureCells);
        });
      },
    },

    // end of reducers
  },
});

// SELECT FUNCTIONS --------------------------------------
export const selectPieceById = (pieceId) => (state) =>
  state.game.pieces[pieceId];
export const selectAllPieces = (state) => state.game.pieces;
export const selectOccupiedCellsMatrix = (state) =>
  state.game.occupiedCellsMatrix;
export const selectCaptureCells = (state) => state.game.captureCells;
export const selectPlayerPosition = (state) => state.game.player.position;
export const selectPlayerCaptureCooldown = (state) =>
  state.game.player.captureCooldownLeft;
export const selectTurnNumber = (state) => state.game.turnNumber;
export const selectScore = (state) => state.game.score;

// ACTION EXPORTS --------------------------------------
export const { resetState, movePlayer, addPiece, processPieces } =
  gameSlice.actions;
export default gameSlice.reducer;

//-------------------------------------- PRIVATE FUNCTIONS --------------------------------------
function verifyPlayerMovement(v1, v2) {
  assertIsVector(v1);
  assertIsVector(v2);
  const dist = getDistance(v1, v2);
  assert(dist === 1, `Invalid player movement! (${dist})`);
}

function moveOccupiedCell(state, v1, v2, pieceId) {
  // console.log("MOVING:", v1, v2);
  assertIsVector(v1);
  assertIsVector(v2);
  if (v1.x === v2.x && v1.y === v2.y) {
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
