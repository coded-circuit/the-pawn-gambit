import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pieces: [
    // array of PieceData
  ],
  cells: new Array(8).fill().map(() => new Array(8).fill(false)), // 2d boolean matrix
};

const pieceSlice = createSlice({
  name: "piece",
  initialState,
  reducers: {
    setOccupiedCell: {
      reducer(state, action) {
        const { x, y, value } = action.payload;
        state.cells[x][y] = value;
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

    // end of reducers
  },
});

export const { setOccupiedCell } = pieceSlice.actions;
export default pieceSlice.reducer;
