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
    updateOrderLtp: (state, action) => {
      state.orders.map((order) => {
        if (order.token === action.payload.token) {
          order.ltp = action.payload.lp;
        }
        return order;
      });
    },
    removeOrdrer: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.norenordno === action.payload
      );
    },
  },
});

export const { initOrderList, updateOrderLtp, removeOrdrer } =
  orderSlice.actions;

export default orderSlice.reducer;
