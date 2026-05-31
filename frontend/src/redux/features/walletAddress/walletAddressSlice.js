import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import walletAddressService from "./walletAddressService";

const initialState = {
  isLoading: false,
  walletAddress: null,
  allWalletAddress: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addWalletAddress
export const addWalletAddress = createAsyncThunk(
  "walletAddress/addWalletAddress",
  async (userData, thunkAPI) => {
    try {
      return await walletAddressService.addWalletAddress(userData);
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

// getAllWalletAddress
export const getAllWalletAddress = createAsyncThunk(
  "walletAddress/getAllWalletAddress",
  async (_, thunkAPI) => {
    try {
      return await walletAddressService.getAllWalletAddress();
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

// updateWalletAddress
export const updateWalletAddress = createAsyncThunk(
  "walletAddress/updateWalletAddress",
  async ({id, userData}, thunkAPI) => {
    try {
      return await walletAddressService.updateWalletAddress(id, userData);
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


// updateWalletAddresIcon
export const updateWalletAddresIcon = createAsyncThunk(
  "walletAddress/updateWalletAddresIcon",
  async ({id, formData}, thunkAPI) => {
    try {
      return await walletAddressService.updateWalletAddresIcon(id, formData);
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

// updateWalletAddresQrcode
export const updateWalletAddresQrcode = createAsyncThunk(
  "walletAddress/updateWalletAddresQrcode",
  async ({id, formData}, thunkAPI) => {
    try {
      return await walletAddressService.updateWalletAddresQrcode(id, formData);
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


// deleteWalletAddress
export const deleteWalletAddress = createAsyncThunk(
  "walletAddress/deleteWalletAddress",
  async ({id, userData}, thunkAPI) => {
    try {
      return await walletAddressService.deleteWalletAddress(id, userData);
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



const walletAddressSlice = createSlice({
  name: "walletAddress",
  initialState,
  reducers: {
    RESET_WALLETADDRESS(state) {
      state.walletAddress = null;
      state.allWalletAddress = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDWALLETADDRESS: (state, action) => {
      state.walletAddress = action.payload; // Set the clicked deposit
    },
    RESET_SETWALLETADDRESS(state) {
      state.walletAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //addWalletAddress
      .addCase(addWalletAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addWalletAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allWalletAddress = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addWalletAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllWalletAddress
      .addCase(getAllWalletAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllWalletAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allWalletAddress = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllWalletAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

        //updateWalletAddress
        .addCase(updateWalletAddress.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateWalletAddress.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allWalletAddress = action.payload;
          // console.log(action.payload);
          toast.success("Wallet Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateWalletAddress.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })


         //updateWalletAddresIcon
       .addCase(updateWalletAddresIcon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWalletAddresIcon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allWalletAddress = action.payload;
        // console.log(action.payload);
        toast.success("Wallet Address icon Changed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateWalletAddresIcon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


         //updateWalletAddresQrcode
       .addCase(updateWalletAddresQrcode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWalletAddresQrcode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allWalletAddress = action.payload;
        // console.log(action.payload);
        toast.success("Wallet Address Qrcode Changed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateWalletAddresQrcode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })




        //deleteExpertTrader
        .addCase(deleteWalletAddress.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteWalletAddress.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allWalletAddress = action.payload.data;
          // console.log(action.payload);
          toast.success("Wallet Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteWalletAddress.rejected, (state, action) => {
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

export const {RESET_WALLETADDRESS, SETSELECTEDWALLETADDRESS, RESET_SETWALLETADDRESS } = walletAddressSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default walletAddressSlice.reducer;
