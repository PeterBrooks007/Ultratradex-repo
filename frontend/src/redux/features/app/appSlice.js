import { createSlice,  } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  tradingMode: "Live",
  tradeOrderClicked: "",
  typeOfDeposit: "",
  fundAccount: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    SET_ISLOADING_TRUE(state) {
      state.isLoading = true;
    },
    SET_ISLOADING_FALSE(state) {
      state.isLoading = false;
    },
    SET_TRADINGMODE(state, actions) {
      state.tradingMode = actions.payload;
    },
    SET_TRADEORDERCLICKED(state, actions) {
      state.tradeOrderClicked = actions.payload;
    },
    SET_TYPEOFDEPOSIT(state, actions) {
      state.typeOfDeposit = actions.payload;
    },
    SET_FUNDACCOUNT(state, actions) {
      state.fundAccount = actions.payload;
    },
  },
});


export const {SET_ISLOADING_TRUE, SET_ISLOADING_FALSE, SET_TRADINGMODE, SET_TRADEORDERCLICKED, SET_TYPEOFDEPOSIT, SET_FUNDACCOUNT} = appSlice.actions;

export const selectIsLoading = (state) => state.app.isLoading;

export default appSlice.reducer