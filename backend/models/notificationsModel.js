const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    to: {
      type: String,
      default: "Not Provided",
      required: true,
    },
    from: {
      type: String,
      default: "Not Provided",
      required: true,
    },
    notificationIcon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const notificationssSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notifications: {
      type: [notificationSchema], // Array of notifications
      default: [],
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notificationssSchema);
module.exports = Notifications;
