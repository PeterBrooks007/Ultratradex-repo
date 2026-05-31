import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import tradesService from "./tradesService";

const initialState = {
  isLoading: false,
  isSemiLoading: false,
  selectedTrade: null,
  allTrades: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// addTrade
export const addTrade = createAsyncThunk(
  "trades/addmail",
  async (formData, thunkAPI) => {
    try {
      return await tradesService.addTrade(formData);
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

// adminGetAllUserTrades
export const adminGetAllUserTrades = createAsyncThunk(
  "trades/adminGetAllUserTrades",
  async (id, thunkAPI) => {
    try {
      return await tradesService.adminGetAllUserTrades(id);
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


// adminUpdateUserTrade
export const adminUpdateUserTrade = createAsyncThunk(
  "trades/adminUpdateUserTrade",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradesService.adminUpdateUserTrade(id, formData);
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


// cancelTrade
export const cancelTrade = createAsyncThunk(
  "trades/cancelTrade",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradesService.cancelTrade(id, formData);
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

// deleteTrade
export const deleteTrade = createAsyncThunk(
  "trades/deleteTrade",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradesService.deleteTrade(id, formData);
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



// adminApproveUserTrade
export const adminApproveUserTrade = createAsyncThunk(
  "trades/adminApproveUserTrade",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradesService.adminApproveUserTrade(id, formData);
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


// autoTradeUpdate
export const autoTradeUpdate = createAsyncThunk(
  "trades/autoTradeUpdate",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradesService.autoTradeUpdate(id, formData);
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

// userUpdateAdminTrade
export const userUpdateAdminTrade = createAsyncThunk(
  "trades/userUpdateAdminTrade",
  async ({id, formData}, thunkAPI) => {
    try {
      return await tradesService.userUpdateAdminTrade(id, formData);
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


const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {

    RESET_TRADES(state) {
      state.selectedTrade = null;
      state.allTrades = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDTRADES: (state, action) => {
      state.selectedTrade = action.payload; // Set the clicked mailbox
    },

   

  },
  extraReducers: (builder) => {
    builder

      //addTrade
      .addCase(addTrade.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(addTrade.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allTrades = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addTrade.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //adminGetAllUserTrades
      .addCase(adminGetAllUserTrades.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminGetAllUserTrades.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allTrades = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminGetAllUserTrades.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allTrades = [];
        // toast.error(action.payload);
      })

      
         //adminUpdateUserTrade
         .addCase(adminUpdateUserTrade.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(adminUpdateUserTrade.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTrades = action.payload.data;
          // console.log(action.payload);
          toast.success("User Trade Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminUpdateUserTrade.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      
         //adminApproveUserTrade
         .addCase(adminApproveUserTrade.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(adminApproveUserTrade.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTrades = action.payload.data;
          // console.log(action.payload);
          toast.success("User Trade Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminApproveUserTrade.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

         //autoTradeUpdate
         .addCase(autoTradeUpdate.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(autoTradeUpdate.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTrades = action.payload.data;
          // console.log(action.payload);
          // toast.success("User Trade Updated Successfully", {
          //   position: "top-center",
          //   transition: Slide,
          // });
        })
        .addCase(autoTradeUpdate.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      

         //userUpdateAdminTrade
         .addCase(userUpdateAdminTrade.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(userUpdateAdminTrade.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTrades = action.payload.data;
          // console.log(action.payload);
          // toast.success("User Trade Updated Successfully", {
          //   position: "top-center",
          //   transition: Slide,
          // });
        })
        .addCase(userUpdateAdminTrade.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          // toast.error(action.payload, {
          //   position: "top-center",
          //   transition: Slide,
          // });
        })
      
         //deleteTrade
         .addCase(deleteTrade.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(deleteTrade.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTrades = action.payload.data;
          // console.log(action.payload);
          toast.success("Trade Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteTrade.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      
         //cancelTrade
         .addCase(cancelTrade.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(cancelTrade.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTrades = action.payload.data;
          // console.log(action.payload);
          toast.success("Trade Cancelled Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(cancelTrade.rejected, (state, action) => {
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

export const { RESET_TRADES, SETSELECTEDTRADES  } = tradesSlice.actions;

export default tradesSlice.reducer;
