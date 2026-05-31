const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const { validationResult } = require('express-validator');
const NftSettings = require("../models/nftSettingsModel");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// addNft
const addNft = asyncHandler(async (req, res) => {
  const { nftName, nftPrice, nftCode, comment } =
   req.body.userData; // Parse userData from req.body


const errors = validationResult(req);
if (!errors.isEmpty()) {
  // console.log(errors.array()); // Log all errors for debugging
  res.status(400);
  throw new Error(errors.array()[0].msg);
}

  // Check if nft exists
  const nftExists = await NftSettings.findOne({ nftCode });
  if (nftExists) {
    res.status(400);
    throw new Error("Nft code already exist");
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
    const folderName = "nft_images";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create a new nft entry
          const newNft = await NftSettings.create({
            nftName,
            nftPrice,
            nftCode,
            comment,
            photo: result.secure_url, // Save the image URL
          });

          if (newNft) {
            const allNfts = await NftSettings.find().sort(
              "-createdAt"
            );
            res.status(200).json({
              data: allNfts,
              message: "Nft has been added successfully ",
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


//getAllNfts
const getAllNfts = asyncHandler(async (req, res) => {
  const allNfts = await NftSettings.find().sort("-createdAt");
  res.status(200).json(allNfts);
});

//updateNft
const updateNft = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const nft = await NftSettings.findById(userId).select("-password");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (nft) {
    const { nftName, nftPrice, nftCode, comment, photo } =
    nft

    nft.nftName = req.body.nftName || nftName;
    nft.nftPrice = req.body.nftPrice || nftPrice;
    nft.nftCode = req.body.nftCode || nftCode;
    nft.comment = req.body.comment || comment;
    nft.photo = req.body.photo || photo;

    const updatednft = await nft.save();
    if (updatednft) {
      const allNfts = await NftSettings.find().sort("-createdAt");
      res.status(200).json(allNfts);
    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Nft not found");
  }
});

// update nft photo
const updateNftPhoto = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch the ExpertTrader record from the database
  const nft = await NftSettings.findById(userId).select("-password");
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
  const currentPhotoUrl = nft.photo;

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
    const folderName = "nft_images";

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
    nft.photo = uploadResult.secure_url;
    const updatedNft = await nft.save();

    // Check if the save operation was successful
    if (!updatedNft) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated Nft"
      );
    }

    // Return the updated list of ExpertTraders
    const allNft = await NftSettings.find().sort("-createdAt");
    res.status(200).json(allNft);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});

// const updateExpertTraderPhoto = asyncHandler(async (req, res) => {
//   const userId = req.params.id;
//   const ExpertTrader = await ExpertTraders.findById(userId).select("-password");
//   const file = req.file;
//   if (!file) {
//     res.status(404);
//     throw new Error("No file uploaded");
//   }

//   try {
//        // Specify the folder name where you want to upload the image
//        const folderName = 'expert_traders';

//     const result = await cloudinary.uploader
//       .upload_stream({ resource_type: "auto", folder: folderName }, async (error, result) => {
//         if (error) {
//           return res.status(500).json({ error: "Image upload failed" });
//         }
//         ExpertTrader.photo = result.secure_url;
//         const updatedExpertTrader = await ExpertTrader.save();
//         if (!updatedExpertTrader) {
//           res.status(500);
//           throw new Error("An Error Occurred");
//         }
//         const allExpertTraders = await ExpertTraders.find().sort("-createdAt");
//         res.status(200).json(allExpertTraders);
//       })
//       .end(req.file.buffer);
//   } catch (err) {
//     res.status(500)
//     throw new Error("Fail to upload image");
//   }

// });

// deleteNft

const deleteNft = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const nft = await NftSettings.findById(userId);

  const deleteNft = await NftSettings.findByIdAndDelete(userId);

  if (!deleteNft) {
    res.status(404);
    throw new Error("Nft not found");
  }

  if (deleteNft) {
    // Step 2: Remove the expert trader from all users' myTraders
    await User.updateMany(
      { myNfts: userId },
      { $pull: { myNfts: userId } }
    );

    const publicId = getPublicIdFromUrl(nft.photo);
    cloudinary.uploader.destroy(publicId); // Delete the expert trader image
  }

  const allNfts = await NftSettings.find().sort("-createdAt");
  res
    .status(200)
    .json({ data: allNfts, message: "Nft deleted successfully" });
});


//userReSellNft
const userReSellNft = asyncHandler(async (req, res) => {
 
  // console.log(req.body)

  const list = await User.findOne({ email: req.body.email })
    .select("myNfts")
    .populate("myNfts");

  res
    .status(200)
    .json({
      data: list.myNfts,
      message: "Nft removed from user list",
    });
});



//getMyExpertTrader
const getMyNfts = asyncHandler(async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("myNfts")
    .populate("myNfts");

  res.status(200).json(list.myNfts);
});

//removeMyExpertTrader
// const removeFromMyExpertTrader = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   await User.findOneAndUpdate(
//     { email: req.user.email },
//     { $pull: { myTraders: id } }
//   );

//   const list = await User.findOne({ email: req.user.email })
//     .select("myTraders")
//     .populate("myTraders");

//   res
//     .status(200)
//     .json({
//       data: list.myTraders,
//       message: "Expert Trader removed from your list",
//     });
// });


//admingetUserNfts
const admingetUserNfts = asyncHandler(async (req, res) => {
  const email = req.params.email;
  const list = await User.findOne({ email: email })
    .select("myNfts")
    .populate("myNfts");

  res.status(200).json(list.myNfts);
});



//adminRemoveUserNft
const adminRemoveUserNft = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {email} = req.body;

  console.log(email)

  await User.findOneAndUpdate(
    { email: email },
    { $pull: { myNfts: id } }
  );

  const list = await User.findOne({ email: email })
    .select("myNfts")
    .populate("myNfts");

  res
    .status(200)
    .json({
      data: list.myNfts,
      message: "Nft removed from user list",
    });
});


// adminAddNftToUser
const adminAddNftToUser = asyncHandler(async (req, res) => {
  const { nftID, UserId } = req.body;

  // console.log(req.body)

  const user = await User.findById(UserId).select("-password");
  const nftExists = await NftSettings.findById(nftID);

  if (!nftExists) {
    res.status(404);
    throw new Error(
      "Nft not found or might have been removed. Refresh nft list"
    );
  }

  if (user.myNfts.includes(nftID)) {
    res.status(400);
    throw new Error("Nft already on user's list");
  }

  await user.myNfts.unshift(nftID);
  await user.save();
  const savedUser = await User.findById(UserId)
    .select("myNfts")
    .populate("myNfts");

  res
    .status(201)
    .json({ data: savedUser.myNfts, message: "Nft Added to User list" });
});






module.exports = {
  addNft,
  getAllNfts,
  updateNft,
  updateNftPhoto,
  deleteNft,
  admingetUserNfts,
  adminAddNftToUser,
  adminRemoveUserNft,
  getMyNfts,
  userReSellNft,



  // myExpertTrader,
  // removeFromMyExpertTrader,

};
