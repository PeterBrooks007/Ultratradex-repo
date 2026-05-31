import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import totalCountService from "./totalCountsService";

const initialState = {
  isLoading: false,
  totalUsers: "",
  unreadMessages: "",
  totalDepositRequests: "",
  totalWithdrawalRequests: "",
  newNotifications: "",
  recentUsers: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// getAllAdminTotalCounts
export const getAllAdminTotalCounts = createAsyncThunk(
  "totalCounts/getAllAdminTotalCounts",
  async (_, thunkAPI) => {
    try {
      return await totalCountService.getAllAdminTotalCounts();
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

// getAllUserTotalCounts
export const getAllUserTotalCounts = createAsyncThunk(
  "totalCounts/getAllUserTotalCounts",
  async (_, thunkAPI) => {
    try {
      return await totalCountService.getAllUserTotalCounts();
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

//


const totalCountsSlice = createSlice({
  name: "totalCounts",
  initialState,
  reducers: {
    RESET_WITHDRAWAL_MESSAGE(state) {
      state.message = "";
    },
    RESET_TOTALCOUNTS(state) {
      state.totalUsers = "";
      state.unreadMessages = "";
      state.totalDepositRequests = "";
      state.totalWithdrawalRequests = "";
      state.recentUsers = [];
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
      //getAllAdminTotalCounts
      .addCase(getAllAdminTotalCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAdminTotalCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.totalUsers = action.payload.userCount;
        state.unreadMessages = action.payload.inboxCount;
        state.totalDepositRequests = action.payload.pendingDepositCount;
        state.totalWithdrawalRequests = action.payload.pendingWithdrawalCount;
        state.recentUsers = action.payload.recentUsers;
        state.newNotifications = action.payload.notificationCount;
        // toast.error(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllAdminTotalCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })

      //getAllUserTotalCounts
      .addCase(getAllUserTotalCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUserTotalCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.unreadMessages = action.payload.unreadMessageCount;
        state.newNotifications = action.payload.notificationCount;
        // toast.error(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllUserTotalCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload);
        
      })

     

  },
});

export const { RESET_TOTALCOUNTS } =
totalCountsSlice.actions;

export const selectTransactions = (state) => state.transaction.transactions;
export const selectTransactionMessage = (state) => state.transaction.message;
export const selectReceiverName = (state) => state.transaction.receiverName;

export default totalCountsSlice.reducer;
