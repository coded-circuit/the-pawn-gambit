import { createSlice } from "@reduxjs/toolkit";
import { PageName } from "../global/utils";

const initialState = {
  page: PageName.MAIN_MENU,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    switchPage: {
      reducer(state, action) {
        const { newPage } = action.payload;
        state.page = newPage;
      },
      prepare(newPage) {
        return {
          payload: {
            newPage,
          },
        };
      },
    },
  },
});

export const selectPage = (state) => state.menu.page;
export const { switchPage } = menuSlice.actions;
export default menuSlice.reducer;
