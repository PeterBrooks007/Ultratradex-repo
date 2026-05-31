import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import tradingSignalsService from "./tradingSignalsService";

const initialState = {
  isLoading: false,
  tradingSignal: null,
  tradingSignals: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addTradingSignal
export const addTradingSignal = createAsyncThunk(
  "tradingSignals/addTradingSignal",
  async (userData, thunkAPI) => {
    try {
      return await tradingSignalsService.addTradingSignal(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// getAllTradingSignals
export const getAllTradingSignals = createAsyncThunk(
  "tradingSignals/getAllTradingSignals",
  async (_, thunkAPI) => {
    try {
      return await tradingSignalsService.getAllTradingSignals();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// updateTradingSignal
export const updateTradingSignal = createAsyncThunk(
  "tradingSignals/updateTradingSignal",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await tradingSignalsService.updateTradingSignal(id, userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// deleteTradingBot
export const deleteTradingSignal = createAsyncThunk(
  "tradingSignals/deleteTradingSignal",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await tradingSignalsService.deleteTradingSignal(id, userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// updateTradingSignalPhoto
export const updateTradingSignalPhoto = createAsyncThunk(
  "tradingSignals/updateTradingSignalPhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradingSignalsService.updateTradingSignalPhoto(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const tradingSignalsSlice = createSlice({
  name: "tradingSignals",
  initialState,
  reducers: {
    RESET_TRADINGSIGNALS(state) {
      state.tradingSignal = null;
      state.tradingSignals = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDTRADINGSIGNAL: (state, action) => {
      state.tradingSignal = action.payload; // Set the clicked deposit
    },
    RESET_SETTRADINGSIGNAL(state) {
      state.tradingSignal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //addtradingBots
      .addCase(addTradingSignal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTradingSignal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.tradingSignals = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addTradingSignal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllTradingSignals
      .addCase(getAllTradingSignals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTradingSignals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.tradingSignals = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllTradingSignals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //updateTradingBot
      .addCase(updateTradingSignal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTradingSignal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.tradingSignals = action.payload;
        // console.log(action.payload);
        toast.success("Signal Updated Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateTradingSignal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //deleteExpertTrader
      .addCase(deleteTradingSignal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTradingSignal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.tradingSignals = action.payload.data;
        // console.log(action.payload);
        toast.success("Trading Signal Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(deleteTradingSignal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

        //updateTradingSignalPhoto
        .addCase(updateTradingSignalPhoto.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateTradingSignalPhoto.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.tradingSignals = action.payload;
          // console.log(action.payload);
          toast.success("Signal Profile Phote Changed Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateTradingSignalPhoto.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
  },
});

export const { RESET_TRADINGSIGNALS, SETSELECTEDTRADINGSIGNAL, RESET_SETTRADINGSIGNAL } =
  tradingSignalsSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default tradingSignalsSlice.reducer;
