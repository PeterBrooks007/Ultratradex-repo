const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Deposit = require("../models/depositModel");
const axios = require("axios");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const { validationResult } = require('express-validator');
const sharp = require("sharp"); // Import sharp
const { adminGeneralEmailTemplate } = require("../emailTemplates/adminGeneralEmailTemplate");
const sendEmail = require("../utils/sendEmail");
const Notifications = require("../models/notificationsModel");
const { depositEmailTemplate } = require("../emailTemplates/depositEmailTemplate");
const { userGeneralEmailTemplate } = require("../emailTemplates/userGeneralEmailTemplate");




//Deposit Fund
const depositFund = asyncHandler(async (req, res) => {
  const {
    method,
    amount,
    typeOfDeposit,
    methodIcon,
  } = req.body.userData;

  // Validate
  if (!method || !amount || !typeOfDeposit || !methodIcon) {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  // Handle file upload
  const file = req.file; // Get the uploaded file from req.file
  if (!file) {
    res.status(404);
    throw new Error("No file uploaded");
  }

  // Check if the uploaded file is an image
  const validMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  const uploadedMimeType = file.mimetype.toLowerCase(); // Convert to lowercase for case-insensitive comparison
  if (!validMimeTypes.includes(uploadedMimeType)) {
    res.status(400);
    throw new Error("Uploaded file is not a valid image");
  }

  // Validate file size (5MB limit)
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    res.status(400);
    throw new Error("Image size exceeds 5MB limit");
  }

  try {
    // Get the MIME type of the uploaded file
    const mimeType = file.mimetype.toLowerCase();

    let compressedImageBuffer;

    // Compress image based on MIME type
    if (mimeType === "image/png") {
      // Compress PNG and keep it as PNG
      compressedImageBuffer = await sharp(file.buffer)
        .resize(500) // Resize to width of 800 pixels, keeping aspect ratio
        .png({ quality: 70, compressionLevel: 9 }) // PNG compression with quality 70
        .toBuffer();
    } else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      // Compress JPEG/JPG and keep it as JPEG
      compressedImageBuffer = await sharp(file.buffer)
        .resize(500) // Resize to width of 800 pixels, keeping aspect ratio
        .jpeg({ quality: 70 }) // JPEG compression with quality 80
        .toBuffer();
    } else {
      // Compress any other file type and convert to JPEG
      compressedImageBuffer = await sharp(file.buffer)
        .resize(500) // Resize to width of 800 pixels, keeping aspect ratio
        .jpeg({ quality: 70 }) // Default to JPEG with quality 80
        .toBuffer();
    }

    // Specify the folder name where you want to upload the image
    const folderName = "deposit-proofs";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

        //Save transaction
        const depositHistory = await Deposit.create({
          userId: req.user._id,
          typeOfDeposit,
          method,
          amount,
          status: "PENDING",
          depositProof: result.secure_url,
          methodIcon,
        });

        //Send Email to admin

       
        if (depositHistory) {

      // Send New Deposit Request email to admin
       const introMessage = `This user ${req.user.firstname+" "+req.user.lastname} with email address ${req.user.email} just made a deposit request of ${amount} ${req.user.currency.code} with ${method} method`

        const subjectAdmin = "New Deposit Request - ultratradex"
        const send_to_Admin = process.env.EMAIL_USER
        const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
        const reply_toAdmin = "no_reply@ultratradex.io"

        await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


        //send dashboard notification message object to admin
        const searchWord = "Support Team";
        const notificationObject = {
          to: searchWord,
          from: `${req.user.firstname+" "+req.user.lastname}`,
          notificationIcon: "CurrencyCircleDollar",
          title: "New Deposit Request",
          message: ` ${req.user.firstname+" "+req.user.lastname} with email address ${req.user.email} made a deposit request`,
          route: "/dashboard",
        };
      
        // Add the Notifications
        await Notifications.updateOne(
          { userId: req.user._id },
          { $push: { notifications: notificationObject } },
          { upsert: true } // Creates a new document if recipient doesn't exist
        );




            res.status(200).json({ message: "Your Deposit Request has been initiated successfully " });

          } else {
            res.status(500).json({ message: "An error has occurred" });
          }
        }
      )
      .end(compressedImageBuffer); // Use the file buffer for the upload
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }

  // //Save transaction
  // const depositHistory = await Deposit.create({
  //   ...req.body,
  //   userId: req.user._id,
  //   status: "PENDING",
  // });

  // //Send Email to admin

  // res.status(200).json({ message: "Your Deposit Request has been initiated successfully " });
  // res.status(200).json(withdrawalHistory);
});



//requestDepositDetails
const requestDepositDetails = asyncHandler(async (req, res) => {
  const {
    method,
    amount,
  } = req.body;

  // Validate
  if (!method || !amount ) {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  //Send Email to admin

   // Send New Deposit Request email to admin
   const introMessage = `This user ${req.user.firstname+" "+req.user.lastname} with email address ${req.user.email} just requested a ${method} deposit details`

   const subjectAdmin = "New Deposit Request - ultratradex"
   const send_to_Admin = process.env.EMAIL_USER
   const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
   const reply_toAdmin = "no_reply@ultratradex.io"

   await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


   //send dashboard notification message object to admin
   const searchWord = "Support Team";
   const notificationObject = {
     to: searchWord,
     from: `${req.user.firstname+" "+req.user.lastname}`,
     notificationIcon: "CurrencyCircleDollar",
     title: "New Deposit Request",
     message: ` ${req.user.firstname+" "+req.user.lastname} with email address ${req.user.email} just requested a ${method} deposit details `,
     route: "/dashboard",
   };
 
   // Add the Notifications
   await Notifications.updateOne(
     { userId: req.user._id },
     { $push: { notifications: notificationObject } },
     { upsert: true } // Creates a new document if recipient doesn't exist
   );



  res.status(200).json({ message: "Your request has been sent successfully, you will be contacted shhortly." });
  // res.status(200).json(withdrawalHistory);
});

//getUserDeposithistory
const getUserDeposithistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all withdrawals by the userId
  const depositHistory = await Deposit.find({ userId }).sort({
    createdAt: -1,
  });

  // Check if withdrawals exist
  if (!depositHistory) {
    res.status(404);
    throw new Error("No deposit History found for this user");
  }

  // Send the withdrawals back in the response
  res.status(200).json(depositHistory);
});

//adminGetUserDeposithistory
const adminGetUserDeposithistory = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find all withdrawals by the userId
  const depositHistory = await Deposit.find({ userId }).sort({
    createdAt: -1,
  });

  // Check if depositHistory exist
  if (!depositHistory) {
    res.status(404);
    throw new Error("No deposit History found for this user");
  }

  // Send the withdrawals back in the response
  res.status(200).json(depositHistory);
});


//Admin Get All Pending Deposit Request
const getAllPendingDepositRequest = asyncHandler (async (req, res) => {
  const AllPendingDepositRequest = await Deposit.find({ status: "PENDING" }).sort("-createdAt").populate("userId");
  res.status(200).json(AllPendingDepositRequest)
});


//Admin Approve Deposit Request
const approveDepositRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

    // Fetch deposit and populate user info
  const depositRequest = await Deposit.findById(requestId)
    .populate("userId") // populate user info for email + notifications
    .select("-password");


  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

   if (!depositRequest) {
    res.status(404);
    throw new Error("Deposit Request not found");
  }

  const user = depositRequest.userId;

  if (!user) {
    res.status(404);
    throw new Error("Associated user not found for this deposit request");
  }

  // Handle approval logic
  if(req.body.comment === "ApproveWithBalance" && req.body.typeOfDeposit === "Trade") {
    //Add to user account balance
  await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $inc: { balance: req.body.amount, totalDeposit: req.body.amount },
    }
  );
  }
  
  if (req.body.comment === "ApproveWithBalance" && req.body.typeOfDeposit === "Wallet") {

    await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $inc: { totalDeposit: req.body.amount },
      }
    );

    // // Update the user's Bitcoin asset balance
    // await User.updateOne(
    //   { _id: req.body.userId, 'assets.symbol': 'BTC' }, // Match the user and the asset with symbol 'BTC'
    //   {
    //     $inc: { 'assets.$.balance': req.body.amount }, // Use positional operator $ to increment the balance of the matched asset
    //   }
    // );
  }


  if (depositRequest) {
    const { typeOfDeposit, method, amount, status, depositProof } =
    depositRequest;

    depositRequest.typeOfDeposit = req.body.typeOfDeposit || typeOfDeposit;
    depositRequest.method = req.body.method || method;
    depositRequest.amount = req.body.amount || amount;
    depositRequest.status = req.body.status || status;
    depositRequest.depositProof = req.body.depositProof || depositProof;

    const updatedDepositRequest = await depositRequest.save();

    if (updatedDepositRequest) {

  //send deposit approval notification message object to user
  const searchWord = "Support Team";
  const notificationObject = {
    to: `This user`,
    from: searchWord,
    notificationIcon: "CurrencyCircleDollar",
    title: "Deposit Request",
    message: `Your deposit request of ${amount} has been updated. Please check your deposit history.`,
    route: "/dashboard"
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: depositRequest.userId },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );


  
  // Send email notification
  try {
    let introMessage;

    if (req.body.status === "NOT-APPROVED") {
      introMessage = `Your deposit request of ${amount} ${user.currency.code} with ${method} deposit method was NOT APPROVED. Please check your deposit history.`;
    }

    const subject = "Deposit Status - ultratradex";
    const send_to = user.email;

    const depositAmount = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: user.currency.code,
      ...(amount > 9999999 ? { notation: "compact" } : {}),
    }).format(amount);

    const dashboardLink = "ultratradex.io/auth/login";

    let template;

    if (req.body.status === "APPROVED") {
      template = depositEmailTemplate(
        `Deposit Confirmed`,
        `${depositAmount}`,
        `${method}`,
        `${updatedDepositRequest._id}`,
        `${dashboardLink}`
      );
    } else {
      template = userGeneralEmailTemplate(
        `${user.firstname} ${user.lastname}`,
        introMessage
      );
    }

    const reply_to = process.env.EMAIL_USER;

    await sendEmail(subject, send_to, template, reply_to);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }



      const AllPendingDepositRequest = await Deposit.find({ status: "PENDING" }).sort("-createdAt").populate("userId");
      res.status(200).json(AllPendingDepositRequest);

    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Deposit Request not found");
  }
});


// Admin Delete Deposit Request

const deleteDepositRequest = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const depositRequest = await Deposit.findById(userId);

  const deleteDepositrequest = await Deposit.findByIdAndDelete(userId);

  if (!deleteDepositrequest) {
    res.status(404);
    throw new Error("deposit request not found");
  }

  if (deleteDepositrequest && depositRequest.depositProof) {
    const publicId = getPublicIdFromUrl(depositRequest.depositProof);
    cloudinary.uploader.destroy(publicId); // Delete the deposit request image
  }

  const AllPendingDepositRequest = await Deposit.find({ status: "PENDING" }).sort("-createdAt").populate("userId");
  res.status(200)
  .json({ data: AllPendingDepositRequest, message: "Deposit Request deleted successfully" });

 
});



//adminAddTradeHistoryToUser Fund
const adminAddTradeHistoryToUser = asyncHandler(async (req, res) => {
// console.log(req.body)

  const {
    typeOfDeposit,
    method,
    amount,
    status,
    userId,
    methodIcon,
  } = req.body;

  // Validate
  if (!method || !amount || !typeOfDeposit || !status || !userId || !methodIcon) {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  //Save transaction
  const depositHistory = await Deposit.create({
    ...req.body,
    userId,
  });

  //Send Email to admin

  res.status(200).json({ message: "Deposit History added to user successfully " });
  // res.status(200).json(withdrawalHistory);
});




module.exports = {
  depositFund,
  getUserDeposithistory,
  requestDepositDetails,
  getAllPendingDepositRequest,
  approveDepositRequest,
  deleteDepositRequest,
  adminGetUserDeposithistory,
  adminAddTradeHistoryToUser,
};
