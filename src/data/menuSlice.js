import { createSlice } from "@reduxjs/toolkit";
import { assert, Difficulty, PageName } from "../global/utils";

if (localStorage.getItem("difficulty") === null) {
  localStorage.setItem("difficulty", JSON.stringify(Number(Difficulty.EASY)));
}

if (localStorage.getItem("showIndicators") === null) {
  localStorage.setItem("showIndicators", JSON.stringify(false));
}

const initialState = {
  page: PageName.MAIN_MENU,
  settings: {
    difficulty: JSON.parse(localStorage.getItem("difficulty")),
    showIndicators: JSON.parse(localStorage.getItem("showIndicators")),
  },
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

    setDifficulty: {
      reducer(state, action) {
        const { difficulty } = action.payload;
        assert(
          difficulty >= 0 && difficulty < Object.keys(Difficulty).length,
          "Invalid difficulty set!"
        );
        localStorage.setItem("difficulty", JSON.stringify(Number(difficulty)));
        state.settings.difficulty = difficulty;
      },
      prepare(difficulty) {
        return { payload: { difficulty } };
      },
    },

    setShowIndicators: {
      reducer(state, action) {
        const { showIndicators } = action.payload;
        localStorage.setItem("showIndicators", JSON.stringify(showIndicators));
        state.settings.showIndicators = showIndicators;
      },
      prepare(showIndicators) {
        return { payload: { showIndicators } };
      },
    },
  },
});

export const selectPage = (state) => state.menu.page;
export const selectDifficulty = (state) => state.menu.settings.difficulty;
export const selectShowIndicators = (state) =>
  state.menu.settings.showIndicators;
export const { switchPage, setDifficulty, setShowIndicators } =
  menuSlice.actions;
export default menuSlice.reducer;
