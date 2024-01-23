import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "@/store/accountSlice";
import watchlistReducer from "@/store/watchlistSlice";

export const store = configureStore({
  reducer: {
    accounts: accountReducer,
    watchlist: watchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
