const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const WalletAddress = require("../models/walletAddressModel");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const { validationResult } = require('express-validator');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add addWalletAddress
const addWalletAddress = asyncHandler(async (req, res) => {
  const { walletName, walletSymbol, walletAddress, walletPhoto } =
   req.body.userData; // Parse userData from req.body

const errors = validationResult(req);
if (!errors.isEmpty()) {
  // console.log(errors.array()); // Log all errors for debugging
  res.status(400);
  throw new Error(errors.array()[0].msg);
}

  // Check if user exists
  const walletExists = await WalletAddress.findOne({ walletName });
  if (walletExists) {
    res.status(400);
    throw new Error("Wallet already exist");
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
    const folderName = "wallet_address";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create a new expert trader entry
          const CreateWalletAddress = await WalletAddress.create({
            walletName,
            walletSymbol,
            walletAddress,
            walletQrcode: result.secure_url,
            walletPhoto,
          });

          if (CreateWalletAddress) {
            const allWalletAddress = await WalletAddress.find().sort(
              "-createdAt"
            );
            res.status(200).json({
              data: allWalletAddress,
              message: "Wallet address has been added successfully ",
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


//Get All Wallet Address
const getAllWalletAddress = asyncHandler(async (req, res) => {
  const allWalletAddress = await WalletAddress.find().sort("-createdAt");
  res.status(200).json(allWalletAddress);
});



//update WalletAddress
const updateWalletAddress = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const findWalletAddress = await WalletAddress.findById(userId).select("-password");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (findWalletAddress) {
    const { walletName, walletSymbol, walletAddress  } =
    findWalletAddress;

    findWalletAddress.walletName = req.body.walletName || walletName;
    findWalletAddress.walletSymbol = req.body.walletSymbol || walletSymbol;
    findWalletAddress.walletAddress = req.body.walletAddress || walletAddress;
   
    const updatedWalletAddress = await findWalletAddress.save();
    if (updatedWalletAddress) {
      const allWalletAddress = await WalletAddress.find().sort("-createdAt");
      res.status(200).json(allWalletAddress);
    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Expert Trader not found");
  }
});

// updateWalletAddresIcon
const updateWalletAddresIcon = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch the ExpertTrader record from the database
  const walletAddress = await WalletAddress.findById(userId).select("-password");
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
  const currentPhotoUrl = walletAddress.walletPhoto;

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
    const folderName = "walletAddress_icons";

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
    walletAddress.walletPhoto = uploadResult.secure_url;
    const updatedWalletAddress = await walletAddress.save();

    // Check if the save operation was successful
    if (!updatedWalletAddress) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated WalletAddress"
      );
    }

    // Return the updated list of ExpertTraders
    const allWalletAddress = await WalletAddress.find().sort("-createdAt");
    res.status(200).json(allWalletAddress);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});

// updateWalletAddresQrcode
const updateWalletAddresQrcode = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch the WalletAddres record from the database
  const walletAddress = await WalletAddress.findById(userId).select("-password");
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
  const currentPhotoUrl = walletAddress.walletQrcode;

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
    const folderName = "wallet_address";

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
    walletAddress.walletQrcode = uploadResult.secure_url;
    const updatedWalletAddress = await walletAddress.save();

    // Check if the save operation was successful
    if (!updatedWalletAddress) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated WalletAddress"
      );
    }

    // Return the updated list of ExpertTraders
    const allWalletAddress = await WalletAddress.find().sort("-createdAt");
    res.status(200).json(allWalletAddress);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});


// deleteWalletAddress

const deleteWalletAddress = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const walletAddress = await WalletAddress.findById(userId);

  const deletewalletAddress = await WalletAddress.findByIdAndDelete(userId);

  if (!deletewalletAddress) {
    res.status(404);
    throw new Error("Wallet Address not found");
  }

  if (deletewalletAddress) {
    // Step 2: Remove the expert trader from all users' myTraders
    await User.updateMany(
      { myTraders: userId },
      { $pull: { myTraders: userId } }
    );

    const iconPublicId = getPublicIdFromUrl(walletAddress.walletPhoto);
    const qrcodePublicId = getPublicIdFromUrl(walletAddress.walletQrcode);
    cloudinary.uploader.destroy(iconPublicId); // Delete the  wallet address icon
    cloudinary.uploader.destroy(qrcodePublicId); // Delete the  wallet address qrcode

  }

  const allWalletAddress = await WalletAddress.find().sort("-createdAt");
  res
    .status(200)
    .json({ data: allWalletAddress, message: "Wallet deleted successfully" });
});



module.exports = {
  addWalletAddress,
  getAllWalletAddress,
  updateWalletAddress,
  updateWalletAddresIcon,
  updateWalletAddresQrcode,
  deleteWalletAddress,
 
};
