import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "@/store/accountSlice";
import watchlistReducer from "@/store/watchlistSlice";
import orderReducer from "@/store/orderSlice";

export const store = configureStore({
  reducer: {
    accounts: accountReducer,
    watchlist: watchlistReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
