import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast, Slide } from "react-toastify";

const initialState = {
  isLoading: false,
  isSemiLoading: false,
  isLoggedIn: false,
  user: null,
  allCoins: localStorage.getItem("allCoins")
    ? JSON.parse(localStorage.getItem("allCoins")).data
    : [],
  singleCoinDetails: null,
  singleCoinPrice: null,
  trendingCoins: [],
  conversionRate: sessionStorage.getItem("conversionRate")
    ? JSON.parse(sessionStorage.getItem("conversionRate")).data
    : null,
  allUsers: [],
  singleUser: null,
  isError: false,
  isSuccess: false,
  message: "",
  verificationEmail: sessionStorage.getItem("verificationEmail")
    ? JSON.parse(sessionStorage.getItem("verificationEmail")).data
    : null,
  kycSetupStatus: "",
  is2FARequired : false
};

//Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
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

//sendOTP User
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (userData, thunkAPI) => {
    try {
      return await authService.sendOTP(userData);
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

//verifyOTP User
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (userData, thunkAPI) => {
    try {
      return await authService.verifyOTP(userData);
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

//kycSetup
export const kycSetup = createAsyncThunk(
  "auth/kycSetup",
  async (userData, thunkAPI) => {
    try {
      return await authService.kycSetup(userData);
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

//idVerificationUpload
export const idVerificationUpload = createAsyncThunk(
  "auth/idVerificationUpload",
  async (userData, thunkAPI) => {
    try {
      return await authService.idVerificationUpload(userData);
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

//Login User
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
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


//Logout User
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//getLoginStatus
export const getLoginStatus = createAsyncThunk(
  "auth/getLoginStatus",
  async (_, thunkAPI) => {
    try {
      return await authService.getLoginStatus();
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

//get User
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    return await authService.getUser();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    // Dispatch the logout action
    thunkAPI.dispatch(logout()); // Trigger logout on error
    return thunkAPI.rejectWithValue(message);
  }
});

//getUserBalanceAfterTrade
export const getUserBalanceAfterTrade = createAsyncThunk(
  "auth/getUserBalanceAfterTrade",
  async (_, thunkAPI) => {
    try {
      return await authService.getUser();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // Dispatch the logout action
      thunkAPI.dispatch(logout()); // Trigger logout on error
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update User
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, thunkAPI) => {
    try {
      return await authService.updateUser(userData);
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


//Update Photo
export const updatePhoto = createAsyncThunk(
  "auth/updatePhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await authService.updatePhoto(id, formData);
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



//updatePinRequired
export const updatePinRequired = createAsyncThunk(
  "auth/updatePinRequired",
  async (userData, thunkAPI) => {
    try {
      return await authService.updatePinRequired(userData);
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

//updateLastAccess
export const updateLastAccess = createAsyncThunk(
  "auth/updateLastAccess",
  async (userData, thunkAPI) => {
    try {
      return await authService.updateLastAccess(userData);
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

//verifyPinRequired
export const verifyPinRequired = createAsyncThunk(
  "auth/verifyPinRequired",
  async (userData, thunkAPI) => {
    try {
      return await authService.verifyPinRequired(userData);
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

//getAllCoins
export const getAllCoins = createAsyncThunk(
  "auth/getAllCoins",
  async (_, thunkAPI) => {
    try {
      return await authService.getAllCoins();
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

//getTrendingCoins
export const getTrendingCoins = createAsyncThunk(
  "auth/getTrendingCoins",
  async (_, thunkAPI) => {
    try {
      return await authService.getTrendingCoins();
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

//changeCurrency
export const changeCurrency = createAsyncThunk(
  "auth/changeCurrency",
  async (userData, thunkAPI) => {
    try {
      return await authService.changeCurrency(userData);
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

//getAllUsers
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, thunkAPI) => {
    try {
      return await authService.getAllUsers();
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

//getSingleUser
export const getSingleUser = createAsyncThunk(
  "auth/getSingleUser",
  async (id, thunkAPI) => {
    try {
      return await authService.getSingleUser(id);
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
//getSingleUserBalanceAfterTrade
export const getSingleUserBalanceAfterTrade = createAsyncThunk(
  "auth/getSingleUserBalanceAfterTrade",
  async (id, thunkAPI) => {
    try {
      return await authService.getSingleUser(id);
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

// adminUpdateUser
export const adminUpdateUser = createAsyncThunk(
  "auth/adminUpdateUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminUpdateUser(id, userData);
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

// adminFundTradeBalance
export const adminFundTradeBalance = createAsyncThunk(
  "auth/adminFundTradeBalance",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminFundTradeBalance(id, userData);
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

// adminDebitTradeBalance
export const adminDebitTradeBalance = createAsyncThunk(
  "auth/adminDebitTradeBalance",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminDebitTradeBalance(id, userData);
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

// adminFundAssetBalance
export const adminFundAssetBalance = createAsyncThunk(
  "auth/adminFundAssetBalance",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminFundAssetBalance(id, userData);
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

// adminDebitAssetBalance
export const adminDebitAssetBalance = createAsyncThunk(
  "auth/adminDebitAssetBalance",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminDebitAssetBalance(id, userData);
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

// adminAddNewAssetWalletToUser
export const adminAddNewAssetWalletToUser = createAsyncThunk(
  "auth/adminAddNewAssetWalletToUser",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.adminAddNewAssetWalletToUser(id, formData);
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

// adminDeleteAssetWalletFromUser
export const adminDeleteAssetWalletFromUser = createAsyncThunk(
  "auth/adminDeleteAssetWalletFromUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminDeleteAssetWalletFromUser(id, userData);
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

// adminSetIsManualAssetMode
export const adminSetIsManualAssetMode = createAsyncThunk(
  "auth/adminSetIsManualAssetMode",
  async (id, thunkAPI) => {
    try {
      return await authService.adminSetIsManualAssetMode(id);
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

// adminManualUpdateAssetBalance
export const adminManualUpdateAssetBalance = createAsyncThunk(
  "auth/adminManualUpdateAssetBalance",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminManualUpdateAssetBalance(id, userData);
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

// adminApproveId
export const adminApproveId = createAsyncThunk(
  "auth/adminApproveId",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminApproveId(id, userData);
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

// adminApproveResidency
export const adminApproveResidency = createAsyncThunk(
  "auth/adminApproveResidency",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminApproveResidency(id, userData);
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

// adminChangeUserCurrency
export const adminChangeUserCurrency = createAsyncThunk(
  "auth/adminChangeUserCurrency",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminChangeUserCurrency(id, userData);
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

// adminVerifyEmail
export const adminVerifyEmail = createAsyncThunk(
  "auth/adminVerifyEmail",
  async (id, thunkAPI) => {
    try {
      return await authService.adminVerifyEmail(id);
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

// adminActivateDemoAccount
export const adminActivateDemoAccount = createAsyncThunk(
  "auth/adminActivateDemoAccount",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminActivateDemoAccount(id, userData);
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

// adminSetUserAutoTrade
export const adminSetUserAutoTrade = createAsyncThunk(
  "auth/adminSetUserAutoTrade",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminSetUserAutoTrade(id, userData);
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

// adminSetUserWithdrawalLock
export const adminSetUserWithdrawalLock = createAsyncThunk(
  "auth/adminSetUserWithdrawalLock",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminSetUserWithdrawalLock(id, userData);
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

//updateCustomizeEmailLogo
export const updateCustomizeEmailLogo = createAsyncThunk(
  "auth/updateCustomizeEmailLogo",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.updateCustomizeEmailLogo(id, formData);
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

//adminSendCustomizedMail
export const adminSendCustomizedMail = createAsyncThunk(
  "auth/adminSendCustomizedMail",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.adminSendCustomizedMail(id, formData);
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

//adminAddGiftReward
export const adminAddGiftReward = createAsyncThunk(
  "auth/adminAddGiftReward",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.adminAddGiftReward(id, formData);
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

//adminDeleteGiftReward
export const adminDeleteGiftReward = createAsyncThunk(
  "auth/adminDeleteGiftReward",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.adminDeleteGiftReward(id, formData);
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

//UserClaimReward
export const UserClaimReward = createAsyncThunk(
  "auth/UserClaimReward",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.UserClaimReward(id, formData);
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

//adminLockAccount
export const adminLockAccount = createAsyncThunk(
  "auth/adminLockAccount",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await authService.adminLockAccount(id, formData);
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

//changePassword
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.changePassword(userData);
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


//twofaAuthentication
export const twofaAuthentication = createAsyncThunk(
  "auth/twofaAuthentication",
  async (userData, thunkAPI) => {
    try {
      return await authService.twofaAuthentication(userData);
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

// adminDeleteUser
export const adminDeleteUser = createAsyncThunk(
  "auth/adminDeleteUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await authService.adminDeleteUser(id, userData);
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

//contactUs
export const contactUs = createAsyncThunk(
  "auth/contactUs",
  async (userData, thunkAPI) => {
    try {
      return await authService.contactUs(userData);
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


//changePin
export const changePin = createAsyncThunk(
  "auth/changePin",
  async (userData, thunkAPI) => {
    try {
      return await authService.changePin(userData);
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

//requestCard
export const requestCard = createAsyncThunk(
  "auth/requestCard",
  async (userData, thunkAPI) => {
    try {
      return await authService.requestCard(userData);
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

//forgotPassword
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.forgotPassword(userData);
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

//resetPassword
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPassword(userData);
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


//residencyVerification
export const residencyVerification = createAsyncThunk(
  "auth/residencyVerification",
  async ({id, formData}, thunkAPI) => {
    try {
      return await authService.residencyVerification(id, formData);
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET_AUTH(state) {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDCOIN: (state, action) => {
      state.singleCoinDetails = action.payload; // Set the clicked coin
    },
    RESETSETSELECTEDUSER: (state) => {
      state.singleUser = null;
    },
    SETALLUSERS: (state, action) => {
      state.allUsers = action.payload;
      // console.log("new allUsers set", state.allUsers);
    },
    SETSINGLEUSERS: (state, action) => {
      state.singleUser = action.payload;
      // console.log("new allUsers set", state.allUsers);
    },
  },
  extraReducers: (builder) => {
    builder
      //Register User
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.verificationEmail = action.payload.data;

        sessionStorage.setItem(
          "verificationEmail",
          JSON.stringify({
            data: action.payload.data,
            savedAt: new Date().toISOString(), // Adding the current date in ISO format
          })
        );

        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
        // console.log(action.payload)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        toast.error(action.payload);
      })

      //sendOTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        // state.verificationEmail = action.payload.data;

        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
        // console.log(action.payload)
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //verifyOTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        toast.success("Verification Successful", {
          position: "top-center",
          transition: Slide,
        });
        // console.log(action.payload)
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //kycSetup
      .addCase(kycSetup.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(kycSetup.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.kycSetupStatus = "KYCSETUP_OK";
        toast.success("Kyc updated sucessfully", {
          position: "top-center",
          transition: Slide,
        });
        // console.log(action.payload)
      })
      .addCase(kycSetup.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.kycSetupStatus = "KYCSETUP_NOTOKAY";
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //idVerificationUpload
      .addCase(idVerificationUpload.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(idVerificationUpload.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.isLoggedIn = true;
        state.user = action.payload.data;
        state.kycSetupStatus = "KYCIDVERIFICATIONUPLOAD_OK";
        toast.success("Ids uploaded sucessfully and awaiting approval", {
          position: "top-center",
          transition: Slide,
        });
        // console.log(action.payload)
      })
      .addCase(idVerificationUpload.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.kycSetupStatus = "KYCIDVERIFICATIONUPLOAD_NOTOKAY";
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
        // console.log(action.payload)
      })

      //Login User
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if (action.payload?.type === "2faAuthentication") {
          state.is2FARequired = true;
          state.verificationEmail = action.payload.data;

          sessionStorage.setItem(
            "verificationEmail",
            JSON.stringify({
              data: action.payload.data,
              savedAt: new Date().toISOString(), // Adding the current date in ISO format
            })
          );
  
          toast.success(action.payload.message, {
            position: "top-center",
            transition: Slide,
          });

        } else {

          state.user = action.payload;
          toast.success("Login Successful", {
            position: "top-center",
            transition: Slide,
          });

        }
      


      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //Logout User
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.user = null;
        state.conversionRate = null;
        // Remove from sessionStorage when logging out
        sessionStorage.removeItem("conversionRate");

        // toast.success(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.success(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //getLoginStatus
      .addCase(getLoginStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLoginStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = action.payload;
        if (action.payload.message === "invalid signature") {
          state.isLoggedIn = false;
        }
      })
      .addCase(getLoginStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //getUserBalanceAfterTrade
      .addCase(getUserBalanceAfterTrade.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserBalanceAfterTrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
      })
      .addCase(getUserBalanceAfterTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
        toast.success("User Updated", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //update Photo
      .addCase(updatePhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
        toast.success("User Photo Updated", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


      //updatePinRequired
      .addCase(updatePinRequired.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePinRequired.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
        toast.info(
          "You left the app idle for some time, Please re-enter your Pin.",
          {
            position: "top-center",
            transition: Slide,
            autoClose: false,
            closeOnClick: true, // Allows manual closing when clicked
          }
        );
      })
      .addCase(updatePinRequired.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //updateLastAccess
      .addCase(updateLastAccess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateLastAccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
        toast.success("LastAccess updated", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateLastAccess.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //verifyPinRequired
      .addCase(verifyPinRequired.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPinRequired.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        // console.log(action.payload);
        toast.success(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(verifyPinRequired.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //getAllCoins
      .addCase(getAllCoins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCoins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allCoins = action.payload;

        // Only save to localStorage if data is returned and is not empty
        if (action.payload && action.payload.length > 0) {
          localStorage.setItem(
            "allCoins",
            JSON.stringify({
              data: action.payload, // The original data (coins data)
              savedAt: new Date().toISOString(), // Adding the current date in ISO format
            })
          );
        }
        // console.log(action.payload);
      })
      .addCase(getAllCoins.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //getTrendingCoins
      .addCase(getTrendingCoins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrendingCoins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.trendingCoins = action.payload;
        // console.log(action.payload);
      })
      .addCase(getTrendingCoins.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //changeCurrency
      .addCase(changeCurrency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.conversionRate = action.payload;

        // Only save to localStorage if data is returned and is not empty
        if (
          action.payload &&
          typeof action.payload.rate === "number" &&
          typeof action.payload.code === "string" &&
          typeof action.payload.flag === "string"
        ) {
          sessionStorage.setItem(
            "conversionRate",
            JSON.stringify({
              data: action.payload, // The original data (coins data)
              savedAt: new Date().toISOString(), // Adding the current date in ISO format
            })
          );
        }
        // console.log(action.payload);
        toast.success("Conversion Successful.", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(changeCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allUsers = action.payload;
        // console.log(action.payload);
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //getSingleUser
      .addCase(getSingleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //getSingleUserBalanceAfterTrade
      .addCase(getSingleUserBalanceAfterTrade.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getSingleUserBalanceAfterTrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
      })
      .addCase(getSingleUserBalanceAfterTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //adminUpdateUser
      .addCase(adminUpdateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("User Updated Successlly", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminUpdateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminFundTradeBalance
      .addCase(adminFundTradeBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFundTradeBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("User funded Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminFundTradeBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminDebitTradeBalance
      .addCase(adminDebitTradeBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDebitTradeBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("User Debited Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminDebitTradeBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminFundAssetBalance
      .addCase(adminFundAssetBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFundAssetBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("Asset Funded Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminFundAssetBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminDebitAssetBalance
      .addCase(adminDebitAssetBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDebitAssetBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("Asset Debited Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminDebitAssetBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminAddNewAssetWalletToUser
      .addCase(adminAddNewAssetWalletToUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminAddNewAssetWalletToUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success("Asset added Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminAddNewAssetWalletToUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminDeleteAssetWalletFromUser
      .addCase(adminDeleteAssetWalletFromUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDeleteAssetWalletFromUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success("Asset Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminDeleteAssetWalletFromUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminSetIsManualAssetMode
      .addCase(adminSetIsManualAssetMode.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminSetIsManualAssetMode.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminSetIsManualAssetMode.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminManualUpdateAssetBalance
      .addCase(adminManualUpdateAssetBalance.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminManualUpdateAssetBalance.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("Asset Updated Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminManualUpdateAssetBalance.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminApproveId
      .addCase(adminApproveId.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminApproveId.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminApproveId.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminApproveResidency
      .addCase(adminApproveResidency.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminApproveResidency.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminApproveResidency.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminVerifyEmail
      .addCase(adminVerifyEmail.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminVerifyEmail.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminVerifyEmail.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminChangeUserCurrency
      .addCase(adminChangeUserCurrency.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminChangeUserCurrency.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success("User Currency Changed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminChangeUserCurrency.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminActivateDemoAccount
      .addCase(adminActivateDemoAccount.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminActivateDemoAccount.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success("User Demo Account updated successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminActivateDemoAccount.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminSetUserAutoTrade
      .addCase(adminSetUserAutoTrade.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminSetUserAutoTrade.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(
          "User Auto Trade Settings has been updated successfully",
          {
            position: "top-center",
            transition: Slide,
          }
        );
      })
      .addCase(adminSetUserAutoTrade.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminSetUserWithdrawalLock
      .addCase(adminSetUserWithdrawalLock.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminSetUserWithdrawalLock.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(
          "User Withdrawal Lock Settings has been updated successfully",
          {
            position: "top-center",
            transition: Slide,
          }
        );
      })
      .addCase(adminSetUserWithdrawalLock.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //updateCustomizeEmailLogo
      .addCase(updateCustomizeEmailLogo.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(updateCustomizeEmailLogo.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success("Customized Email logo Changed successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateCustomizeEmailLogo.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminSendCustomizedMail
      .addCase(adminSendCustomizedMail.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminSendCustomizedMail.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        // state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminSendCustomizedMail.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminAddGiftReward
      .addCase(adminAddGiftReward.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminAddGiftReward.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminAddGiftReward.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminDeleteGiftReward
      .addCase(adminDeleteGiftReward.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminDeleteGiftReward.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminDeleteGiftReward.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //UserClaimReward
      .addCase(UserClaimReward.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(UserClaimReward.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(UserClaimReward.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminLockAccount
      .addCase(adminLockAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLockAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.singleUser = action.payload;
        // console.log(action.payload);
        toast.success("Lock/Unlock has been updated", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminLockAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //changePassword
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        // state.user = action.payload;
        // console.log(action.payload);
        toast.success(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

    

      //twofaAuthentication
      .addCase(twofaAuthentication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(twofaAuthentication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload.data;
        // console.log(action.payload);

        let TwoFactorEnabled;
        if (action.payload.isTwoFactorEnabled === true) {
          TwoFactorEnabled = "ON";
        } else {
          TwoFactorEnabled = "OFF";
        }

        toast.success(
          "Two factor authentication has be switched " + TwoFactorEnabled,
          {
            position: "top-center",
            transition: Slide,
          }
        );
      })
      .addCase(twofaAuthentication.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminDeleteUser
      .addCase(adminDeleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allUsers = action.payload.data;
        // console.log(action.payload);
        toast.success("User Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

       //contactUs
       .addCase(contactUs.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(contactUs.fulfilled, (state,) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        // console.log(action.payload);
        toast.success("Message sent successfully, we will get back to you shortly.", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(contactUs.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      
        //changePin
        .addCase(changePin.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(changePin.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          // state.user = action.payload;
          // console.log(action.payload);
          toast.success(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(changePin.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

         //requestCard
       .addCase(requestCard.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(requestCard.fulfilled, (state,) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        // console.log(action.payload);
        toast.success("Message sent successfully, we will get back to you shortly.", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(requestCard.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


      //forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.isLoggedIn = true;
        // state.user = action.payload;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.isLoggedIn = true;
        // state.user = action.payload;
        // console.log(action.payload);
        toast.success(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      
      //residencyVerification
      .addCase(residencyVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(residencyVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        // state.user = action.payload;
        // console.log(action.payload);
        toast.success("Request sent successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(residencyVerification.rejected, (state, action) => {
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

export const {
  RESET_AUTH,
  SETSELECTEDCOIN,
  RESETSETSELECTEDUSER,
  SETALLUSERS,
  SETSINGLEUSERS,
} = authSlice.actions;

export default authSlice.reducer;
