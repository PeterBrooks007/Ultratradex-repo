const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const WalletTransactions = require("../models/walletTransactionsModel");
const Notifications = require("../models/notificationsModel");



//addNotification
const addNotification = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const { userId, notificationData } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Add the Notification to Notifications
  await Notifications.updateOne(
    { userId },
    { $push: { notifications: notificationData } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );

  // Fetch all user transactions with user details populated
  const allUserNotifications = await Notifications.find({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: allUserNotifications,
    message: `Notification added successfully.`,
  });
});



// getUserNotifications
const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allUserNotifications = await Notifications.find({ userId })
    .limit(1)
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");
  res.status(200).json(allUserNotifications);
});



const adminGetUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find all trades for the user, sorted by creation date
  const allUserNotification = await Notifications.find({ userId })
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // If no trades are found, respond accordingly
  if (!allUserNotification || allUserNotification.length === 0) {
    return res.status(404).json({
      message: "No Notification found",
    });
  }

  // Success response
  res.status(200).json({
    data: allUserNotification,
  });
});




//adminUpdateUserNotification
const adminUpdateUserNotification = asyncHandler(async (req, res) => {
  const { userId, notificationData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const result = await Notifications.updateOne(
    { userId, "notifications._id": notificationData.notificationId }, // Match the user and the specific trade
    {
      $set: {
        "notifications.$": notificationData, // Update the specific transaction using the `$` positional operator
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Notification not found" });
  }

  const updatedNotifications = await Notifications.find({ userId })
    .populate("userId", "_id firstname lastname email photo");

  res.status(200).json({
    data: updatedNotifications,
    message: "Notification updated successfully",
  });
});





//deleteNotification
const deleteNotification = asyncHandler(async (req, res) => {
  const { userId, notificationData } = req.body;

    // console.log(req.body)

  const result = await Notifications.updateOne(
    { userId }, // Match the user
    {
      $pull: {
        notifications: { _id: notificationData.notificationId  }, // Remove the Notification with the specified _id
      },
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Notification not found" });
  }

  const updatedNotifications = await Notifications.find({ userId })
    .populate("userId", "_id firstname lastname email photo");

  res.status(200).json({
    data: updatedNotifications,
    message: "Notification deleted successfully",
  });
});


//getAllAdminNotifications
const getAllAdminNotifications = asyncHandler(async (req, res) => {
  const searchWord = "Support Team";

  // Fetch notifications with the userId field populated
  const allNotifications = await Notifications.find()
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // Flatten the notifications into a single array and include userId
  const allNotificationsFlat = allNotifications.flatMap((doc) => {
    return doc.notifications
      .filter((notification) => notification.to.match(new RegExp(searchWord, "i")))
      .map((notification) => ({
        ...notification.toObject(), // Convert Mongoose subdocument to plain object
        userId: doc.userId, // Add the populated userId from the parent document
      }));
  });

  // Sort the flattened notifications by createdAt
  const sortedNotification = allNotificationsFlat.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.status(200).json(sortedNotification);
});




const adminClearNotification = asyncHandler(async (req, res) => {
  const searchWord = "Support Team";

  try {
    // Use updateMany with $pull to remove notifications where "to" matches the searchWord
    const result = await Notifications.updateMany(
      { "notifications.to": { $regex: new RegExp(searchWord, "i") } },
      {
        $pull: {
          notifications: { to: { $regex: new RegExp(searchWord, "i") } },
        },
      }
    );

    // Return the result of the operation
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} users' notifications cleared for '${searchWord}'.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear admin notifications.",
      error: error.message,
    });
  }
});





//userClearNotification
const userClearNotification = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Extract the userId from the request body
  const searchWord = "Support Team"; // The search word to match

  if (!userId) {
    return res.status(400).json({ message: "UserId is required." });
  }

  try {
    // Remove all notifications where 'to' does not match the search word
    const result = await Notifications.updateOne(
      { userId }, // Match the specific user
      {
        $pull: {
          notifications: { to: { $not: { $regex: new RegExp(searchWord, "i") } } }, // Remove notifications where 'to' does not match the search word
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No notifications to clear." });
    }

    // Fetch the updated notifications for the user
    const updatedNotifications = await Notifications.findOne({ userId })
      .populate("userId", "_id firstname lastname email photo");

    res.status(200).json({
      data: updatedNotifications,
      message: "Notifications cleared successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear notifications.",
      error: error.message,
    });
  }
});









module.exports = {
  addNotification,
  getUserNotifications,
  adminGetUserNotifications,
  adminUpdateUserNotification,
  deleteNotification,
  getAllAdminNotifications,
  adminClearNotification,
  userClearNotification

};
