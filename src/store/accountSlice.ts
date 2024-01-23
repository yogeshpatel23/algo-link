import { Account } from "@/model/accountSchema";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AccountState {
  accounts: Account[];
  selectedAcc: Account | null;
}

const initialState: AccountState = {
  accounts: [],
  selectedAcc: null,
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
    setSelectedAcc: (state, action: PayloadAction<Account>) => {
      state.selectedAcc = action.payload;
    },
  },
});

export const { initAccount, addAccount, setSelectedAcc } = accountSlice.actions;

export default accountSlice.reducer;
