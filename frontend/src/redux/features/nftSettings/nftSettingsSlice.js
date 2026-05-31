import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import nftSettingsService from "./nftSettingsService";

const initialState = {
  isLoading: false,
  singleNft: null,
  allNfts: [],
  myNfts: [],
  isError: false,
  isSuccess: false,
  message: "",
};

//addNft
export const addNft = createAsyncThunk(
  "nftSettings/addNft",
  async (userData, thunkAPI) => {
    try {
      return await nftSettingsService.addNft(userData);
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

// getAllNfts
export const getAllNfts = createAsyncThunk(
  "nftSettings/getAllNfts",
  async (_, thunkAPI) => {
    try {
      return await nftSettingsService.getAllNfts();
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

// updateNft
export const updateNft = createAsyncThunk(
  "nftSettings/updateNft",
  async ({id, userData}, thunkAPI) => {
    try {
      return await nftSettingsService.updateNft(id, userData);
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

// updateNftPhoto
export const updateNftPhoto = createAsyncThunk(
  "nftSettings/updateNftPhoto",
  async ({id, formData}, thunkAPI) => {
    try {
      return await nftSettingsService.updateNftPhoto(id, formData);
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

// deleteNft
export const deleteNft = createAsyncThunk(
  "nftSettings/deleteNft",
  async ({id, userData}, thunkAPI) => {
    try {
      return await nftSettingsService.deleteNft(id, userData);
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




// //myExpertTrader
// export const myExpertTrader = createAsyncThunk(
//   "nftSettings/myExpertTrader",
//   async (expertTraderID, thunkAPI) => {
//     try {
//       return await nftSettingsService.myExpertTrader(expertTraderID);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );




// getMyNfts
export const getMyNfts = createAsyncThunk(
  "nftSettings/getMyNfts",
  async (_, thunkAPI) => {
    try {
      return await nftSettingsService.getMyNfts();
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

// // removeMyExpertTrader
// export const removeMyExpertTrader = createAsyncThunk(
//   "nftSettings/removeMyExpertTrader",
//   async (id, thunkAPI) => {
//     try {
//       return await nftSettingsService.removeMyExpertTrader(id);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );


//adminAddNftToUser
export const adminAddNftToUser = createAsyncThunk(
  "nftSettings/adminAddNftToUser",
  async (formData, thunkAPI) => {
    try {
      return await nftSettingsService.adminAddNftToUser(formData);
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

// admingetUserNfts
export const admingetUserNfts = createAsyncThunk(
  "nftSettings/admingetUserNfts",
  async (email, thunkAPI) => {
    try {
      return await nftSettingsService.admingetUserNfts(email);
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




// adminRemoveUserNft
export const adminRemoveUserNft = createAsyncThunk(
  "nftSettings/adminRemoveUserNft",
  async ({id, formData}, thunkAPI) => {
    try {
      return await nftSettingsService.adminRemoveUserNft(id, formData);
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

// userReSellNft
export const userReSellNft = createAsyncThunk(
  "nftSettings/userReSellNft",
  async ({id, formData}, thunkAPI) => {
    try {
      return await nftSettingsService.userReSellNft(id, formData);
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

const nftSettingsSlice = createSlice({
  name: "nftSettings",
  initialState,
  reducers: {
    RESET_EXPERTTRADERS(state) {
      state.expertTrader = null;
      state.nftSettings = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDNFT: (state, action) => {
      state.singleNft = action.payload; // Set the clicked deposit
    },
    RESET_SETEXPERTTRADER(state) {
      state.expertTrader = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //addNft
      .addCase(addNft.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allNfts = action.payload.data;
        // console.log(action.payload)
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addNft.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllNfts
      .addCase(getAllNfts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNfts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allNfts = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllNfts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

        //updateNft
        .addCase(updateNft.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateNft.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allNfts = action.payload;
          // console.log(action.payload);
          toast.success("Nft Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(updateNft.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

        //deleteNft
        .addCase(deleteNft.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteNft.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allNfts = action.payload.data;
          // console.log(action.payload);
          toast.success("Nft Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteNft.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })

      //   //myExpertTrader
      //   .addCase(myExpertTrader.pending, (state) => {
      //     state.isLoading = true;
      //   })
      //   .addCase(myExpertTrader.fulfilled, (state, action) => {
      //     state.isLoading = false;
      //     state.isSuccess = true;
      //     state.isLoggedIn = true;
      //     state.myExpertTraders = action.payload.data;
      //     // console.log(action.payload);
      //     toast.success("Trader added to your list", {
      //       position: "top-center",
      //       transition: Slide,
      //     });
      //   })
      //   .addCase(myExpertTrader.rejected, (state, action) => {
      //     state.isLoading = false;
      //     state.isError = true;
      //     state.message = action.payload;
      //     toast.error(action.payload, {
      //       position: "top-center",
      //       transition: Slide,
      //     });
      //   })


        //getMyNfts
      .addCase(getMyNfts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyNfts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.myNfts = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getMyNfts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      

      //  //removeMyExpertTrader
      //  .addCase(removeMyExpertTrader.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(removeMyExpertTrader.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.isLoggedIn = true;
      //   state.myExpertTraders = action.payload.data;
      //   // console.log(action.payload);
      //   toast.success("Trader Deleted Successfully", {
      //     position: "top-center",
      //     transition: Slide,
      //   });
      // })
      // .addCase(removeMyExpertTrader.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload;
      //   toast.error(action.payload, {
      //     position: "top-center",
      //     transition: Slide,
      //   });
      // })

      
       //updateNftPhoto
       .addCase(updateNftPhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNftPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allNfts = action.payload;
        // console.log(action.payload);
        toast.success("Nft Photo Changed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(updateNftPhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


        //admingetUserNfts
        .addCase(admingetUserNfts.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(admingetUserNfts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.myNfts = action.payload;
          // toast.success(action.payload,  {
          //     position: "top-center",
          //     transition: Slide,
          //   });
          // console.log(action.payload);
        })
        .addCase(admingetUserNfts.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })



       //adminRemoveUserNft
       .addCase(adminRemoveUserNft.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminRemoveUserNft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.myNfts = action.payload.data;
        // console.log(action.payload);
        toast.success("Nft Removed Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminRemoveUserNft.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

       //userReSellNft
       .addCase(userReSellNft.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userReSellNft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.myNfts = action.payload.data;
        // console.log(action.payload);
        toast.success("Message Sent Successfully, you will be notify shortly", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(userReSellNft.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      
        //adminAddNftToUser
        .addCase(adminAddNftToUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(adminAddNftToUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.myNfts = action.payload.data;
          // console.log(action.payload);
          toast.success("Nft added to this user list", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminAddNftToUser.rejected, (state, action) => {
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

export const {RESET_EXPERTTRADERS, SETSELECTEDNFT, RESET_SETEXPERTTRADER } = nftSettingsSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default nftSettingsSlice.reducer;
