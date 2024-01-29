import { PositionResponse } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { positions: PositionResponse[] } = {
  positions: [],
};

const positonSlice = createSlice({
  name: "Position",
  initialState,
  reducers: {
    initPosition: (state, action: PayloadAction<PositionResponse[]>) => {
      state.positions = action.payload;
    },
    updatePositionLtp: (state, action) => {
      let p = state.positions.find((pos) => pos.token === action.payload.token);
      if (p) {
        p.lp = action.payload.lp;
      }
    },
  },
});

export const { initPosition, updatePositionLtp } = positonSlice.actions;

export default positonSlice.reducer;
