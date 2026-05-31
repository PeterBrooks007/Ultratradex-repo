const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");
const axios = require("axios");
const { validationResult } = require('express-validator');
const Notifications = require("../models/notificationsModel");
const { adminGeneralEmailTemplate } = require("../emailTemplates/adminGeneralEmailTemplate");
const sendEmail = require("../utils/sendEmail");
const { withdrawalCompleteEmailTemplate } = require("../emailTemplates/withdrawalCompleteEmailTemplate");
const { withdrawalApprovalEmailTemplate } = require("../emailTemplates/withdrawalApprovalEmailTemplate");


//Withdraw Fund
const withdrawFund = asyncHandler(async (req, res) => {
  const {
    method,
    amount,
    walletAddress,
    bankName,
    bankAccount,
    routingCode,
    description,
  } = req.body;

  // Validate
  if (!method || !amount) {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  // check senders account
  const user = await User.findById({ _id: req.user._id });
  if (user.balance < amount) {
    res.status(400);
    throw new Error("Insufficient balance");
  }

  //Decrease sender account balance
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $inc: { balance: -amount, earnedTotal: -amount },
    }
  );

  //Save transaction
  const withdrawalHistory = await Withdrawal.create({
    ...req.body,
    userId: req.user._id,
    status: "PENDING",
  });

    // Send withdrawal request email to admin
    const introMessage = `This user ${user.firstname+" "+user.lastname} with email address ${user.email} just made a withdrawal request of ${amount} ${user.currency.code} with ${method} method`

    const subjectAdmin = "New Withdrawal Request - ultratradex"
    const send_to_Admin = process.env.EMAIL_USER
    const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
    const reply_toAdmin = "no_reply@ultratradex.io"

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


   //send withdrawal notification message object to admin
   const searchWord = "Support Team";
   const notificationObject = {
    to: searchWord,
    from: `${user.firstname+" "+user.lastname}`,
    notificationIcon: "CurrencyCircleDollar",
    title: "Withdrawal Request",
    message: `${user.firstname+" "+user.lastname} just made a withdrawal request of ${amount} ${user.currency.code}`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: user._id },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );

  res.status(200).json({ message: "Your Withdrawal Request has been initiated successfully " });
  // res.status(200).json(withdrawalHistory);
});

//getUserWithdrawalhistory
const getUserWithdrawalhistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all withdrawals by the userId
  const withdrawalHistory = await Withdrawal.find({ userId }).sort({
    createdAt: -1,
  });

  // Check if withdrawals exist
  if (!withdrawalHistory) {
    res.status(404);
    throw new Error("No withdrawals found for this user");
  }

  // Send the withdrawals back in the response
  res.status(200).json(withdrawalHistory);
});


//Admin Get All Pending Withdrawal Request
const getAllPendingWithdrawalRequest = asyncHandler (async (req, res) => {
  const AllPendingWithdrawalRequest = await Withdrawal.find({ status: "PENDING" }).sort("-createdAt").populate("userId");
  res.status(200).json(AllPendingWithdrawalRequest)
});



//Admin Approve Withdrawal Request
const approveWithdrawalRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const { userId } = req.body;
  const user = await User.findById({ _id: userId });


  const withdrawalRequest = await Withdrawal.findById(requestId).select("-password");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }


  if (withdrawalRequest) {
    const { typeOfDeposit, method, amount, status, walletAddress } =
    withdrawalRequest;

    withdrawalRequest.status = req.body.status || status;

    // Refund the withdrawn amount if req.body.status === "NOT-APPROVED"
    if(user && withdrawalRequest.status === "NOT-APPROVED"){ 
      user.balance = user.balance + amount;
      user.earnedTotal = user.earnedTotal + amount;
      await user.save();
    }


    //send approval email if status == "APPROVED"
    if (req.body.status == "APPROVED") {

      const user = await User.findById({ _id: withdrawalRequest.userId });

      try {
        const subject = "Withdrawal Successful - ultratradex";
        const send_to = user.email;

        const withdrawalAmount = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: user.currency.code,
          ...(amount > 9999999 ? { notation: "compact" } : {}),
        }).format(amount);

        // const dashboardLink = `https://ultratradex.io/dashboard/confirm-withdrawal?walletAddress=${walletAddress}&amount=${withdrawalAmount}&method=${method}`;

        const template = withdrawalCompleteEmailTemplate(
          `Withdrawal Successful`,
          `${withdrawalAmount}`,
          `${method}`,
          `${walletAddress}`,
          // `${dashboardLink}`,
        );

        const reply_to = process.env.EMAIL_USER;

        await sendEmail(subject, send_to, template, reply_to);
      } catch (error) {
        console.error("Failed to send email:", error.message);
      }
    }

     //send Not approved email if status == "NOT-APPROVED"
    if (req.body.status == "NOT-APPROVED") {

      const user = await User.findById({ _id: withdrawalRequest.userId });

      try {
        const subject = "Withdrawal Declined - ultratradex";
        const send_to = user.email;

        const withdrawalAmount = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: user.currency.code,
          ...(amount > 9999999 ? { notation: "compact" } : {}),
        }).format(amount);

        const withdrawalMessage = `Your withdrawal request of ${withdrawalAmount} was not Approved, Please contact our support.`

    
        const template = withdrawalApprovalEmailTemplate(
          `Withdrawal Not Approved`,
          `${withdrawalAmount}`,
          `${method}`,
          `${walletAddress}`,
          `${withdrawalMessage}`,
        );

        const reply_to = process.env.EMAIL_USER;

        await sendEmail(subject, send_to, template, reply_to);
      } catch (error) {
        console.error("Failed to send email:", error.message);
      }
    }




    const updatedWithdrawalRequest = await withdrawalRequest.save();
    if (updatedWithdrawalRequest) {

   //send Withdrawal approval notification message object to user
  const searchWord = "Support Team";
  const notificationObject = {
    to: `This user`,
    from: searchWord,
    notificationIcon: "CurrencyCircleDollar",
    title: "Withdrawal Request",
    message: `Your Withdrawal request of ${amount} has been updated. Please check your withdrawal history.`,
    route: "/dashboard"
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: withdrawalRequest.userId },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );


      const AllPendingWithdrawalRequest = await Withdrawal.find({ status: "PENDING" }).sort("-createdAt").populate("userId");
      res.status(200).json(AllPendingWithdrawalRequest);

    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Withdrawal Request not found");
  }
});



// Admin Delete Withdrawal Request

const deleteWithdrawalRequest = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  // const withdrawalRequest = await Withdrawal.findById(userId);

  const deleteWithdrawalrequest = await Withdrawal.findByIdAndDelete(userId);

  if (!deleteWithdrawalrequest) {
    res.status(404);
    throw new Error("Withdrawal request not found");
  }


  const AllPendingWithdrawalRequest = await Withdrawal.find({ status: "PENDING" }).sort("-createdAt").populate("userId");
  res.status(200)
  .json({ data: AllPendingWithdrawalRequest, message: "Withdrawal Request deleted successfully" });

 
});



//adminGetUserWithdrawalhistory
const adminGetUserWithdrawalhistory = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find all withdrawals by the userId
  const withdrawalHistory = await Withdrawal.find({ userId }).sort({
    createdAt: -1,
  });

  // Check if withdrawalHistoryHistory exist
  if (!withdrawalHistory) {
    res.status(404);
    throw new Error("No withdrawal History found for this user");
  }

  // Send the withdrawals back in the response
  res.status(200).json(withdrawalHistory);
});






module.exports = {
  withdrawFund,
  getUserWithdrawalhistory,
  getAllPendingWithdrawalRequest,
  approveWithdrawalRequest,
  deleteWithdrawalRequest,
  adminGetUserWithdrawalhistory
};
