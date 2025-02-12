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
} from "../global/utils";

const playerSpawnPos = { x: 3, y: 4 };
const playerId = nanoid();
const initialState = {
  // pieceId: { position, type, cooldown }
  pieces: {
    [playerId]: {
      position: { ...playerSpawnPos },
      type: PieceType.PLAYER,
      cooldown: null,
    },
  },

  // pieceId: { x, y }
  movingPieces: {},

  // []{ x, y }, Can have duplicates
  captureCells: [],

  // 2d boolean matrix
  occupiedCells: new Array(8).fill().map(() => new Array(8).fill(false)),
};
initialState.occupiedCells[playerSpawnPos.y][playerSpawnPos.x] = true;

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
        const { x, y } = action.payload;
        const currPosition = state.pieces[playerId].position;
        const newPosition = getVectorSum(currPosition, { x, y });
        verifyPlayerMovement(currPosition, newPosition);
        moveOccupiedCell(state, currPosition, newPosition);
        state.pieces[playerId].position.x = newPosition.x;
        state.pieces[playerId].position.y = newPosition.y;
      },
      prepare(x, y) {
        return { payload: { x, y } };
      },
    },

    addPiece: {
      reducer(state, action) {
        const { x, y, type } = action.payload;
        assert(
          !state.occupiedCells[y][x],
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
        console.log("ADDED NEW PIECE!", newPiece);
      },
      prepare(x, y, type) {
        // TODO: ID input might be replaced
        return { payload: { x, y, type } };
      },
    },

    processPieces: {
      reducer(state, action) {
        const currPlayerPos = state.pieces[playerId].position;

        // loop over all moving pieces and check for captures
        for (let pieceId in state.movingPieces) {
          const piece = state.pieces[pieceId];
          const pieceCaptureCells = PieceCaptureFunc[piece.type](
            piece.position,
            currPlayerPos,
            state.occupiedCells
          );
          if (arrayHasVector(pieceCaptureCells, currPlayerPos)) {
            alert("GAME OVER"); // GAME OVER
            return state;
          }
        }

        // loop over all moving pieces and move them
        for (let pieceId in state.movingPieces) {
          const piecePos = state.pieces[pieceId].position;
          const newPosition = state.movingPieces[pieceId];
          console.log("piecePos:", piecePos);
          console.log("newPosition:", newPosition);
          moveOccupiedCell(state, piecePos, newPosition);
          state.pieces[pieceId].position.x = newPosition.x;
          state.pieces[pieceId].position.y = newPosition.y;
        }

        // loop over all pieces, and update moving pieces
        for (let pieceId in state.pieces) {
          const piece = state.pieces[pieceId];

          // If cooldown is currently zero, reset and remove from moving pieces
          if (piece.cooldown === 0) {
            piece.cooldown = PieceCooldown[piece.type];
            delete state.movingPieces[pieceId];
          }

          // Non-zero cooldown is reduced by
          else {
            piece.cooldown -= 1;
            // If cooldown is now zero, set for movement
            // TODO: optimization for non-pawns to add capture cells here
            if (piece.cooldown === 0) {
              console.log("PIECE WILL BE MOVING:", { ...piece });
              console.log("OCCUPIED CELLS:", [...state.occupiedCells]);
              const moveCells = PieceMovementFunc[piece.type](
                piece.position,
                currPlayerPos,
                state.occupiedCells
              );
              console.log("PIECE MOVE CELLS:", moveCells);
              state.movingPieces[pieceId] =
                moveCells[Math.floor(Math.random() * moveCells.length)];
            }
          }
        }

        // loop over all the NEW moving pieces and update capture cells
        for (let pieceId in state.movingPieces) {
          const piece = state.pieces[pieceId];
          const pieceCaptureCells = PieceCaptureFunc[piece.type](
            piece.position,
            currPlayerPos,
            state.occupiedCells
          );
          state.captureCells = state.captureCells.concat(pieceCaptureCells);
        }
      },
    },

    // end of reducers
  },
});

// SELECT FUNCTIONS --------------------------------------
export const selectPieceById = (pieceId) => (state) =>
  state.game.pieces[pieceId];
export const selectAllPieces = (state) => state.game.pieces;
export const selectCells = (state) => state.game.cells;
export const selectPlayerPosition = (state) =>
  state.game.pieces[playerId].position;

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

function moveOccupiedCell(state, v1, v2) {
  console.log("MOVING:", v1, v2);
  assertIsVector(v1);
  assertIsVector(v2);
  assert(state.occupiedCells[v1.y][v1.x], "Moving a non-occupied cell!");
  state.occupiedCells[v1.y][v1.x] = false;
  assert(
    state.occupiedCells[v1.y][v1.x] === false,
    "Moving to an occupied cell!"
  );
  state.occupiedCells[v2.y][v2.x] = true;
}
