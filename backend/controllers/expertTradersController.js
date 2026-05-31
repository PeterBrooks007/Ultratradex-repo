const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const axios = require("axios");
const ExpertTraders = require("../models/expertTradersModel");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const { validationResult } = require('express-validator');
const Notifications = require("../models/notificationsModel");
const { adminGeneralEmailTemplate } = require("../emailTemplates/adminGeneralEmailTemplate");
const sendEmail = require("../utils/sendEmail");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add expertTraders
const addExpertTraders = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, winRate, profitShare, comment } =
   req.body.userData; // Parse userData from req.body

  // Validate { i comment this because i am using the experttradevalidator}
  // if (
  //   !firstname ||
  //   !lastname ||
  //   !email ||
  //   !winRate ||
  //   !profitShare ||
  //   !comment
  // ) {
  //   res.status(400);
  //   throw new Error("Please fill in the required fields");
  // }

const errors = validationResult(req);
if (!errors.isEmpty()) {
  // console.log(errors.array()); // Log all errors for debugging
  res.status(400);
  throw new Error(errors.array()[0].msg);
}

  // Check if user exists
  const userExists = await ExpertTraders.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
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
    const folderName = "expert_traders";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create a new expert trader entry
          const expertTrader = await ExpertTraders.create({
            firstname,
            lastname,
            email,
            winRate,
            profitShare,
            comment,
            photo: result.secure_url, // Save the image URL
          });

          if (expertTrader) {
            const allExpertTraders = await ExpertTraders.find().sort(
              "-createdAt"
            );
            res.status(200).json({
              data: allExpertTraders,
              message: "Expert Trader has been added successfully ",
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

// const addExpertTraders = asyncHandler(async (req, res) => {
//    const { firstname, lastname, email, winRate, profitShare, comment } = JSON.parse(req.body.userData); // Parse userData from req.body

//   // Validate
//   if (
//     !firstname ||
//     !lastname ||
//     !email ||
//     !winRate ||
//     !profitShare ||
//     !comment
//   ) {
//     res.status(400);
//     throw new Error("Please fill in the required fields");
//   }

//   //check if user exist
//   const userExists = await ExpertTraders.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("Email has already been registered");
//   }

//   //Save transaction
//   const expertTrader = await ExpertTraders.create({
//     ...req.body,
//   });

//   if (expertTrader) {
//     const allExpertTraders = await ExpertTraders.find().sort("-createdAt");
//     res
//       .status(200)
//       .json({
//         data: allExpertTraders,
//         message: "Expert Trader has been added successfully ",
//       });
//   } else {
//     res.status(500).json({ message: "an error has occur" });
//   }
// });

//Get All ExpertTraders
const getAllExpertTraders = asyncHandler(async (req, res) => {
  const allExpertTraders = await ExpertTraders.find().sort("-createdAt");
  res.status(200).json(allExpertTraders);
});

//update Expert Trader
const updateExpertTrader = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const expertTrader = await ExpertTraders.findById(userId).select("-password");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (expertTrader) {
    const { firstname, lastname, email, winRate, profitShare, comment, photo } =
      expertTrader;

    expertTrader.firstname = req.body.firstname || firstname;
    expertTrader.lastname = req.body.lastname || lastname;
    expertTrader.email = req.body.email || email;

    expertTrader.winRate = req.body.winRate || winRate;
    expertTrader.profitShare = req.body.profitShare || profitShare;
    expertTrader.comment = req.body.comment || comment;
    expertTrader.photo = req.body.photo || photo;

    const updatedExpertTrader = await expertTrader.save();
    if (updatedExpertTrader) {
      const allExpertTraders = await ExpertTraders.find().sort("-createdAt");
      res.status(200).json(allExpertTraders);
    } else {
      res.status(404);
      throw new Error("An Error Occur");
    }
  } else {
    res.status(404);
    throw new Error("Expert Trader not found");
  }
});

// update ExpertTrader photo
const updateExpertTraderPhoto = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch the ExpertTrader record from the database
  const ExpertTrader = await ExpertTraders.findById(userId).select("-password");
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
  const currentPhotoUrl = ExpertTrader.photo;

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
    const folderName = "expert_traders";

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
    ExpertTrader.photo = uploadResult.secure_url;
    const updatedExpertTrader = await ExpertTrader.save();

    // Check if the save operation was successful
    if (!updatedExpertTrader) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated ExpertTrader"
      );
    }

    // Return the updated list of ExpertTraders
    const allExpertTraders = await ExpertTraders.find().sort("-createdAt");
    res.status(200).json(allExpertTraders);
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

// Delete ExpertTrader

const deleteExpertTrader = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const ExpertTrader = await ExpertTraders.findById(userId);

  const deleteExpertTrader = await ExpertTraders.findByIdAndDelete(userId);

  if (!deleteExpertTrader) {
    res.status(404);
    throw new Error("Expert Trader not found");
  }

  if (deleteExpertTrader) {
    // Step 2: Remove the expert trader from all users' myTraders
    await User.updateMany(
      { myTraders: userId },
      { $pull: { myTraders: userId } }
    );

    const publicId = getPublicIdFromUrl(ExpertTrader.photo);
    cloudinary.uploader.destroy(publicId); // Delete the expert trader image
  }

  const allExpertTraders = await ExpertTraders.find().sort("-createdAt");
  res
    .status(200)
    .json({ data: allExpertTraders, message: "Trader deleted successfully" });
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



    // Send user copy trader email to admin
    const introMessage = `This user ${user.firstname+" "+user.lastname} with email address ${user.email} just copied this trader ${expertTraderExists.firstname+" "+expertTraderExists.lastname}`

    const subjectAdmin = "New Add Copy Trader - ultratradex"
    const send_to_Admin = process.env.EMAIL_USER
    const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
    const reply_toAdmin = "no_reply@ultratradex.io"

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


   //send user copy trader notification message object to admin
   const searchWord = "Support Team";
   const notificationObject = {
    to: searchWord,
    from: `${user.firstname+" "+user.lastname}`,
    notificationIcon: "CurrencyCircleDollar",
    title: "New Add Copy Trader",
    message: `${user.firstname+" "+user.lastname} with email address ${user.email} just copied this trader ${expertTraderExists.firstname+" "+expertTraderExists.lastname}`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: user._id },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );


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

 const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { myTraders: id } }
  );

  const expertTraderExists = await ExpertTraders.findById(id);


  
    // Send user remove copy trader email to admin
    const introMessage = `This user ${user.firstname+" "+user.lastname} with email address ${user.email} just removed this trader ${expertTraderExists.firstname+" "+expertTraderExists.lastname}`

    const subjectAdmin = "New Remove Copy Trader - ultratradex"
    const send_to_Admin = process.env.EMAIL_USER
    const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage)
    const reply_toAdmin = "no_reply@ultratradex.io"

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin)


   //send user remove copy trader notification message object to admin
   const searchWord = "Support Team";
   const notificationObject = {
    to: searchWord,
    from: `${user.firstname+" "+user.lastname}`,
    notificationIcon: "CurrencyCircleDollar",
    title: "New Remove Copy Trader",
    message: `${user.firstname+" "+user.lastname} with email address ${user.email} just removed this trader ${expertTraderExists.firstname+" "+expertTraderExists.lastname}`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId: user._id },
    { $push: { notifications: notificationObject } },
    { upsert: true } // Creates a new document if recipient doesn't exist
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


//AdmingetUserExpertTrader
const admingetUserExpertTrader = asyncHandler(async (req, res) => {
  const email = req.params.email;
  const list = await User.findOne({ email: email })
    .select("myTraders")
    .populate("myTraders");

  res.status(200).json(list.myTraders);
});


//adminRemoveUserExpertTraderCopied
const adminRemoveUserExpertTraderCopied = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {email} = req.body;

  // console.log(email)

 const user = await User.findOneAndUpdate(
    { email: email },
    { $pull: { myTraders: id } }
  );

  const expertTraderExists = await ExpertTraders.findById(id);


   //send remove expert trader notification message object to user
   const searchWord = "Support Team";
   const notificationObject = {
     to: `${user.firstname+" "+user.lastname}`,
     from: searchWord,
     notificationIcon: "CurrencyCircleDollar",
     title: "Expert Trader Removed",
     message: `Expert Trader ( ${expertTraderExists.firstname+" "+expertTraderExists.lastname} ) has been removed from your account ' `,
     route: "/dashboard"
   };
 
   // Add the Notifications
   await Notifications.updateOne(
     { userId: user._id },
     { $push: { notifications: notificationObject } },
     { upsert: true } // Creates a new document if recipient doesn't exist
   ); 

  const list = await User.findOne({ email: email })
    .select("myTraders")
    .populate("myTraders");

  res
    .status(200)
    .json({
      data: list.myTraders,
      message: "Expert Trader removed from your list",
    });
});


// adminAddExpertTraderToUser
const adminAddExpertTraderToUser = asyncHandler(async (req, res) => {
  const { expertTraderID, UserId } = req.body;

  // console.log(req.body)

  const user = await User.findById(UserId).select("-password");
  const expertTraderExists = await ExpertTraders.findById(expertTraderID);

  if (!expertTraderExists) {
    res.status(404);
    throw new Error(
      "Expert Trader not found or might have been removed. Refresh traders list"
    );
  }

  if (user.myTraders.includes(expertTraderID)) {
    res.status(400);
    throw new Error("Trader already on user's list");
  }

  await user.myTraders.unshift(expertTraderID);
  await user.save();


   //send added expert trader notification message object to user
   const searchWord = "Support Team";
   const notificationObject = {
     to: `${user.firstname+" "+user.lastname}`,
     from: searchWord,
     notificationIcon: "CurrencyCircleDollar",
     title: "Expert Trader Added",
     message: `Expert Trader ( ${expertTraderExists.firstname+" "+expertTraderExists.lastname} ) has been added to your account ' `,
     route: "/dashboard"
   };
 
   // Add the Notifications
   await Notifications.updateOne(
     { userId: user._id },
     { $push: { notifications: notificationObject } },
     { upsert: true } // Creates a new document if recipient doesn't exist
   ); 


  const savedUser = await User.findById(UserId)
    .select("myTraders")
    .populate("myTraders");

  res
    .status(201)
    .json({ data: savedUser.myTraders, message: "Trader Added to your list" });
});






module.exports = {
  addExpertTraders,
  getAllExpertTraders,
  updateExpertTrader,
  updateExpertTraderPhoto,
  deleteExpertTrader,
  myExpertTrader,
  getMyExpertTrader,
  removeFromMyExpertTrader,
  admingetUserExpertTrader,
  adminRemoveUserExpertTraderCopied,
  adminAddExpertTraderToUser,
};
