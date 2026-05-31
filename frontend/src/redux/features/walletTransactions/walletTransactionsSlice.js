import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import walletTransactionsService from "./walletTransactionsService";

const initialState = {
  isLoading: false,
  isSemiLoading: false,
  selectedTransaction: null,
  allTransactions: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// addTransaction
export const addTransaction = createAsyncThunk(
  "walletTransactions/addTransaction",
  async (formData, thunkAPI) => {
    try {
      return await walletTransactionsService.addTransaction(formData);
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

// getUserWalletTransactions
export const getUserWalletTransactions = createAsyncThunk(
  "walletTransactions/getUserWalletTransactions",
  async (_, thunkAPI) => {
    try {
      return await walletTransactionsService.getUserWalletTransactions();
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

// adminGetAllUserWalletTransactions
export const adminGetAllUserWalletTransactions = createAsyncThunk(
  "walletTransactions/adminGetAllUserWalletTransactions",
  async (id, thunkAPI) => {
    try {
      return await walletTransactionsService.adminGetAllUserWalletTransactions(id);
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


// adminUpdateUserWalletTransaction
export const adminUpdateUserWalletTransaction = createAsyncThunk(
  "walletTransactions/adminUpdateUserWalletTransaction",
  async ({id, formData}, thunkAPI) => {
    try {
      return await walletTransactionsService.adminUpdateUserWalletTransaction(id, formData);
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



// deleteTransaction
export const deleteTransaction = createAsyncThunk(
  "walletTransactions/deleteTransaction",
  async ({id, formData}, thunkAPI) => {
    try {
      return await walletTransactionsService.deleteTransaction(id, formData);
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



const walletTransactionsSlice = createSlice({
  name: "walletTransactions",
  initialState,
  reducers: {

    RESET_WALLETTRANSACTIONS(state) {
      state.selectedTransaction = null;
      state.allTransactions = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDTRANSACTION: (state, action) => {
      state.selectedTransaction = action.payload; // Set the clicked mailbox
    },

   

  },
  extraReducers: (builder) => {
    builder

      //addTransaction
      .addCase(addTransaction.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allTransactions = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getUserWalletTransactions
      .addCase(getUserWalletTransactions.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(getUserWalletTransactions.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allTransactions = action.payload;
        // console.log(action.payload);
        // toast.success(action.payload.message, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })
      .addCase(getUserWalletTransactions.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //adminGetAllUserWalletTransactions
      .addCase(adminGetAllUserWalletTransactions.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminGetAllUserWalletTransactions.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allTransactions = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminGetAllUserWalletTransactions.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allTransactions = [];
        toast.error(action.payload);
      })

      
         //adminUpdateUserTrade
         .addCase(adminUpdateUserWalletTransaction.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(adminUpdateUserWalletTransaction.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTransactions = action.payload.data;
          // console.log(action.payload);
          toast.success("User Transaction Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminUpdateUserWalletTransaction.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      
      
         //deleteTransaction
         .addCase(deleteTransaction.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(deleteTransaction.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allTransactions = action.payload.data;
          // console.log(action.payload);
          toast.success("Transaction Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteTransaction.rejected, (state, action) => {
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

export const { RESET_WALLETTRANSACTIONS, SETSELECTEDTRANSACTION  } = walletTransactionsSlice.actions;

export default walletTransactionsSlice.reducer;
