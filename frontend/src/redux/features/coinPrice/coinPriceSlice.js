import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import coinPriceService from "./coinPriceService";

const initialState = {
  isLoading: false,
  coinPrice: null,
  allCoins: localStorage.getItem("allCoinpaprikaCoinPrices")
  ? JSON.parse(localStorage.getItem("allCoinpaprikaCoinPrices")).data
  : [],
  isError: false,
  isSuccess: false,
  message: "",
};

//getSingleCoinPrice
export const getSingleCoinPrice = createAsyncThunk(
  "auth/getSingleCoinPrice",
  async (userData, thunkAPI) => {
    try {
      return await coinPriceService.getSingleCoinPrice(userData);
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

//getAllCoinpaprikaCoinPrices
export const getAllCoinpaprikaCoinPrices = createAsyncThunk(
  "auth/getAllCoinpaprikaCoinPrices",
  async (_, thunkAPI) => {
    try {
      return await coinPriceService.getAllCoinpaprikaCoinPrices();
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

//adminGetAllCoinpaprikaCoinPrices
export const adminGetAllCoinpaprikaCoinPrices = createAsyncThunk(
  "auth/adminGetAllCoinpaprikaCoinPrices",
  async (id, thunkAPI) => {
    try {
      return await coinPriceService.adminGetAllCoinpaprikaCoinPrices(id);
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

const coinPriceSlice = createSlice({
  name: "coinPrice",
  initialState,
  reducers: {
    SET_COINPRICEISLOADING_TRUE(state) {
      state.isLoading = true;
    },
    SET_COINPRICEISLOADING_FALSE(state) {
      state.isLoading = false;
    },
    SET_COINPRICE_NULL(state) {
      state.coinPrice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //getSingleCoinPrice
      .addCase(getSingleCoinPrice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleCoinPrice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.coinPrice = action.payload;
        // console.log(action.payload);
      })
      .addCase(getSingleCoinPrice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.coinPrice = null;

        // console.log(action.payload);
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //getAllCoinpaprikaCoinPrices
      .addCase(getAllCoinpaprikaCoinPrices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCoinpaprikaCoinPrices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allCoins = action.payload;

         // Only save to localStorage if data is returned and is not empty
         if (action.payload && action.payload.length > 0) {
          localStorage.setItem(
            "allCoinpaprikaCoinPrices",
            JSON.stringify({
              data: action.payload, // The original data (coins data)
              savedAt: new Date().toISOString(), // Adding the current date in ISO format
            })
          );
        }

        // console.log(action.payload);
      })
      .addCase(getAllCoinpaprikaCoinPrices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allCoins = [];

        localStorage.setItem(
          "allCoinpaprikaCoinPrices",
          JSON.stringify({
            data: [], // Default empty state
            savedAt: new Date(new Date().getTime() - 30 * 60 * 1000).toISOString(), // Backdated by 30 minutes
          })
        );

        
        // console.log(action.payload);
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })

      //adminGetAllCoinpaprikaCoinPrices
      .addCase(adminGetAllCoinpaprikaCoinPrices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetAllCoinpaprikaCoinPrices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allCoins = action.payload;

         // Only save to localStorage if data is returned and is not empty
         if (action.payload && action.payload.length > 0) {
          localStorage.setItem(
            "allCoinpaprikaCoinPrices",
            JSON.stringify({
              data: action.payload, // The original data (coins data)
              savedAt: new Date().toISOString(), // Adding the current date in ISO format
            })
          );
        }

        // console.log(action.payload);
      })
      .addCase(adminGetAllCoinpaprikaCoinPrices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allCoins = [];

        localStorage.setItem(
          "allCoinpaprikaCoinPrices",
          JSON.stringify({
            data: [], // Default empty state
            savedAt: new Date().toISOString(), // Timestamp indicating when this was saved
          })
        );

        // console.log(action.payload);
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      });
  },
});

export const { SET_COINPRICEISLOADING_TRUE, SET_COINPRICEISLOADING_FALSE, SET_COINPRICE_NULL } =
  coinPriceSlice.actions;

export const selectIsLoading = (state) => state.coinPrice.isLoading;

export default coinPriceSlice.reducer;
