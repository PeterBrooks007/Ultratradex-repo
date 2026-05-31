const asyncHandler = require("express-async-handler");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const { validationResult } = require('express-validator');
const TradingSettings = require("../models/tradingSettingsModel");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// addExchangeType
const addExchangeType = asyncHandler(async (req, res) => {
  const { exchangeType } =
   req.body.userData; // Parse userData from req.body

const errors = validationResult(req);
if (!errors.isEmpty()) {
  // console.log(errors.array()); // Log all errors for debugging
  res.status(400);
  throw new Error(errors.array()[0].msg);
}

const exchangeTypeLowerCase = exchangeType.toLowerCase()

 //check if user exist
 const  ExchangeExists = await TradingSettings.findOne({ exchangeType: exchangeTypeLowerCase });
 if (ExchangeExists) {
   res.status(400);
   throw new Error("Exchange already Exist");
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
    const folderName = "exchangetype-images";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create a new expert trader entry
          const exchangeTypecreate = await TradingSettings.create({
            exchangeType: exchangeTypeLowerCase,
            photo: result.secure_url, // Save the image URL
          });

          if (exchangeTypecreate) {
            const allExchangeType = await TradingSettings.find().sort(
              "createdAt"
            );
            res.status(200).json({
              data: allExchangeType,
              message: "Exchange Type has been added successfully ",
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


//getAllTradingSetting
const getAllTradingSetting = asyncHandler(async (req, res) => {
  const allTradingSettings = await TradingSettings.find().sort("createdAt");
  res.status(200).json(allTradingSettings);
});


//update TradingSetting
const updateTradingSetting = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const exchange = await TradingSettings.findById(Id).select("-password");

  // console.log(Id, req.body)

  const exchangeTypeLowerCase = req.body.exchangeType.toLowerCase()


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

   //check if user exist
 const  ExchangeExists = await TradingSettings.findOne({ exchangeType: exchangeTypeLowerCase });
 if (ExchangeExists) {
   res.status(400);
   throw new Error("Exchange name already Exist use another name");
 }



  if (exchange) {
    const { exchangeType, photo } =
    exchange;

    exchange.exchangeType = exchangeTypeLowerCase || exchangeType;
    exchange.photo = req.body.photo || photo;

    const updatedExchange = await exchange.save();
    if (updatedExchange) {
      const allTradingSettings = await TradingSettings.find().sort("createdAt");
      res.status(200).json(allTradingSettings);
    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Trading Bot not found");
  }
});

// updateTradingSettingPhoto
const updateTradingSettingPhoto = asyncHandler(async (req, res) => {
  const Id = req.params.id;

  // Fetch the TradingBot record from the database
  const exchange = await TradingSettings.findById(Id).select("-password");
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
  const currentPhotoUrl = exchange.photo;

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
    const folderName = "exchangetype-images";

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
    exchange.photo = uploadResult.secure_url;
    const updatedExchange = await exchange.save();

    // Check if the save operation was successful
    if (!updatedExchange) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated wallat"
      );
    }

    // Return the updated list of exchange
    const allTradingSettings = await TradingSettings.find().sort("createdAt");
    res.status(200).json(allTradingSettings);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});


// Delete wallet
const deleteTradingSettingExchange = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const exchange = await TradingSettings.findById(Id);

  const deleteTradingSetting = await TradingSettings.findByIdAndDelete(Id);

  if (!deleteTradingSetting) {
    res.status(404);
    throw new Error("exchange not found");
  }

  if (deleteTradingSetting) {
   
    const publicId = getPublicIdFromUrl(exchange.photo);
    cloudinary.uploader.destroy(publicId); // Delete the trading bot image
  }

  const allTradingSettings = await TradingSettings.find().sort("createdAt");
  res
    .status(200)
    .json({ data: allTradingSettings, message: "Wallet deleted successfully" });
});



// Delete multiple exchange by an array of IDs
const deleteArrayOfTradingExchange = asyncHandler(async (req, res) => {
  const { TradesExchangeIds } = req.body;

  if (!Array.isArray(TradesExchangeIds) || TradesExchangeIds.length === 0) {
    return res.status(400).json({ message: "Invalid or empty array of IDs" });
  }

  try {
    // Fetch wallets to get the photo URLs before deleting them
    const exchanges = await TradingSettings.find({ _id: { $in: TradesExchangeIds } });
    if (exchanges.length === 0) {
      return res.status(404).json({ message: "No Exchange found to delete" });
    }

    // Loop through each wallet to delete its image from Cloudinary
    for (const exchange of exchanges) {
      if (exchange.photo) {
        const publicId = getPublicIdFromUrl(exchange.photo);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete the wallets from the database
    const result = await TradingSettings.deleteMany({ _id: { $in: TradesExchangeIds } });

    // Fetch the remaining wallets after deletion
    const allTradingSettings = await TradingSettings.find().sort("createdAt");

    res.status(200).json({
      data: allTradingSettings,
      message: `${result.deletedCount} Exchange(s) deleted successfully, along with their images`,
    });

  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting wallets and their images" });
  }
});



// Add multiple trading pairs
const addTradingPairs = asyncHandler(async (req, res) => {

  const id = req.params.id;
  const { tradingPairsArray } = req.body;
  
  // console.log(req.body)

  const errors = validationResult(req);
if (!errors.isEmpty()) {
  // console.log(errors.array()); // Log all errors for debugging
  res.status(400);
  throw new Error(errors.array()[0].msg);
}

  const result = await TradingSettings.findByIdAndUpdate(
    id,
    { $addToSet: { tradingPairs: { $each: tradingPairsArray } } },
    { new: true, useFindAndModify: false }
  );

  if(!result){
    res.status(404);
    throw new Error("exchange not found");
  }

  const allTradingSettings = await TradingSettings.find().sort("createdAt");

  res.status(200).json({
    result,
    data: allTradingSettings,
    message: ` Trading Pair(s) added successfully`,
  });

  
 
});


// Delete multiple trading pairs
const DeleteArrayTradingPairs = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { tradingPairsArray } = req.body;

  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Update the TradingSettings document by removing the specified pairs
  const result = await TradingSettings.findByIdAndUpdate(
    id,
    { $pull: { tradingPairs: { $in: tradingPairsArray } } }, // Use $pull with $in to remove multiple items
    { new: true, useFindAndModify: false }
  );

  if (!result) {
    res.status(404);
    throw new Error("Exchange not found");
  }

  // Fetch all trading settings
  const allTradingSettings = await TradingSettings.find().sort("createdAt");

  res.status(200).json({
    result,
    data: allTradingSettings,
    message: `Trading Pair(s) deleted successfully`,
  });
});




module.exports = {
  addExchangeType,
  getAllTradingSetting,
  updateTradingSetting,
  updateTradingSettingPhoto,
  deleteTradingSettingExchange,
  deleteArrayOfTradingExchange,
  addTradingPairs,
  DeleteArrayTradingPairs
  
};
