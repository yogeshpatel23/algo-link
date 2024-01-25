import { NFOScript, NSEScript } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type watchlistState = {
  scripts: (NSEScript | NFOScript)[];
};

const initialState: watchlistState = {
  scripts: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWhatchlist: (state, action: PayloadAction<NFOScript | NSEScript>) => {
      state.scripts.push(action.payload);
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.scripts = state.scripts.filter((s) => s.token !== action.payload);
    },
    updateScript: (state, action) => {
      let s = state.scripts.find((s) => s.token === action.payload.token);
      if (s) {
        if (action.payload.lp) {
          s.ltp = action.payload.lp;
        }
        if (action.payload.pc) {
          s.cp = action.payload.pc;
        }
      }
    },
  },
});

export const { addToWhatchlist, removeFromWatchlist, updateScript } =
  watchlistSlice.actions;

export default watchlistSlice.reducer;
