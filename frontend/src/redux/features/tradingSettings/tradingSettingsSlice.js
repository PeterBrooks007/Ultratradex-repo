import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import tradeSettingsService from "./tradingSettingsService";

const initialState = {
  isLoading: false,
  isSemiLoading: false,
  exchange: null,
  allExchanges: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addExchangeType
export const addExchangeType = createAsyncThunk(
  "tradeSettings/addExchangeType",
  async (userData, thunkAPI) => {
    try {
      return await tradeSettingsService.addExchangeType(userData);
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

// getAllTradingSetting
export const getAllTradingSetting = createAsyncThunk(
  "tradeSettings/getAllTradingSetting",
  async (_, thunkAPI) => {
    try {
      return await tradeSettingsService.getAllTradingSetting();
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

// updateTradingSetting
export const updateTradingSetting = createAsyncThunk(
  "tradeSettings/updateTradingSetting",
  async ({id, userData}, thunkAPI) => {
    try {
      return await tradeSettingsService.updateTradingSetting(id, userData);
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


// deleteTradingSettingExchange
export const deleteTradingSettingExchange = createAsyncThunk(
  "tradeSettings/deleteTradingSettingExchange",
  async ({id, userData}, thunkAPI) => {
    try {
      return await tradeSettingsService.deleteTradingSettingExchange(id, userData);
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

// deleteArrayOfTradingExchange
export const deleteArrayOfTradingExchange = createAsyncThunk(
  "tradeSettings/deleteArrayOfTradingExchange",
  async (TradesExchangeIds, thunkAPI) => {
    try {
      return await tradeSettingsService.deleteArrayOfTradingExchange(TradesExchangeIds);
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


// updateTradingSettingPhoto
export const updateTradingSettingPhoto = createAsyncThunk(
  "tradeSettings/updateTradingSettingPhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradeSettingsService.updateTradingSettingPhoto(id, formData);
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


// addTradingPairs
export const addTradingPairs = createAsyncThunk(
  "tradeSettings/addTradingPairs",
  async ({id, tradingPairsArray}, thunkAPI) => {
    try {
      return await tradeSettingsService.addTradingPairs(id, tradingPairsArray);
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


// DeleteArrayTradingPairs
export const DeleteArrayTradingPairs = createAsyncThunk(
  "tradeSettings/DeleteArrayTradingPairs",
  async ({id, tradingPairsArray}, thunkAPI) => {
    try {
      return await tradeSettingsService.DeleteArrayTradingPairs(id, tradingPairsArray);
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




const tradeSettingsSlice = createSlice({
  name: "tradeSettings",
  initialState,
  reducers: {
    RESET_TRADESETTINGS(state) {
      state.wallet = null;
      state.wallets = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDEXCHANGETYPE: (state, action) => {
      state.exchange = action.payload; // Set the clicked deposit
    },
    // RESET_SETTRADINGBOT(state) {
    //   state.tradingBot = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      //addExchangeType
      .addCase(addExchangeType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addExchangeType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allExchanges = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addExchangeType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //getAllTradingSetting
       .addCase(getAllTradingSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTradingSetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allExchanges = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllTradingSetting.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //updateTradingSetting
       .addCase(updateTradingSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTradingSetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allExchanges = action.payload;
        // console.log(action.payload);
        toast.success("Exchange Updated Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateTradingSetting.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      

        //deleteTradingSettingExchange
        .addCase(deleteTradingSettingExchange.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteTradingSettingExchange.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allExchanges = action.payload.data;
          // console.log(action.payload);
          toast.success("Exchange Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteTradingSettingExchange.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

        //deleteArrayOfTradingExchange
        .addCase(deleteArrayOfTradingExchange.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteArrayOfTradingExchange.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allExchanges = action.payload.data;
          // console.log(action.payload);
          toast.success("Exchange Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteArrayOfTradingExchange.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

         //updateConnectWalletPhoto
         .addCase(updateTradingSettingPhoto.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateTradingSettingPhoto.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allExchanges = action.payload;
          // console.log(action.payload);
          toast.success("Wallet Profile Photo Changed Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateTradingSettingPhoto.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

         //addTradingPairs
       .addCase(addTradingPairs.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(addTradingPairs.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.exchange = action.payload.result;
        state.allExchanges = action.payload.data;
        // console.log(action.payload);
        toast.success("Exchange Updated Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addTradingPairs.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


         //DeleteArrayTradingPairs
       .addCase(DeleteArrayTradingPairs.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(DeleteArrayTradingPairs.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.exchange = action.payload.result;
        state.allExchanges = action.payload.data;
        // console.log(action.payload);
        toast.success("Exchange Pairs Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(DeleteArrayTradingPairs.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


      
  },
});

export const {RESET_CONNECTWALLET, SETSELECTEDEXCHANGETYPE } = tradeSettingsSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default tradeSettingsSlice.reducer;
