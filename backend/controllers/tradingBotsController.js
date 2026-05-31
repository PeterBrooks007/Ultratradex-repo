const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ExpertTraders = require("../models/expertTradersModel");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const { validationResult } = require('express-validator');
const TradingBots = require("../models/tradingBotsModel");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// addTradingBots
const addTradingBot = asyncHandler(async (req, res) => {
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
    const folderName = "trading-bots";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create a new expert trader entry
          const tradingBots = await TradingBots.create({
            name,
            price,
            dailyTrades,
            winRate,
            comment,
            photo: result.secure_url, // Save the image URL
          });

          if (tradingBots) {
            const allTradingBots = await TradingBots.find().sort(
              "-createdAt"
            );
            res.status(200).json({
              data: allTradingBots,
              message: "Trading Bots has been added successfully ",
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


//Get All TradingBots
const getAllTradingBots = asyncHandler(async (req, res) => {
  const allTradingBots = await TradingBots.find().sort("-createdAt");
  res.status(200).json(allTradingBots);
});

//update Trading Bot
const updateTradingBot = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const TradingBot = await TradingBots.findById(userId).select("-password");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (TradingBot) {
    const { name, price, dailyTrades, winRate, comment, photo } =
    TradingBot;

      TradingBot.name = req.body.name || name;
      TradingBot.price = req.body.price || price;
      TradingBot.dailyTrades = req.body.dailyTrades || dailyTrades;
      TradingBot.winRate = req.body.winRate || winRate;
      TradingBot.comment = req.body.comment || comment;
      TradingBot.photo = req.body.photo || photo;

    const updatedTradingBot = await TradingBot.save();
    if (updatedTradingBot) {
      const allTradingBot = await TradingBots.find().sort("-createdAt");
      res.status(200).json(allTradingBot);
    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Trading Bot not found");
  }
});

// updateTradingBotPhoto
const updateTradingBotPhoto = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch the TradingBot record from the database
  const TradingBot = await TradingBots.findById(userId).select("-password");
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
  const currentPhotoUrl = TradingBot.photo;

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
    const folderName = "trading-bots";

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
    TradingBot.photo = uploadResult.secure_url;
    const updatedExpertTrader = await TradingBot.save();

    // Check if the save operation was successful
    if (!updatedExpertTrader) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated ExpertTrader"
      );
    }

    // Return the updated list of ExpertTraders
    const allTradingBots = await TradingBots.find().sort("-createdAt");
    res.status(200).json(allTradingBots);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});


// Delete TradingBot

const deleteTradingBot = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const TradingBot = await TradingBots.findById(userId);

  const deleteTradingBot = await TradingBots.findByIdAndDelete(userId);

  if (!deleteTradingBot) {
    res.status(404);
    throw new Error("Trading Bot not found");
  }

  if (deleteTradingBot) {
    // Step 2: Remove the trade bots from all users' myTraders
    await User.updateMany(
      { myTradingBots: userId },
      { $pull: { myTradingBots: userId } }
    );

    const publicId = getPublicIdFromUrl(TradingBot.photo);
    cloudinary.uploader.destroy(publicId); // Delete the trading bot image
  }

  const allTradingBots = await TradingBots.find().sort("-createdAt");
  res
    .status(200)
    .json({ data: allTradingBots, message: "Trading Bot deleted successfully" });
});

// myExpertTrader
const myExpertTrader = asyncHandler(async (req, res) => {
  const { expertTraderID } = req.body;

  const user = await User.findById(req.user._id).select("-password");
  const expertTraderExists = await ExpertTraders.findById(expertTraderID);

  if (!expertTraderExists) {
    res.status(404);
    throw new Error(
      "Expert Trader not found or might have been removed. Refresh traders list"
    );
  }

  if (user.myTraders.includes(expertTraderID)) {
    res.status(400);
    throw new Error("Trader already on your list");
  }

  await user.myTraders.unshift(expertTraderID);
  await user.save();
  const savedUser = await User.findOne({ email: req.user.email })
    .select("myTraders")
    .populate("myTraders");

  res
    .status(201)
    .json({ data: savedUser.myTraders, message: "Trader Added to your list" });
});

//getMyExpertTrader
const getMyExpertTrader = asyncHandler(async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("myTraders")
    .populate("myTraders");

  res.status(200).json(list.myTraders);
});

//removeMyExpertTrader
const removeFromMyExpertTrader = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { myTraders: id } }
  );

  const list = await User.findOne({ email: req.user.email })
    .select("myTraders")
    .populate("myTraders");

  res
    .status(200)
    .json({
      data: list.myTraders,
      message: "Expert Trader removed from your list",
    });
});

module.exports = {
  addTradingBot,
  getAllTradingBots,
  updateTradingBot,
  updateTradingBotPhoto,
  deleteTradingBot,
  myExpertTrader,
  getMyExpertTrader,
  removeFromMyExpertTrader,
};
