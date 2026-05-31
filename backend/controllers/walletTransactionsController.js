const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const WalletTransactions = require("../models/walletTransactionsModel");
const { adminGeneralEmailTemplate } = require("../emailTemplates/adminGeneralEmailTemplate");
const sendEmail = require("../utils/sendEmail");
const Notifications = require("../models/notificationsModel");

//addTransaction
const addTransaction = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const { userId, transactionData } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const transactionSymbol = transactionData.symbol.toLowerCase();

  // Retrieve the user and check the asset balance
  const user = await User.findOne({
    _id: userId,
    "assets.symbol": transactionSymbol,
  });
  if (!user) {
    res.status(404);
    throw new Error(
      `User or asset with symbol ${transactionData.symbol} not found.`
    );
  }

  // Find the asset in the user's assets array
  const asset = user.assets.find((a) => a.symbol === transactionSymbol);
  if (!asset) {
    res.status(404);
    throw new Error(`Asset with symbol ${transactionSymbol} not found.`);
  }
  

   // Check if the asset balance is sufficient
   if (user?.isManualAssetMode === false && asset.balance < transactionData.amount) {
    res.status(400);
    throw new Error(
      `Insufficient balance. ${transactionData.symbol.toUpperCase()} Balance: ${asset.balance}`
    );
  }

   // Check if the asset balance is sufficient manual mode
   if (user?.isManualAssetMode === true && asset.ManualFiatbalance < transactionData.amountFiat) {
    res.status(400);
    throw new Error(
      `Insufficient balance. ${transactionData.symbol.toUpperCase()} Balance: ${asset.ManualFiatbalance}`
    );
  }

  //if walletAddress is to Trade balance, add to trade balance
  if (transactionData.walletAddress === "Trade Balance" && user) {
    user.balance += transactionData.amountFiat;
    await user.save(); // Awaiting the save operation
  }


  let transactionDataNow;

  if(user?.isManualAssetMode === false) {
    transactionDataNow = {
      ...transactionData,
      symbol: transactionSymbol, // Ensure symbol is stored in lowercase
    };
  } else {
    transactionDataNow = {
      ...transactionData,
      amount: transactionData.amountFiat,
      symbol: transactionSymbol, // Ensure symbol is stored in lowercase
    };
  }


  // Update the specific asset balance
  if(user?.isManualAssetMode === false) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "assets.symbol": transactionSymbol },
      { $inc: { "assets.$.balance": -transactionData.amount } }, // Decrease the balance
      { new: true } // Return the updated document
    );
  } else {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "assets.symbol": transactionSymbol },
      { $inc: { "assets.$.ManualFiatbalance": -transactionData.amountFiat } }, // Decrease the balance
      { new: true } // Return the updated document
    );
  }
 

  // Add the transaction to WalletTransactions
  await WalletTransactions.updateOne(
    { userId },
    { $push: { transactions: transactionDataNow } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );


    // Send sendCrypto request email to admin
    const introMessage = `This user ${user.firstname+" "+user.lastname} with email address ${user.email} just made a send crypto request with ${transactionData.method} method`

    const subjectAdmin = "New Send Crypto Request - ultratradex"
    const send_to_Admin = process.env.EMAIL_USER
    const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
    const reply_toAdmin = "no_reply@ultratradex.io"

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


   //send sendCrypto notification message object to admin
   const searchWord = "Support Team";
   const notificationObject = {
    to: searchWord,
    from: `${user.firstname+" "+user.lastname}`,
    notificationIcon: "CurrencyCircleDollar",
    title: "Send Crypto Request",
    message: `${user.firstname+" "+user.lastname} just made a send crypto request with ${transactionData.method} method`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: user._id },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );




  // Fetch all user transactions with user details populated
  const allUserTransactions = await WalletTransactions.find({
    userId,
  }).populate("userId", "_id firstname lastname email photo");

  res.status(200).json({
    data: allUserTransactions,
    message: `${transactionData.symbol.toUpperCase()} sent successfully.`,
  });
});

// getUserWalletTransactions
const getUserWalletTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allUserTransactions = await WalletTransactions.find({ userId })
    .limit(1)
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");
  res.status(200).json(allUserTransactions);
});

const adminGetAllUserWalletTransactions = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find all trades for the user, sorted by creation date
  const allUserWalletTransactions = await WalletTransactions.find({ userId })
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // If no trades are found, respond accordingly
  if (!allUserWalletTransactions || allUserWalletTransactions.length === 0) {
    return res.status(404).json({
      message: "No Transaction found",
    });
  }

  // Success response
  res.status(200).json({
    data: allUserWalletTransactions,
  });
});

//adminUpdateUserWalletTransaction
const adminUpdateUserWalletTransaction = asyncHandler(async (req, res) => {
  const { userId, transactionData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const result = await WalletTransactions.updateOne(
    { userId, "transactions._id": transactionData.transactionId }, // Match the user and the specific trade
    {
      $set: {
        "transactions.$": transactionData, // Update the specific transaction using the `$` positional operator
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  //send the SendCrypto approval notification message object to user
  const searchWord = "Support Team";
  const notificationObject = {
    to: `This user`,
    from: searchWord,
    notificationIcon: "CurrencyCircleDollar",
    title: "Send Crypto Request",
    message: `Your Send Crypto request of ${transactionData.amount} has been updated. Please check the transaction details.`,
    route: "/dashboard"
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: userId },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );

  const updatedTransactions = await WalletTransactions.find({
    userId,
  }).populate("userId", "_id firstname lastname email photo");

  res.status(200).json({
    data: updatedTransactions,
    message: "Transaction updated successfully",
  });
});

//deleteTrade
const deleteTransaction = asyncHandler(async (req, res) => {
  const { userId, transactionData } = req.body;

  // console.log(req.body)

  const result = await WalletTransactions.updateOne(
    { userId }, // Match the user
    {
      $pull: {
        transactions: { _id: transactionData.transactionsId }, // Remove the trade with the specified _id
      },
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const updatedTransactions = await WalletTransactions.find({
    userId,
  }).populate("userId", "_id firstname lastname email photo");

  res.status(200).json({
    data: updatedTransactions,
    message: "Transactions deleted successfully",
  });
});

module.exports = {
  addTransaction,
  getUserWalletTransactions,
  adminGetAllUserWalletTransactions,
  adminUpdateUserWalletTransaction,
  deleteTransaction,
};
