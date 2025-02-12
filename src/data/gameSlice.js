import { createSlice, nanoid } from "@reduxjs/toolkit";
import {
  assert,
  PieceType,
  getDistance,
  getVectorSum,
  PieceCooldown,
  assertIsVector,
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
  // 2d boolean matrix
  occupiedCells: new Array(8).fill().map(() => new Array(8).fill(false)),

  // pieceId: { x, y }
  movingPieces: {},

  // pieceId: []{ x, y }
  captureCells: {},

  isProcessing: false,
};
initialState.occupiedCells[playerSpawnPos.y][playerSpawnPos.x] = true;

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetState: {
      reducer(state) {
        console.log("STATE RESET!");
        console.log(initialState);
        return initialState;
      },
    },

    movePlayer: {
      reducer(state, action) {
        const { x, y } = action.payload;
        const currPosition = { ...state.pieces[playerId].position };
        const newPosition = getVectorSum(currPosition, { x, y });
        verifyPlayerMovement(currPosition, newPosition);
        moveOccupiedCell(state, currPosition, newPosition);
        state.pieces[playerId].position.x = newPosition.x;
        state.pieces[playerId].position.y = newPosition.y;
        state.isProcessing = true;
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
      },
      prepare(x, y, type) {
        return { payload: { x, y, type } };
      },
    },

    processPieces: {
      reducer(state) {
        // loop over all moving pieces and check for captures

        // loop over all moving pieces and move them

        // loop over all pieces, and update moving pieces
        for (let pieceId in state.pieces) {
          const piece = state.pieces[pieceId];

          if (piece.cooldown === 0) {
            piece.cooldown = PieceCooldown[piece.type];
            const newPosition = movingPieces[pieceId];
            piece.position.x = newPosition.x;
            piece.position.y = newPosition.y;
            delete movingPieces[pieceId];
          } else {
            piece.cooldown -= 1;
            if (piece.cooldown === 0) {
              // determine moves
            }
          }
        }
      },
    },

    // movePieceTo: {
    //   reducer(state, action) {
    //     // TODO: Maybe verify if movement is valid?
    //     const { pieceId, x, y } = action.payload;
    //     state.pieces[pieceId].position.x = x;
    //     state.pieces[pieceId].position.y = y;
    //   },
    //   prepare(pieceId, x, y) {
    //     return {
    //       payload: { pieceId, x, y },
    //     };
    //   },
    // },

    // end of reducers
  },
});

// SELECT FUNCTIONS --------------------------------------
export const selectPieceById = (pieceId) => (state) =>
  state.game.pieces[pieceId];
export const selectCells = (state) => state.game.cells;
export const selectPlayerPosition = (state) =>
  state.game.pieces[playerId].position;

// ACTION EXPORTS --------------------------------------
export const { movePlayer, resetState } = gameSlice.actions;
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
