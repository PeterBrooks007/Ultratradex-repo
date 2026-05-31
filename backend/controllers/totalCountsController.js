const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");
const Deposit = require("../models/depositModel");
const Mailbox = require("../models/mailboxModel");
const Notifications = require("../models/notificationsModel");

// getAllAdminTotalCounts
const getAllAdminTotalCounts = asyncHandler(async (req, res) => {
  const searchWord = "Support Team";

  // Execute all counts and the recent users query in parallel
  const [
    pendingWithdrawalCount,
    pendingDepositCount,
    userCount,
    inboxCountResult,
    recentUsers,
    notificationCount,
  ] = await Promise.all([
    Withdrawal.countDocuments({ status: "PENDING" }),
    Deposit.countDocuments({ status: "PENDING" }),
    User.countDocuments({ role: { $ne: "admin" } }),
    Mailbox.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.to": { $regex: searchWord, $options: "i" },
          "messages.isRead": false,
        },
      },
      { $count: "inboxCount" },
    ]),
    User.find()
      .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order (most recent first)
      .limit(4), // Limit to the 4 most recent users
    // Fetch and count notifications matching the criteria
    Notifications.aggregate([
      { $unwind: "$notifications" },
      { $match: { "notifications.to": { $regex: searchWord, $options: "i" } } },
      { $count: "notificationCount" },
    ]).then((result) => (result.length > 0 ? result[0].notificationCount : 0)), // Extract count
  ]);

  // Extract inbox count from the aggregation result
  const inboxCount =
    inboxCountResult.length > 0 ? inboxCountResult[0].inboxCount : 0;

  // Return the counts and recent users in the response
  res.status(200).json({
    pendingWithdrawalCount,
    pendingDepositCount,
    userCount,
    inboxCount,
    notificationCount, // Include the notification count
    recentUsers, // Returning the most recent 4 users
  });
});

// getAllUserTotalCounts
const getAllUserTotalCounts = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the logged-in user's ID
  const searchWord = "Support Team"; // Search for messages and notifications from "Support Team"

  // Execute all counts in parallel
  const [unreadMessageResult, notificationCount] = await Promise.all([
    // Aggregate unread messages for the logged-in user
    Mailbox.aggregate([
      { $unwind: "$messages" }, // Deconstruct the messages array
      {
        $match: {
          userId: userId, // Match the logged-in user's mailboxes
          "messages.from": searchWord, // Messages from "Support Team"
          "messages.isRead": false, // Only unread messages
        },
      },
      { $count: "unreadMessageCount" }, // Count matching messages
    ]),

    // Aggregate notification count for the logged-in user
    Notifications.aggregate([
      { $unwind: "$notifications" }, // Unwind notifications array
      {
        $match: {
          "notifications.from": { $regex: searchWord, $options: "i" }, // Match notifications to "Support Team"
          userId: userId, // Filter by userId
        },
      },
      { $count: "notificationCount" }, // Count matching notifications
    ]).then((result) => (result.length > 0 ? result[0].notificationCount : 0)), // Extract count
  ]);

  // Extract the unread message count from the aggregation result
  const unreadMessageCount =
    unreadMessageResult.length > 0
      ? unreadMessageResult[0].unreadMessageCount
      : 0;

  // Return the counts in the response
  res.status(200).json({
    unreadMessageCount, // Include unread messages from "Support Team"
    notificationCount, // Include the notification count
  });
});

module.exports = {
  getAllAdminTotalCounts,
  getAllUserTotalCounts,
};
