import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import withdrawalService from "./withdrawalService";

const initialState = {
  isLoading: false,
  withdrawal: null,
  withdrawals: [],
  AllPendingWithdrawalRequest: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// getUserWithdrawalhistory
export const getUserWithdrawalhistory = createAsyncThunk(
  "withdrawal/getUserTransactions",
  async (_, thunkAPI) => {
    try {
      return await withdrawalService.getUserWithdrawalhistory();
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

// withdrawFund
export const withdrawFund = createAsyncThunk(
  "withdrawal/withdrawFund",
  async (formData, thunkAPI) => {
    try {
      return await withdrawalService.withdrawFund(formData);
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

//getAllPendingWithdrawalRequest
export const getAllPendingWithdrawalRequest = createAsyncThunk(
  "withdrawal/getAllPendingWithdrawalRequest",
  async (_, thunkAPI) => {
    try {
      return await withdrawalService.getAllPendingWithdrawalRequest();
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

// approveWithdrawalRequest
export const approveWithdrawalRequest = createAsyncThunk(
  "withdrawal/approveWithdrawalRequest",
  async ({id, userData}, thunkAPI) => {
    try {
      return await withdrawalService.approveWithdrawalRequest(id, userData);
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


// deleteWithdrawalRequest
export const deleteWithdrawalRequest = createAsyncThunk(
  "withdrawal/deleteDepositRequest",
  async ({id, userData}, thunkAPI) => {
    try {
      return await withdrawalService.deleteWithdrawalRequest(id, userData);
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

// adminGetUserWithdrawalhistory
export const adminGetUserWithdrawalhistory = createAsyncThunk(
  "withdrawal/adminGetUserWithdrawalhistory",
  async (id, thunkAPI) => {
    try {
      return await withdrawalService.adminGetUserWithdrawalhistory(id);
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



const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {
    RESET_WITHDRAWAL_MESSAGE(state) {
      state.message = "";
    },
    RESET_WITHDRAWAL(state) {
      state.withdrawal = null;
      state.withdrawals = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
   SETSELECTEDWITHDRAWAL: (state, action) => {
        state.withdrawal = action.payload; // Set the clicked withdrawal
      },
  },
  extraReducers: (builder) => {
    builder
      //getUserWithdrawalhistory
      .addCase(getUserWithdrawalhistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWithdrawalhistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.withdrawals = action.payload;
        toast.error(action.payload,  {
            position: "top-center",
            transition: Slide,
          });
        // console.log(action.payload);
      })
      .addCase(getUserWithdrawalhistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })

      //withdrawFund
      .addCase(withdrawFund.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(withdrawFund.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
        toast.success(action.payload, {
            position: "top-right",
            transition: Slide,
          });
        // console.log(action.payload);
      })
      .addCase(withdrawFund.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //getAllPendingDepositRequest
       .addCase(getAllPendingWithdrawalRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPendingWithdrawalRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.AllPendingWithdrawalRequest = action.payload;
        // console.log(action.payload);
      })
      .addCase(getAllPendingWithdrawalRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

       //adminApproveDepositRequest
       .addCase(approveWithdrawalRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveWithdrawalRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.AllPendingWithdrawalRequest = action.payload;
        // console.log(action.payload);
        toast.success("Withdrawal Request Updated Successlly", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(approveWithdrawalRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


       //deleteDepositRequest
       .addCase(deleteWithdrawalRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWithdrawalRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.AllPendingWithdrawalRequest = action.payload.data;
        // console.log(action.payload);
        toast.success("Withdrawal Request Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(deleteWithdrawalRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


      
      //adminGetUserWithdrawalhistory
       .addCase(adminGetUserWithdrawalhistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetUserWithdrawalhistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.withdrawals = action.payload;
        toast.success(action.payload,  {
            position: "top-center",
            transition: Slide,
          });
        // console.log(action.payload);
      })
      .addCase(adminGetUserWithdrawalhistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })


  },
});

export const { RESET_WITHDRAWAL_MESSAGE, RESET_WITHDRAWAL, SETSELECTEDWITHDRAWAL } =
  withdrawalSlice.actions;

export const selectTransactions = (state) => state.transaction.transactions;
export const selectTransactionMessage = (state) => state.transaction.message;
export const selectReceiverName = (state) => state.transaction.receiverName;

export default withdrawalSlice.reducer;
