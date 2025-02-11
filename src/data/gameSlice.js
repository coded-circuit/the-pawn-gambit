import { createSlice, nanoid } from "@reduxjs/toolkit";
import { assert, PieceType, Vector2 } from "../global/utils";

const playerId = nanoid();
const initialState = {
  pieces: {
    // array of PieceData
    [playerId]: {
      position: {
        x: 3,
        y: 7,
      },
      type: PieceType.PLAYER,
      cooldown: null,
    },
  },
  occupiedCells: new Array(8).fill().map(() => new Array(8).fill(false)), // 2d boolean matrix
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetState: {
      reducer(state) {
        return initialState;
      },
    },
    setOccupiedCell: {
      reducer(state, action) {
        const { x, y, value } = action.payload;
        state.occupiedCells[x][y] = value;
      },
      prepare(x, y, value) {
        return {
          payload: {
            x,
            y,
            value,
          },
        };
      },
    },
    movePlayer: {
      reduce(state, action) {
        const { x, y } = action.payload;
        const currPosition = state.pieces[0].getPosition();
        const newPosition = currPosition.add(new Vector2(x, y));
        verifyPlayerMovement(currPosition, newPosition);
        state.pieces[0].setPosition(newPosition.x, newPosition.y);
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

    // end of reducers
  },
});

export const selectCells = (state) => state.cells;
export const { setOccupiedCell, resetState } = gameSlice.actions;
export default gameSlice.reducer;

function verifyPlayerMovement(currPos, nextPos) {
  const dist = currPos.distance(nextPos);
  assert(dist === 1, `Invalid player movement! (${dist})`);
}
