const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");
const axios = require("axios");
const { validationResult } = require("express-validator");
const Mailbox = require("../models/mailboxModel");
const Trades = require("../models/tradesModel");
const { adminGeneralEmailTemplate } = require("../emailTemplates/adminGeneralEmailTemplate");
const sendEmail = require("../utils/sendEmail");
const Notifications = require("../models/notificationsModel");

//addTrade
const addTrade = asyncHandler(async (req, res) => {
  // console.log(req.body)

  const { userId, tradeData } = req.body;

  const tradeDataNow = {
    ...tradeData,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user
  const user = await User.findById(userId);

  if (tradeData.tradingMode === "Live" && tradeData.amount > user?.balance) {
    return res.status(400).json({
      message:
        "Insufficient Trade balance to trade with, fund your account and start up trade immediately",
    });
  }

  if (
    tradeData.tradingMode === "Demo" &&
    tradeData.amount > user?.demoBalance
  ) {
    return res.status(400).json({
      message: "Insufficient Demo balance to trade with",
    });
  }

  const updateTrade = await Trades.updateOne(
    { userId },
    { $push: { trades: tradeDataNow } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );

  if (updateTrade && tradeData.tradingMode === "Live") {
    user.balance -= tradeData.amount;
    await user.save();
  }

  if (updateTrade && tradeData.tradingMode === "Demo") {
    user.demoBalance -= tradeData.amount;
    await user.save();
  }


  if (tradeData.tradeFrom === "user") {

     // Send trade order email to admin
     const introMessage = `This user ${user.firstname+" "+user.lastname} with email address ${user.email} just placed a new trade order`

     const subjectAdmin = "New Trade Order - ultratradex"
     const send_to_Admin = process.env.EMAIL_USER
     const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
     const reply_toAdmin = "no_reply@ultratradex.io"
 
     await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)
 
 
    //send trade order notification message object to admin
    const searchWord = "Support Team";
    const notificationObject = {
     to: searchWord,
     from: `${user.firstname+" "+user.lastname}`,
     notificationIcon: "CurrencyCircleDollar",
     title: "New Trade Order",
     message: `${user.firstname+" "+user.lastname} just placed a new trade order`,
     route: "/dashboard",
   };
 
   // Add the Notifications
   await Notifications.updateOne(
     { userId: user._id },
     { $push: { notifications: notificationObject } },
     { upsert: true } // Creates a new document if recipient doesn't exist
   );

  }

  
  if (tradeData.tradeFrom === "admin") {

 //send new trade order notification message object to user
 const searchWord = "Support Team";
 const notificationObject = {
   to: `${user.firstname+" "+user.lastname}`,
   from: searchWord,
   notificationIcon: "CurrencyCircleDollar",
   title: "New Trade Order",
   message: `A trade order has been placed in your account, Please check trade history`,
   route: "/dashboard"
 };

 // Add the Notifications
 await Notifications.updateOne(
   { userId: user._id },
   { $push: { notifications: notificationObject } },
   { upsert: true } // Creates a new document if recipient doesn't exist
 );


 }


  const allUserTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: allUserTrades,
    message: "Order Placed Successfully",
    from: "user",
  });
});

const adminGetAllUserTrades = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find all trades for the user, sorted by creation date
  const allUserTrades = await Trades.findOne({ userId })
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // If no trades are found, respond accordingly
  if (!allUserTrades || allUserTrades.length === 0) {
    return res.status(404).json({
      message: "No trades found",
    });
  }

  // Success response
  res.status(200).json({
    data: allUserTrades,
  });
});

//adminUpdateUserTrade
const adminUpdateUserTrade = asyncHandler(async (req, res) => {
  const { userId, tradeData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const result = await Trades.updateOne(
    { userId, "trades._id": tradeData.tradeId }, // Match the user and the specific trade
    {
      $set: {
        "trades.$": tradeData, // Update the specific trade using the `$` positional operator
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Trade not found" });
  }

  const updatedTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: updatedTrades,
    message: "Trade updated successfully",
  });
});

//cancelTrade
const cancelTrade = asyncHandler(async (req, res) => {
  const { userId, tradeData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user
  const user = await User.findById(userId);

  const result = await Trades.updateOne(
    { userId, "trades._id": tradeData.tradeId }, // Match the user and the specific trade
    {
      $set: {
        "trades.$.status": "CANCELLED", // Update the `status` field
        "trades.$.isProcessed": true, // Update the `isProcessed` field
        "trades.$.profitOrLossAmount": tradeData.tradeAmount,
        "trades.$.expireTime": "-30",
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Trade not found" });
  }

  if (tradeData.tradingMode === "Live") {
    user.balance = Number(user.balance) + Number(tradeData.tradeAmount);
    await user.save();
  }

  if (tradeData.tradingMode === "Demo") {
    user.demoBalance = Number(user.demoBalance) + Number(tradeData.tradeAmount);
    await user.save();
  }

  const updatedTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: updatedTrades,
    message: "Trade Cancelled successfully",
  });
});

//deleteTrade
const deleteTrade = asyncHandler(async (req, res) => {
  const { userId, tradeData } = req.body;

  // console.log(req.body)

  const result = await Trades.updateOne(
    { userId }, // Match the user
    {
      $pull: {
        trades: { _id: tradeData.tradeId }, // Remove the trade with the specified _id
      },
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Trade not found" });
  }

  const updatedTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: updatedTrades,
    message: "Trade deleted successfully",
  });
});

//adminApproveUserTrade
const adminApproveUserTrade = asyncHandler(async (req, res) => {
  const { userId, tradeData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user
  const user = await User.findById(userId);

  const result = await Trades.updateOne(
    { userId, "trades._id": tradeData.tradeId }, // Match the user and the specific trade
    {
      $set: {
        "trades.$": tradeData, // Update the specific trade using the `$` positional operator
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "Trade not found or already updated, refresh trade history",
    });
  }

  if (tradeData.status === "Won" && tradeData.tradingMode === "Live") {
    user.balance =
      Number(user.balance) +
      Number(tradeData.amount) +
      Number(tradeData.profitOrLossAmount);
    await user.save();
  }

  if (tradeData.status === "Won" && tradeData.tradingMode === "Demo") {
    user.demoBalance =
      Number(user.demoBalance) +
      Number(tradeData.amount) +
      Number(tradeData.profitOrLossAmount);
    await user.save();
  }

  
  if (tradeData.status === "REJECTED" && tradeData.tradingMode === "Live") {
    user.balance =
      Number(user.balance) +
      Number(tradeData.amount)
      // Number(tradeData.profitOrLossAmount);
    await user.save();
  }

  if (tradeData.status === "REJECTED" && tradeData.tradingMode === "Demo") {
    user.demoBalance =
      Number(user.demoBalance) +
      Number(tradeData.amount)
      // Number(tradeData.profitOrLossAmount);
    await user.save();
  }


  const updatedTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: updatedTrades,
    message: "Trade updated successfully",
  });
});

//autoTradeUpdate
const autoTradeUpdate = asyncHandler(async (req, res) => {
  const { userId, tradeData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user
  const user = await User.findById(userId);

  const result = await Trades.updateOne(
    { userId, "trades._id": tradeData.tradeId }, // Match the user and the specific trade
    {
      $set: {
        "trades.$": tradeData, // Update the specific trade using the `$` positional operator
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Trade not found" });
  }

  if (tradeData.status === "Won" && tradeData.tradingMode === "Live") {
    user.balance =
      Number(user.balance) +
      Number(tradeData.amount) +
      Number(tradeData.profitOrLossAmount);

    user.earnedTotal =
      Number(user.earnedTotal) + Number(tradeData.profitOrLossAmount);

    await user.save();
  }

  if (tradeData.status === "Lose" && tradeData.tradingMode === "Live") {
    if ((user.earnedTotal - tradeData.amount) < 0) {
      user.earnedTotal = 0;
    } else {
      user.earnedTotal = Number(user.earnedTotal) - Number(tradeData.amount);
    }

    await user.save();
  }

  if (tradeData.status === "Won" && tradeData.tradingMode === "Demo") {
    user.demoBalance =
      Number(user.demoBalance) +
      Number(tradeData.amount) +
      Number(tradeData.profitOrLossAmount);
    await user.save();
  }

  const updatedTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: updatedTrades,
    message: "Trade updated successfully",
  });
});

//userUpdateAdminTrade
const userUpdateAdminTrade = asyncHandler(async (req, res) => {
  const { userId, tradeData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user
  const user = await User.findById(userId);

  const result = await Trades.updateOne(
    { userId, "trades._id": tradeData.tradeId }, // Match the user and the specific trade
    {
      $set: {
        "trades.$": tradeData, // Update the specific trade using the `$` positional operator
      },
    }
  );

  if (result.matchedCount === 0) {
    return res
      .status(404)
      .json({ message: "Trade not found or updated already." });
  }

  if (tradeData.status === "Won" && tradeData.tradingMode === "Live") {
    user.balance =
      Number(user.balance) +
      Number(tradeData.amount) +
      Number(tradeData.profitOrLossAmount);

      user.earnedTotal =
      Number(user.earnedTotal) + Number(tradeData.profitOrLossAmount);


    await user.save();
  }

  if (tradeData.status === "Lose" && tradeData.tradingMode === "Live") {
    if ((user.earnedTotal - tradeData.amount) < 0) {
      user.earnedTotal = 0;
    } else {
      user.earnedTotal = Number(user.earnedTotal) - Number(tradeData.amount);
    }

    await user.save();
  }


  if (tradeData.status === "Won" && tradeData.tradingMode === "Demo") {
    user.demoBalance =
      Number(user.demoBalance) +
      Number(tradeData.amount) +
      Number(tradeData.profitOrLossAmount);
    await user.save();
  }

  const updatedTrades = await Trades.findOne({ userId }).populate(
    "userId",
    "_id firstname lastname email photo"
  );

  res.status(200).json({
    data: updatedTrades,
    message: "Trade updated successfully",
  });
});

module.exports = {
  addTrade,
  adminGetAllUserTrades,
  adminUpdateUserTrade,
  cancelTrade,
  deleteTrade,
  adminApproveUserTrade,
  autoTradeUpdate,
  userUpdateAdminTrade,
};
