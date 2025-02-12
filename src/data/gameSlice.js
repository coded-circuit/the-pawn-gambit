import { createSlice, nanoid } from "@reduxjs/toolkit";
import {
  assert,
  PieceType,
  getDistance,
  getVectorSum,
  PieceCooldown,
  assertIsVector,
} from "../global/utils";

const playerId = nanoid();
const initialState = {
  // pieceId: { position, type, cooldown }
  pieces: {
    [playerId]: {
      position: {
        x: 3,
        y: 7,
      },
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

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // resetState: {
    //   reducer(state) {
    //     return initialState;
    //   },
    // },
    // setOccupiedCell: {
    //   reducer(state, action) {
    //     const { x, y, value } = action.payload;
    //     state.occupiedCells[x][y] = value;
    //   },
    //   prepare(x, y, value) {
    //     return {
    //       payload: {
    //         x,
    //         y,
    //         value,
    //       },
    //     };
    //   },
    // },
    movePlayer: {
      reducer(state, action) {
        const { x, y } = action.payload;
        const currPosition = state.pieces[playerId].position;
        const newPosition = getVectorSum(currPosition, { x, y });
        verifyPlayerMovement(currPosition, newPosition);
        state.pieces[playerId].position.x = newPosition.x;
        state.pieces[playerId].position.y = newPosition.y;
        state.isProcessing = true;
      },
      prepare(x, y) {
        return {
          payload: {
            x,
            y,
          },
        };
      },
    },
    // addPiece: {
    //   reducer(state, action) {
    //     const { x, y, type } = action.payload;
    //     const pieceId = nanoid();
    //     const newPiece = {
    //       position: { x, y },
    //       type: type,
    //       cooldown: PieceCooldown[type],
    //     };
    //     state.pieces[pieceId] = newPiece;
    //   },
    //   prepare(x, y, type) {
    //     return {
    //       payload: {
    //         x,
    //         y,
    //         type,
    //       },
    //     };
    //   },
    // },
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
    // processPieces: {
    //   reducer(state) {
    //     for (let pieceId in state.pieces) {
    //       const piece = state.pieces[pieceId];
    //       if (piece.cooldown === 0) {
    //         piece.cooldown = PieceCooldown[piece.type];
    //         const newPosition = movingPieces[pieceId];
    //         piece.position.x = newPosition.x;
    //         piece.position.y = newPosition.y;
    //         delete movingPieces[pieceId];
    //       } else {
    //         piece.cooldown -= 1;
    //         if (piece.cooldown === 0) {
    //           // determine moves
    //         }
    //       }
    //     }
    //   },
    // },

    // end of reducers
  },
});

export const selectPieceById = (pieceId) => (state) =>
  state.game.pieces[pieceId];
export const selectCells = (state) => state.game.cells;
export const selectPlayerPosition = (state) =>
  state.game.pieces[playerId].position;

export const { movePlayer } = gameSlice.actions;
export default gameSlice.reducer;

function verifyPlayerMovement(v1, v2) {
  assertIsVector(v1);
  assertIsVector(v2);
  const dist = getDistance(v1, v2);
  assert(dist === 1, `Invalid player movement! (${dist})`);
}
