const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    isUserStarred: {
      type: Boolean,
      default: false,
    },
    folder: {
      type: String,
      default: "Inbox",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // { _id: false } // Prevents each message from having its own unique _id
);

const mailboxSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: {
      type: [messageSchema], // Array of messages
      default: [],
    },
  },
  { timestamps: true }
);

const Mailbox = mongoose.model("Mailbox", mailboxSchema);
module.exports = Mailbox;
