import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import tradingBotsService from "./tradingBotsService";

const initialState = {
  isLoading: false,
  tradingBot: null,
  tradingBots: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addTradingBot
export const addTradingBot = createAsyncThunk(
  "tradingBots/addTradingBot",
  async (userData, thunkAPI) => {
    try {
      return await tradingBotsService.addTradingBot(userData);
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

// getAllTradingBots
export const getAllTradingBots = createAsyncThunk(
  "tradingBots/getAllTradingBots",
  async (_, thunkAPI) => {
    try {
      return await tradingBotsService.getAllTradingBots();
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

// updateTradingBot
export const updateTradingBot = createAsyncThunk(
  "tradingBots/updateTradingBot",
  async ({id, userData}, thunkAPI) => {
    try {
      return await tradingBotsService.updateTradingBot(id, userData);
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
export const deleteTradingBot = createAsyncThunk(
  "tradingBots/deleteTradingBot",
  async ({id, userData}, thunkAPI) => {
    try {
      return await tradingBotsService.deleteTradingBot(id, userData);
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


// updateTradingBotPhoto
export const updateTradingBotPhoto = createAsyncThunk(
  "tradingBots/updateTradingBotPhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradingBotsService.updateTradingBotPhoto(id, formData);
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




const tradingBotsSlice = createSlice({
  name: "tradingBots",
  initialState,
  reducers: {
    RESET_TRADINGBOTS(state) {
      state.tradingBot = null;
      state.tradingBots = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDTRADINGBOT: (state, action) => {
      state.tradingBot = action.payload; // Set the clicked deposit
    },
    RESET_SETTRADINGBOT(state) {
      state.tradingBot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //addtradingBots
      .addCase(addTradingBot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTradingBot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.tradingBots = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addTradingBot.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //getAllTradingBots
       .addCase(getAllTradingBots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTradingBots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.tradingBots = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllTradingBots.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //updateTradingBot
       .addCase(updateTradingBot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTradingBot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.tradingBots = action.payload;
        // console.log(action.payload);
        toast.success("Bot Updated Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateTradingBot.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

        //deleteExpertTrader
        .addCase(deleteTradingBot.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteTradingBot.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.tradingBots = action.payload.data;
          // console.log(action.payload);
          toast.success("Trading Bot Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteTradingBot.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

         //updateTradingBotPhoto
         .addCase(updateTradingBotPhoto.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateTradingBotPhoto.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.tradingBots = action.payload;
          // console.log(action.payload);
          toast.success("Bot Profile Phote Changed Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateTradingBotPhoto.rejected, (state, action) => {
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

export const {RESET_TRADINGBOTS, SETSELECTEDTRADINGBOT, RESET_SETTRADINGBOT } = tradingBotsSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default tradingBotsSlice.reducer;
