import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import depositService from "./depositService";

const initialState = {
  isLoading: false,
  deposit: null,
  deposits: [],
  AllPendingDepositRequest: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// getUserDeposithistory
export const getUserDeposithistory = createAsyncThunk(
  "deposit/getUserDeposithistory",
  async (_, thunkAPI) => {
    try {
      return await depositService.getUserDeposithistory();
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



// depositFund
export const depositFund = createAsyncThunk(
  "deposit/depositFund",
  async (formData, thunkAPI) => {
    try {
      return await depositService.depositFund(formData);
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

// adminAddTradeHistoryToUser
export const adminAddTradeHistoryToUser = createAsyncThunk(
  "deposit/adminAddTradeHistoryToUser",
  async (formData, thunkAPI) => {
    try {
      return await depositService.adminAddTradeHistoryToUser(formData);
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

// requestDepositDetails
export const requestDepositDetails = createAsyncThunk(
  "deposit/requestDepositDetails",
  async (formData, thunkAPI) => {
    try {
      return await depositService.requestDepositDetails(formData);
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

//getAllPendingDepositRequest
export const getAllPendingDepositRequest = createAsyncThunk(
  "deposit/getAllPendingDepositRequest",
  async (_, thunkAPI) => {
    try {
      return await depositService.getAllPendingDepositRequest();
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

// approveDepositRequest
export const approveDepositRequest = createAsyncThunk(
  "deposit/approveDepositRequest",
  async ({id, userData}, thunkAPI) => {
    try {
      return await depositService.approveDepositRequest(id, userData);
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

// deleteDepositRequest
export const deleteDepositRequest = createAsyncThunk(
  "deposit/deleteDepositRequest",
  async ({id, userData}, thunkAPI) => {
    try {
      return await depositService.deleteDepositRequest(id, userData);
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

// adminGetUserDeposithistory
export const adminGetUserDeposithistory = createAsyncThunk(
  "deposit/adminGetUserDeposithistory",
  async (id, thunkAPI) => {
    try {
      return await depositService.adminGetUserDeposithistory(id);
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




const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    RESET_DEPOSIT_MESSAGE(state) {
      state.message = "";
    },
    RESET_DEPOSIT(state) {
      state.deposit = null;
      state.deposits = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
   SETSELECTEDDEPOSIT: (state, action) => {
        state.deposit = action.payload; // Set the clicked deposit
      },
  },
  extraReducers: (builder) => {
    builder
      //getUserdeposithistory
      .addCase(getUserDeposithistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDeposithistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deposits = action.payload;
        toast.success(action.payload,  {
            position: "top-center",
            transition: Slide,
          });
        // console.log(action.payload);
      })
      .addCase(getUserDeposithistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })


      //requestDepositDetails
      .addCase(requestDepositDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestDepositDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deposits = action.payload;
        toast.success(action.payload,  {
            position: "top-center",
            transition: Slide,
          });
        // console.log(action.payload);
      })
      .addCase(requestDepositDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })

      //depositFund
      .addCase(depositFund.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(depositFund.fulfilled, (state, action) => {
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
      .addCase(depositFund.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //adminAddTradeHistoryToUser
      .addCase(adminAddTradeHistoryToUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminAddTradeHistoryToUser.fulfilled, (state, action) => {
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
      .addCase(adminAddTradeHistoryToUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

        //getAllPendingDepositRequest
        .addCase(getAllPendingDepositRequest.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllPendingDepositRequest.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.AllPendingDepositRequest = action.payload;
          // console.log(action.payload);
        })
        .addCase(getAllPendingDepositRequest.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          // toast.error(action.payload, {
          //   position: "top-center",
          //   transition: Slide,
          // });
        })

      //adminApproveDepositRequest
      .addCase(approveDepositRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveDepositRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.AllPendingDepositRequest = action.payload;
        // console.log(action.payload);
        toast.success("Deposit Request Updated Successlly", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(approveDepositRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

       //deleteDepositRequest
       .addCase(deleteDepositRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDepositRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.AllPendingDepositRequest = action.payload.data;
        // console.log(action.payload);
        toast.success("Deposit Request Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(deleteDepositRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

       //adminGetUserDeposithistory
       .addCase(adminGetUserDeposithistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetUserDeposithistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deposits = action.payload;
        toast.success(action.payload,  {
            position: "top-center",
            transition: Slide,
          });
        // console.log(action.payload);
      })
      .addCase(adminGetUserDeposithistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })
  },
});

export const { RESET_DEPOSITL_MESSAGE, RESET_DEPOSIT, SETSELECTEDDEPOSIT } =
depositSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default depositSlice.reducer;
