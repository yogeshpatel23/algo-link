import { BrokerOrder } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { orders: BrokerOrder[] } = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    initOrderList: (state, action: PayloadAction<BrokerOrder[]>) => {
      state.orders = action.payload;
    },
  },
});

export const { initOrderList } = orderSlice.actions;

export default orderSlice.reducer;
