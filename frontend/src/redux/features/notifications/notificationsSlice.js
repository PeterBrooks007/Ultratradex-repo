import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import notificationService from "./notificationsService";

const initialState = {
  isLoading: false,
  isSemiLoading: false,
  selectedNotification: null,
  allNotifications: [],
  allAdminNotifications: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// addNotification
export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (formData, thunkAPI) => {
    try {
      return await notificationService.addNotification(formData);
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

// getUserNotifications
export const getUserNotifications = createAsyncThunk(
  "notifications/getUserNotifications",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getUserNotifications();
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

// adminGetUserNotifications
export const adminGetUserNotifications = createAsyncThunk(
  "notifications/adminGetUserNotifications",
  async (id, thunkAPI) => {
    try {
      return await notificationService.adminGetUserNotifications(id);
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


// getAllAdminNotifications
export const getAllAdminNotifications = createAsyncThunk(
  "notifications/getAllAdminNotifications",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getAllAdminNotifications();
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


// adminUpdateUserNotification
export const adminUpdateUserNotification = createAsyncThunk(
  "notifications/adminUpdateUserNotification",
  async ({id, formData}, thunkAPI) => {
    try {
      return await notificationService.adminUpdateUserNotification(id, formData);
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
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async ({id, formData}, thunkAPI) => {
    try {
      return await notificationService.deleteNotification(id, formData);
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

// adminClearNotification
export const adminClearNotification = createAsyncThunk(
  "notifications/adminClearNotification",
  async ({id, formData}, thunkAPI) => {
    try {
      return await notificationService.adminClearNotification(id, formData);
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

// userClearNotification
export const userClearNotification = createAsyncThunk(
  "notifications/userClearNotification",
  async ({id, formData}, thunkAPI) => {
    try {
      return await notificationService.userClearNotification(id, formData);
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



const notificationSlice = createSlice({
  name: "notifications",
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
    SETSELECTEDNOTIFICATION: (state, action) => {
      state.selectedNotification = action.payload; // Set the clicked mailbox
    },

   

  },
  extraReducers: (builder) => {
    builder

      //addNotification
      .addCase(addNotification.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allNotifications = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addNotification.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getUserNotifications
      .addCase(getUserNotifications.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allNotifications = action.payload;
        // console.log(action.payload);
        // toast.success(action.payload.message, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

    
      //adminGetUserNotifications
      .addCase(adminGetUserNotifications.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminGetUserNotifications.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allNotifications = action.payload.data;
        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminGetUserNotifications.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allNotifications = [];
        toast.error(action.payload);
      })


        //getAllAdminNotifications
        .addCase(getAllAdminNotifications.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(getAllAdminNotifications.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allAdminNotifications = action.payload;
          // console.log(action.payload);
          // toast.success(action.payload.message, {
          //   position: "top-center",
          //   transition: Slide,
          // });
        })
        .addCase(getAllAdminNotifications.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })
  

      
         //adminUpdateUserNotification
         .addCase(adminUpdateUserNotification.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(adminUpdateUserNotification.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allNotifications = action.payload.data;
          // console.log(action.payload);
          toast.success("User Notification Updated Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminUpdateUserNotification.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      
      
         //deleteNotification
         .addCase(deleteNotification.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(deleteNotification.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          state.allNotifications = action.payload.data;
          // console.log(action.payload);
          toast.success("Notification Deleted Successfully", {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(deleteNotification.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      
      
         //adminClearNotification
         .addCase(adminClearNotification.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(adminClearNotification.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          // state.allNotifications = action.payload.data;
          // console.log(action.payload);
          toast.success(action.payload.message, {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(adminClearNotification.rejected, (state, action) => {
          state.isSemiLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload, {
            position: "top-center",
            transition: Slide,
          });
        })
      
      
         //userClearNotification
         .addCase(userClearNotification.pending, (state) => {
          state.isSemiLoading = true;
        })
        .addCase(userClearNotification.fulfilled, (state, action) => {
          state.isSemiLoading = false;
          state.isSuccess = true;
          state.isLoggedIn = true;
          // state.allNotifications = action.payload.data;
          // console.log(action.payload);
          toast.success(action.payload.message, {
            position: "top-center",
            transition: Slide,
          });
        })
        .addCase(userClearNotification.rejected, (state, action) => {
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

export const { RESET_WALLETTRANSACTIONS, SETSELECTEDNOTIFICATION  } = notificationSlice.actions;

export default notificationSlice.reducer;
