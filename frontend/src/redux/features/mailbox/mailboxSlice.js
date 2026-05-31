import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, Slide } from "react-toastify";
import mailboxService from "./mailboxService";

const initialState = {
  isLoading: false,
  isSemiLoading: false,
  selectedMail: null,
  allMails: [],
  allMailInbox: [],
  allMailSent: [],
  allMailStarred: [],
  allUsers: [],
  isError: false,
  isSuccess: false,
  message: "",
};

// addmail
export const addmail = createAsyncThunk(
  "mailbox/addmail",
  async (formData, thunkAPI) => {
    try {
      return await mailboxService.addmail(formData);
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

// getAllMail
export const getAllMail = createAsyncThunk(
  "mailbox/getAllMail",
  async (_, thunkAPI) => {
    try {
      return await mailboxService.getAllMail();
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

// getAllMailInbox
export const getAllMailInbox = createAsyncThunk(
  "mailbox/getAllMailInbox",
  async (_, thunkAPI) => {
    try {
      return await mailboxService.getAllMailInbox();
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

// getAllMailSent
export const getAllMailSent = createAsyncThunk(
  "mailbox/getAllMailSent",
  async (_, thunkAPI) => {
    try {
      return await mailboxService.getAllMailSent();
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

// getAllMailIsStarred
export const getAllMailIsStarred = createAsyncThunk(
  "mailbox/getAllMailIsStarred",
  async (_, thunkAPI) => {
    try {
      return await mailboxService.getAllMailIsStarred();
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

// getUserMail
export const getUserMail = createAsyncThunk(
  "mailbox/getUserMail",
  async (_, thunkAPI) => {
    try {
      return await mailboxService.getUserMail();
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
  "mailbox/getAllUsers",
  async (_, thunkAPI) => {
    try {
      return await mailboxService.getAllUsers();
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



// adminDeleteMail
export const adminDeleteMail = createAsyncThunk(
  "mailbox/adminDeleteMail",
  async (messageData, thunkAPI) => {
    try {
      return await mailboxService.adminDeleteMail(messageData);
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


// adminMarkMailAsRead
export const adminMarkMailAsRead = createAsyncThunk(
  "mailbox/adminMarkMailAsRead",
  async (messageData, thunkAPI) => {
    try {
      return await mailboxService.adminMarkMailAsRead(messageData);
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

// adminMarkMailAsReadOnView
export const adminMarkMailAsReadOnView = createAsyncThunk(
  "mailbox/adminMarkMailAsReadOnView",
  async (messageData, thunkAPI) => {
    try {
      return await mailboxService.adminMarkMailAsRead(messageData);
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

// adminStarredMail
export const adminStarredMail = createAsyncThunk(
  "mailbox/adminStarredMail",
  async (messageData, thunkAPI) => {
    try {
      return await mailboxService.adminStarredMail(messageData);
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



// userDeleteMail
export const userDeleteMail = createAsyncThunk(
  "mailbox/userDeleteMail",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await mailboxService.userDeleteMail(id, userData);
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

const mailboxSlice = createSlice({
  name: "mailbox",
  initialState,
  reducers: {
    // RESET_WITHDRAWAL_MESSAGE(state) {
    //   state.message = "";
    // },
    RESET_MAILBOX(state) {
      state.mail = null;
      state.allMails = [];
      state.allMailInbox = [];
      state.allMailSent = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SETSELECTEDMAIL: (state, action) => {
      state.selectedMail = action.payload; // Set the clicked mailbox
    },

    SETSTARREDMAILQUICKFEEDBACK: (state, action) => {
      // console.log("message id", action.payload);
      state.allMails = state.allMails.map(mail => ({
        ...mail,
        messages: mail.messages.map(message =>
          message._id === action.payload
            ? { ...message, isUserStarred: !message.isUserStarred }
            : message
        )
      }));
    },

    SETSTARREDMAILQUICKFEEDBACKVIEWMESSAGE: (state) => {
      
      if (state.selectedMail) {
        // Toggle the isUserStarred property
        state.selectedMail.isUserStarred = !state.selectedMail.isUserStarred;
      }
    },
    SETSTARREDMAILQUICKFEEDBACKVIEWMESSAGEADMIN: (state) => {

      if (state.selectedMail) {
        // Toggle the isUserStarred property
        state.selectedMail.isStarred = !state.selectedMail.isStarred;
      }
    },

  },
  extraReducers: (builder) => {
    builder

      //addmail
      .addCase(addmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if (action.payload.from === "support") {
          state.allMailSent = action.payload.data;
        }
        if (action.payload.from === "user") {
          state.allMails = action.payload.data;
        }
        window.location.hash = "#sent";

        // console.log(action.payload);
        toast.success(action.payload.message, {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(addmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllMail
      .addCase(getAllMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allMails = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllMail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllMailInbox
      .addCase(getAllMailInbox.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMailInbox.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allMailInbox = action.payload;
        // console.log(action.payload);

        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllMailInbox.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllMailSent
      .addCase(getAllMailSent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMailSent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allMailSent = action.payload;
        // console.log(action.payload);
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllMailSent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })


      //getAllMailIsStarred
      .addCase(getAllMailIsStarred.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMailIsStarred.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allMailStarred = action.payload;
        // console.log(action.payload);
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getAllMailIsStarred.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getUserMail
      .addCase(getUserMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserMail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allMails = action.payload;
        // toast.success(action.payload,  {
        //     position: "top-center",
        //     transition: Slide,
        //   });
        // console.log(action.payload);
      })
      .addCase(getUserMail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allUsers = action.payload;
        // console.log(action.payload);
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })



      //adminDeleteMail
      .addCase(adminDeleteMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDeleteMail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if(action.payload.from === "sentComponent" ) {
          state.allMailSent = action.payload.data;
        }
        if(action.payload.from === "inboxComponent" ) {
          state.allMailInbox = action.payload.data;
        }
        if(action.payload.from === "userInboxComponent" ) {
          state.allMails = action.payload.data;
        }

        // console.log(action.payload);
        toast.success("Message Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminDeleteMail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })


      //adminMarkMailAsRead
      .addCase(adminMarkMailAsRead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminMarkMailAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if(action.payload.from === "sentComponent" ) {
          state.allMailSent = action.payload.data;
        }
        if(action.payload.from === "inboxComponent" ) {
          state.allMailInbox = action.payload.data;
        }
        if(action.payload.from === "userInboxComponent" ) {
          state.allMails = action.payload.data;
        }

        // console.log(action.payload);
        toast.success("Message(s) Mark as read", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(adminMarkMailAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })

      //adminMarkMailAsReadOnView
      .addCase(adminMarkMailAsReadOnView.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(adminMarkMailAsReadOnView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if(action.payload.from === "sentComponent" ) {
          state.allMailSent = action.payload.data;
        }
        if(action.payload.from === "inboxComponent" ) {
          state.allMailInbox = action.payload.data;
        }
        if(action.payload.from === "userInboxComponent" ) {
          state.allMails = action.payload.data;
        }

        // console.log(action.payload);
        // toast.success("Message(s) Mark as read", {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })
      .addCase(adminMarkMailAsReadOnView.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // toast.error(action.payload, {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })


      //adminStarredMail
      .addCase(adminStarredMail.pending, (state) => {
        state.isSemiLoading = true;
      })
      .addCase(adminStarredMail.fulfilled, (state, action) => {
        state.isSemiLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if(action.payload.from === "sentComponent" ) {
          state.allMailSent = action.payload.data;
          state.allMailStarred = action.payload.messagesStarred;
        }
        if(action.payload.from === "inboxComponent" ) {
          state.allMailInbox = action.payload.data;
          state.allMailStarred = action.payload.messagesStarred;
        }
        if(action.payload.from === "userInboxComponent" ) {
          state.allMails = action.payload.data;
        }
        if(action.payload.from === "starredComponent" ) {
          state.allMailStarred = action.payload.MessageStarred;
          state.allMailInbox = action.payload.messagesInbox;
          state.allMailSent = action.payload.messagesSent;
        }

        // console.log(action.payload);
        // toast.success("Message(s) Mark as read", {
        //   position: "top-center",
        //   transition: Slide,
        // });
      })
      .addCase(adminStarredMail.rejected, (state, action) => {
        state.isSemiLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      })



      //userDeleteMail
      .addCase(userDeleteMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userDeleteMail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.allMailInbox = action.payload.data;
        // console.log(action.payload);
        toast.success("Mail Deleted Successfully", {
          position: "top-center",
          transition: Slide,
        });
      })
      .addCase(userDeleteMail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload, {
          position: "top-center",
          transition: Slide,
        });
      });
  },
});

export const { RESET_MAILBOX, SETSELECTEDMAIL, SETSTARREDMAILQUICKFEEDBACK, SETSTARREDMAILQUICKFEEDBACKVIEWMESSAGE, SETSTARREDMAILQUICKFEEDBACKVIEWMESSAGEADMIN } = mailboxSlice.actions;

// export const selectTransactions = (state) => state.transaction.transactions;
// export const selectTransactionMessage = (state) => state.transaction.message;
// export const selectReceiverName = (state) => state.transaction.receiverName;

export default mailboxSlice.reducer;
