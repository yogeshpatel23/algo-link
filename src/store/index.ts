import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "@/store/accountSlice";
import watchlistReducer from "@/store/watchlistSlice";
import orderReducer from "@/store/orderSlice";
import positionReducer from "@/store/positonSlice";

export const store = configureStore({
  reducer: {
    accounts: accountReducer,
    watchlist: watchlistReducer,
    order: orderReducer,
    positons: positionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
