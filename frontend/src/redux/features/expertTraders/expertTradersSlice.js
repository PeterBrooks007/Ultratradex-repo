import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import expertTradersService from "./expertTradersService";

const initialState = {
  isLoading: false,
  expertTrader: null,
  expertTraders: [],
  myExpertTraders: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addExpertTraders
export const addExpertTraders = createAsyncThunk(
  "expertTraders/addExpertTraders",
  async (userData, thunkAPI) => {
    try {
      return await expertTradersService.addExpertTraders(userData);
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

// getAllExpertTraders
export const getAllExpertTraders = createAsyncThunk(
  "expertTraders/getAllExpertTraders",
  async (_, thunkAPI) => {
    try {
      return await expertTradersService.getAllExpertTraders();
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

// updateExpertTrader
export const updateExpertTrader = createAsyncThunk(
  "expertTraders/updateExpertTrader",
  async ({id, userData}, thunkAPI) => {
    try {
      return await expertTradersService.updateExpertTrader(id, userData);
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

// admingetUserExpertTrader
export const admingetUserExpertTrader = createAsyncThunk(
  "expertTraders/admingetUserExpertTrader",
  async (email, thunkAPI) => {
    try {
      return await expertTradersService.admingetUserExpertTrader(email);
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

// deleteExpertTrader
export const deleteExpertTrader = createAsyncThunk(
  "expertTraders/deleteExpertTrader",
  async ({id, userData}, thunkAPI) => {
    try {
      return await expertTradersService.deleteExpertTrader(id, userData);
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


//myExpertTrader
export const myExpertTrader = createAsyncThunk(
  "expertTraders/myExpertTrader",
  async (expertTraderID, thunkAPI) => {
    try {
      return await expertTradersService.myExpertTrader(expertTraderID);
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


//adminAddExpertTraderToUser
export const adminAddExpertTraderToUser = createAsyncThunk(
  "expertTraders/adminAddExpertTraderToUser",
  async (formData, thunkAPI) => {
    try {
      return await expertTradersService.adminAddExpertTraderToUser(formData);
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


// getAllExpertTraders
export const getMyExpertTrader = createAsyncThunk(
  "expertTraders/getMyExpertTrader",
  async (_, thunkAPI) => {
    try {
      return await expertTradersService.getMyExpertTrader();
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

// removeMyExpertTrader
export const removeMyExpertTrader = createAsyncThunk(
  "expertTraders/removeMyExpertTrader",
  async (id, thunkAPI) => {
    try {
      return await expertTradersService.removeMyExpertTrader(id);
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

// updateExpertTraderPhoto
export const updateExpertTraderPhoto = createAsyncThunk(
  "expertTraders/updateExpertTraderPhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await expertTradersService.updateExpertTraderPhoto(id, formData);
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

// adminRemoveUserExpertTraderCopied
export const adminRemoveUserExpertTraderCopied = createAsyncThunk(
  "expertTraders/adminRemoveUserExpertTraderCopied",
  async ({id, formData}, thunkAPI) => {
    try {
      return await expertTradersService.adminRemoveUserExpertTraderCopied(id, formData);
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

const expertTradersSlice = createSlice({
  name: "expertTraders",
  initialState,
  reducers: {
    RESET_EXPERTTRADERS(state) {
      state.expertTrader = null;
      state.expertTraders = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDEXPERTTRADER: (state, action) => {
      state.expertTrader = action.payload; // Set the clicked deposit
    },
    RESET_SETEXPERTTRADER(state) {
      state.expertTrader = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //addExpertTraders
      .addCase(addExpertTraders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addExpertTraders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.expertTraders = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addExpertTraders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllExpertTraders
      .addCase(getAllExpertTraders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllExpertTraders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.expertTraders = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllExpertTraders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

        //updateExpertTrader
        .addCase(updateExpertTrader.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateExpertTrader.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.expertTraders = action.payload;
          // console.log(action.payload);
          toast.success("Trader Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateExpertTrader.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

        //deleteExpertTrader
        .addCase(deleteExpertTrader.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteExpertTrader.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.expertTraders = action.payload.data;
          // console.log(action.payload);
          toast.success("Trader Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteExpertTrader.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

        //myExpertTrader
        .addCase(myExpertTrader.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(myExpertTrader.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.myExpertTraders = action.payload.data;
          // console.log(action.payload);
          toast.success("Trader added to your list", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(myExpertTrader.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })


        //getMyExpertTrader
      .addCase(getMyExpertTrader.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyExpertTrader.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.myExpertTraders = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getMyExpertTrader.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      

       //removeMyExpertTrader
       .addCase(removeMyExpertTrader.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeMyExpertTrader.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.myExpertTraders = action.payload.data;
        // console.log(action.payload);
        toast.success("Trader Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(removeMyExpertTrader.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      
       //updateExpertTraderPhoto
       .addCase(updateExpertTraderPhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateExpertTraderPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.expertTraders = action.payload;
        // console.log(action.payload);
        toast.success("Trader Profile Photo Changed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateExpertTraderPhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


        //admingetUserExpertTrader
        .addCase(admingetUserExpertTrader.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(admingetUserExpertTrader.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.myExpertTraders = action.payload;
          // toast.success(action.payload,  {
          //     position: "top-center",
          //     transition: Slide,
          //   });
          // console.log(action.payload);
        })
        .addCase(admingetUserExpertTrader.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })



       //adminRemoveUserExpertTraderCopied
       .addCase(adminRemoveUserExpertTraderCopied.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminRemoveUserExpertTraderCopied.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.myExpertTraders = action.payload.data;
        // console.log(action.payload);
        toast.success("Trader Removed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminRemoveUserExpertTraderCopied.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      
        //adminAddExpertTraderToUser
        .addCase(adminAddExpertTraderToUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(adminAddExpertTraderToUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.myExpertTraders = action.payload.data;
          // console.log(action.payload);
          toast.success("Trader added to this user list", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminAddExpertTraderToUser.rejected, (state, action) => {
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

export const {RESET_EXPERTTRADERS, SETSELECTEDEXPERTTRADER, RESET_SETEXPERTTRADER } = expertTradersSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default expertTradersSlice.reducer;
