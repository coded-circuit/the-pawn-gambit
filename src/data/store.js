import { configureStore } from "@reduxjs/toolkit";
import pieceReducer from "./pieceSlice";
import menuReducer from "./menuSlice";

const store = configureStore({
  reducer: {
    piece: pieceReducer,
    menu: menuReducer,
  },
});

export default store;
