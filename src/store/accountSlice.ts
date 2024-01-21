import { AccountSchema } from "@/model/account.model";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { z } from "zod";

type Account = z.infer<typeof AccountSchema>;

export interface AccountState {
  accounts: Account[];
}

const initialState: AccountState = {
  accounts: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    initAccount: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    // updateToken: (state, action: PayloadAction<string> ) => {

    // }
  },
});

export const { initAccount, addAccount } = accountSlice.actions;

export default accountSlice.reducer;
