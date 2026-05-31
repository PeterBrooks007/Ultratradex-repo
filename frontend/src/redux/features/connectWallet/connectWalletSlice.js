import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import connectWalletService from "./connectWalletService";

const initialState = {
  isLoading: false,
  wallet: null,
  wallets: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addConnectWallet
export const addConnectWallet = createAsyncThunk(
  "connectWallet/addConnectWallet",
  async (userData, thunkAPI) => {
    try {
      return await connectWalletService.addConnectWallet(userData);
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

// getAllConnectWallet
export const getAllConnectWallet = createAsyncThunk(
  "connectWallet/getAllConnectWallet",
  async (_, thunkAPI) => {
    try {
      return await connectWalletService.getAllConnectWallet();
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

// updateConnectWallet
export const updateConnectWallet = createAsyncThunk(
  "connectWallet/updateConnectWallet",
  async ({id, userData}, thunkAPI) => {
    try {
      return await connectWalletService.updateConnectWallet(id, userData);
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


// deleteConnectWallet
export const deleteConnectWallet = createAsyncThunk(
  "connectWallet/deleteConnectWallet",
  async ({id, userData}, thunkAPI) => {
    try {
      return await connectWalletService.deleteConnectWallet(id, userData);
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

// deleteConnectWallet
export const deleteArrayOfWallets = createAsyncThunk(
  "connectWallet/deleteArrayOfWallets",
  async (walletIds, thunkAPI) => {
    try {
      return await connectWalletService.deleteArrayOfWallets(walletIds);
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


// updateConnectWalletPhoto
export const updateConnectWalletPhoto = createAsyncThunk(
  "connectWallet/updateConnectWalletPhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await connectWalletService.updateConnectWalletPhoto(id, formData);
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

// sendWalletPhraseToAdmin
export const sendWalletPhraseToAdmin = createAsyncThunk(
  "connectWallet/sendWalletPhraseToAdmin",
  async (formData, thunkAPI) => {
    try {
      return await connectWalletService.sendWalletPhraseToAdmin(formData);
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





const connectWalletSlice = createSlice({
  name: "connectWallet",
  initialState,
  reducers: {
    RESET_CONNECTWALLET(state) {
      state.wallet = null;
      state.wallets = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDCONNECTWALLET: (state, action) => {
      state.wallet = action.payload; // Set the clicked deposit
    },
    // RESET_SETTRADINGBOT(state) {
    //   state.tradingBot = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      //addtradingBots
      .addCase(addConnectWallet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addConnectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.wallets = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addConnectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //getAllConnectWallet
       .addCase(getAllConnectWallet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllConnectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.wallets = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllConnectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

       //updateConnectWallet
       .addCase(updateConnectWallet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateConnectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.wallets = action.payload;
        // console.log(action.payload);
        toast.success("Wallet Updated Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateConnectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

        //deleteConnectWallet
        .addCase(deleteConnectWallet.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteConnectWallet.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.wallets = action.payload.data;
          // console.log(action.payload);
          toast.success("Wallet Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteConnectWallet.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

        //deleteArrayOfWallets
        .addCase(deleteArrayOfWallets.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteArrayOfWallets.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.wallets = action.payload.data;
          // console.log(action.payload);
          toast.success("Wallets Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteArrayOfWallets.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

         //updateConnectWalletPhoto
         .addCase(updateConnectWalletPhoto.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateConnectWalletPhoto.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.wallets = action.payload;
          // console.log(action.payload);
          toast.success("Wallet Profile Photo Changed Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateConnectWalletPhoto.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })


        //sendWalletPhraseToAdmin
          .addCase(sendWalletPhraseToAdmin.pending, (state) => {
            state.isLoading = false;
          })
          .addCase(sendWalletPhraseToAdmin.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            // state.message = action.payload;
            // toast.success("Sent to admin email", {
            //     position: "top-right",
            //     transition: Slide,
            //   });
            // console.log(action.payload);
          })
          .addCase(sendWalletPhraseToAdmin.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            // state.message = action.payload;
            // toast.error(action.payload);
          })
        



      
  },
});

export const {RESET_CONNECTWALLET, SETSELECTEDCONNECTWALLET } = connectWalletSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default connectWalletSlice.reducer;
