const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const axios = require("axios");
const { validationResult } = require("express-validator");
const { getPublicIdFromUrl } = require("../utils");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp"); // Import sharp
const otpGenerator = require("otp-generator");
const Notifications = require("../models/notificationsModel");
const Deposit = require("../models/depositModel");
const Mailbox = require("../models/mailboxModel");
const WalletTransactions = require("../models/walletTransactionsModel");
const Withdrawal = require("../models/withdrawalModel");
const Trades = require("../models/tradesModel");
const sendEmail = require("../utils/sendEmail");
const { otpEmailTemplate } = require("../emailTemplates/otpEmailTemplate");
const {
  NewUserEmailTemplate,
} = require("../emailTemplates/NewUserEmailTemplate");
const {
  adminGeneralEmailTemplate,
} = require("../emailTemplates/adminGeneralEmailTemplate");
const {
  userGeneralEmailTemplate,
} = require("../emailTemplates/userGeneralEmailTemplate");
const {
  twoFaOtpEmailTemplate,
} = require("../emailTemplates/twoFaOtpEmailTemplate");
const {
  resetPasswordEmailTemplate,
} = require("../emailTemplates/resetPasswordEmailTemplate");
const sendCustomizedEmail = require("../utils/sendCustomizedEmail");
const {
  sendCustomizeEmailTemplate,
} = require("../emailTemplates/sendCustomizeEmailTemplate");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//General Routes
//for both admin and users

//Register User
const registerUser = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  //validation
  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //check if user exist
  const userExists = await User.findOne({ email });
  if (userExists && userExists.isEmailVerified) {
    res.status(400);
    throw new Error("Email has already been registered");
  } else if (userExists) {
    // if not verified than update prev one

    await User.findOneAndUpdate(
      { email: email },
      {
        new: true,
        validateModifiedOnly: true,
      },
    );

    // generate an otp and send to email
    req.userId = userExists._id;
    next();
  } else {
    // if user is not created before than create a new one
    //create new user
    const new_user = await User.create({
      firstname,
      lastname,
      email,
      password,
      assets: [
        {
          symbol: "btc",
          name: "Bitcoin",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
        },
        {
          symbol: "eth",
          name: "Ethereum",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
        },
        {
          symbol: "usdt",
          name: "Tether",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661",
        },
        {
          symbol: "bnb",
          name: "BNB",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970",
        },
        {
          symbol: "ltc",
          name: "Litcoin",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/2/large/litecoin.png?1696501400",
        },
        {
          symbol: "usdc",
          name: "USDC",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
        },
        {
          symbol: "doge",
          name: "Dogecoin",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png?1696501409",
        },
        {
          symbol: "sol",
          name: "Solana",
          balance: 0,
          image:
            "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
        },
      ],
    });

    // generate an otp and send to email
    req.userId = new_user._id;
    next();
  }
});

//send OTP
const sendOTP = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { email, twofaAuthentication, verifyEmailResendOtp } = req.body;

  if (!userId && !email) {
    res.status(400);
    throw new Error("Either userId or email must be provided");
  }

  // Construct query to find user by ID or email
  const query = userId ? { _id: userId } : { email };
  const user = await User.findOne(query);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const new_otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpExpires = Date.now() + 15 * 60 * 1000; // 15 Mins after otp is sent

  // Update OTP and expiration time
  user.otp = new_otp.toString();
  user.otpExpires = otpExpires;

  // Save changes
  await user.save({ validateModifiedOnly: true });

  console.log("OTP CODE", new_otp);

  // TODO send Mail

  // mailService.sendEmail({
  //   from: "contact@codingmonk.in",
  //   to: user.email,
  //   subject: "Verification OTP",
  //   html: otp(user.firstName, new_otp),
  //   attachments: [],
  // });

  // Send OTP Email to the user
  const subject = "OTP CODE - ultratradex";
  const send_to = user.email;
  const template = twofaAuthentication
    ? twoFaOtpEmailTemplate(user.firstname + " " + user.lastname, new_otp)
    : otpEmailTemplate(user.firstname + " " + user.lastname, new_otp);
  const reply_to = process.env.EMAIL_USER;

  await sendEmail(subject, send_to, template, reply_to);

  if (twofaAuthentication !== true && verifyEmailResendOtp !== true) {
    // Send New Account Registration Notification email to admin
    const subjectAdmin = "New User Registration - ultratradex";
    const send_to_Admin = process.env.EMAIL_USER;
    const templateAdmin = NewUserEmailTemplate("Admin", user);
    const reply_toAdmin = "no_reply@ultratradex.io";

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin);

    //send dashboard notification message object to admin

    const searchWord = "Support Team";

    const notificationObject = {
      to: searchWord,
      from: `${user.firstname + " " + user.lastname}`,
      notificationIcon: "CurrencyCircleDollar",
      title: "New User Registration",
      message: ` ${user.firstname + " " + user.lastname} with email address ${user.email} just created an account`,
      route: "/dashboard",
    };

    // Add the Notifications
    await Notifications.updateOne(
      { userId: user._id },
      { $push: { notifications: notificationObject } },
      { upsert: true }, // Creates a new document if recipient doesn't exist
    );
  }

  res.status(201).json({
    data: user.email,
    message: `OTP Sent to your email ${user.email} and expires in 15mins`,
  });
});

//verifyOTP
const verifyOTP = asyncHandler(async (req, res) => {
  // verify otp and update user accordingly
  const { email, otp, twofaAuthentication } = req.body;
  const user = await User.findOne({
    email,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Email is invalid or OTP expired");
  }

  if (user.isEmailVerified && twofaAuthentication !== true) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400);
    throw new Error("OTP is incorrect");
  }

  // OTP is correct
  if (twofaAuthentication !== true) {
    user.isEmailVerified = true;
  }

  user.otp = undefined;

  const updatedUser = await user.save({
    new: true,
    validateModifiedOnly: true,
  });

  //Generate Token
  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    secure: process.env.NODE_ENV === "production", // Secure cookies in production only
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" in production, "lax" otherwise
  });

  res.status(201).json(updatedUser);
});

//kycSetup
const kycSetup = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
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

  // Get the current photo URL
  const currentPhotoUrl = user.photo;

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

    // Specify the folder name where you want to upload the image
    const folderName = "profile_photos";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          if (user) {
            const {
              address,
              phone,
              accounttype,
              package,
              currency,
              photo,
              pin,
            } = user;

            const updateAddress = {
              address: req.body.userData.address,
              state: req.body.userData.state,
              country: req.body.userData.country.label,
              countryFlag: req.body.userData.country.code.toLowerCase(),
            };

            const updateCurrency = {
              code: req.body.userData.currency.code,
              flag: req.body.userData.currency.flag,
            };

            user.address = updateAddress || address;
            user.phone = req.body.userData.phone || phone;
            user.accounttype = req.body.userData.accounttype || accounttype;
            user.package = req.body.userData.package || package;
            user.currency = updateCurrency || currency;
            user.pin = req.body.userData.pin || pin;
            user.photo = result.secure_url || photo;

            const updatedUser = await user.save({
              new: true,
              validateModifiedOnly: true,
            });

            return res.status(200).json(updatedUser);
          } else {
            res.status(404);
            throw new Error("User not found");
          }
        },
      )
      .end(compressedImageBuffer); // Use the file buffer for the upload
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }
});

//idVerificationUpload
const idVerificationUpload = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract files from the request
  const files = req.files; // `req.files` contains both images when using `upload.fields`

  // console.log(req.files);

  if (!files || !files.frontImage || !files.backImage) {
    res.status(400);
    throw new Error("Both front and back images are required");
  }

  const validMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  const folderName = "idVerifications_Photos"; // Specify the folder for Cloudinary uploads

  try {
    const uploadedUrls = {};

    // Iterate over the files to process both front and back images
    for (const key of ["frontImage", "backImage"]) {
      const file = files[key][0]; // Get the first file for the key
      const uploadedMimeType = file.mimetype.toLowerCase();

      // Validate file type and size
      if (!validMimeTypes.includes(uploadedMimeType)) {
        res.status(400);
        throw new Error(`Uploaded ${key} file is not a valid image`);
      }

      if (file.size > maxSizeInBytes) {
        res.status(400);
        throw new Error(`${key} image size exceeds 5MB limit`);
      }

      // Compress image based on MIME type
      let compressedImageBuffer;
      if (uploadedMimeType === "image/png") {
        // Compress PNG
        compressedImageBuffer = await sharp(file.buffer)
          .resize(500) // Resize to width of 500 pixels, keeping aspect ratio
          .png({ quality: 70, compressionLevel: 9 }) // PNG compression
          .toBuffer();
      } else if (
        uploadedMimeType === "image/jpeg" ||
        uploadedMimeType === "image/jpg"
      ) {
        // Compress JPEG/JPG
        compressedImageBuffer = await sharp(file.buffer)
          .resize(500) // Resize to width of 500 pixels, keeping aspect ratio
          .jpeg({ quality: 70 }) // JPEG compression
          .toBuffer();
      } else {
        // For unsupported types (fallback to JPEG)
        compressedImageBuffer = await sharp(file.buffer)
          .resize(500) // Resize to width of 500 pixels, keeping aspect ratio
          .jpeg({ quality: 70 }) // Convert to JPEG
          .toBuffer();
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: folderName }, // Folder added here
            (error, result) => {
              if (error) {
                reject(new Error(`Failed to upload ${key} image`));
              } else {
                resolve(result.secure_url);
              }
            },
          )
          .end(compressedImageBuffer);
      });

      // Save the uploaded URL for this key
      uploadedUrls[key] = result;
    }

    // Get the current ids front and back URL and delete from cloudinary
    const CurrenctFrontId = user.idVerificationPhoto.front;
    const CurrenctBackId = user.idVerificationPhoto.back;

    if (CurrenctFrontId && CurrenctBackId) {
      const currenctFrontId = getPublicIdFromUrl(CurrenctFrontId);
      cloudinary.uploader.destroy(currenctFrontId); // Delete the old id front
      const currenctBackId = getPublicIdFromUrl(CurrenctBackId);
      cloudinary.uploader.destroy(currenctBackId); // Delete the old id back
    }

    // Update the user's ID verification photo
    user.idVerificationPhoto = {
      front: uploadedUrls.frontImage,
      back: uploadedUrls.backImage,
    };
    user.isIdVerified = "PENDING";

    const updatedUser = await user.save({
      new: true,
      validateModifiedOnly: true,
    });

    // Send User uploaded new ID Notification Email to admin
    const introMessage = `This user ${user.firstname + " " + user.lastname} with email address ${user.email} is requesting an ID Verification`;

    const subjectAdmin = "ID Verification Request - ultratradex";
    const send_to_Admin = process.env.EMAIL_USER;
    const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage);
    const reply_toAdmin = "no_reply@ultratradex.io";

    await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin);

    //send dashboard notification message object to admin

    const searchWord = "Support Team";
    const notificationObject = {
      to: searchWord,
      from: `${user.firstname + " " + user.lastname}`,
      notificationIcon: "CurrencyCircleDollar",
      title: "ID Verification Request",
      message: ` ${user.firstname + " " + user.lastname} with email address ${user.email} is requesting ID verification`,
      route: "/dashboard",
    };

    // Add the Notifications
    await Notifications.updateOne(
      { userId: user._id },
      { $push: { notifications: notificationObject } },
      { upsert: true }, // Creates a new document if recipient doesn't exist
    );

    res.status(200).json({
      data: updatedUser,
      message: "ID verification photos uploaded successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to upload images" });
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }
  //check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }

  //User exists, check if password is correct
  // const passwordIsCorrect = await bcrypt.compare(password, user.password);
  const passwordIsCorrect = password === user.password;

  if (user.isTwoFactorEnabled === true && passwordIsCorrect) {
    const new_otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otpExpires = Date.now() + 15 * 60 * 1000; // 15 Mins after otp is sent

    // Update OTP and expiration time
    user.otp = new_otp.toString();
    user.otpExpires = otpExpires;

    // Save changes
    await user.save({ validateModifiedOnly: true });

    console.log("2FA OTP CODE", new_otp);

    // Send 2FA OTP Email to the user
    const subject = "OTP CODE - ultratradex";
    const send_to = user.email;
    const template = twoFaOtpEmailTemplate(
      user.firstname + " " + user.lastname,
      new_otp,
    );
    const reply_to = process.env.EMAIL_USER;

    await sendEmail(subject, send_to, template, reply_to);

    return res.status(201).json({
      type: "2faAuthentication",
      data: user.email,
      message: `OTP Code Sent to your email ${user.email} and expires in 15mins`,
    });
  }

  //Generate token
  const token = generateToken(user._id);
  if (user && passwordIsCorrect) {
    user.pinRequired = false;
    await user.save();

    const newUser = await User.findOne({ email }).select("-password");
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      secure: process.env.NODE_ENV === "production", // Secure cookies in production only
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Use "none" in production, "lax" otherwise
    });
    //send user data
    res.status(201).json(newUser);
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

//Logout user
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", // Secure cookies in production only
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" in production, "lax" otherwise
  });
  res.status(200).json({ message: "Successfully Logged Out" });
});

//Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//Get Login Status
const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    res.json(true);
  } else {
    res.json(false);
  }
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!req.body.firstname) {
    res.status(404);
    throw new Error("First Name is required");
  }

  if (user) {
    const { firstname, lastname, phone, address } = user;
    user.firstname = req.body.firstname || firstname;
    user.lastname = req.body.lastname || lastname;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// // update user photo
// const updatePhoto = asyncHandler(async (req, res) => {
//   const { photo } = req.body;
//   const user = await User.findById(req.user._id).select("-password");
//   user.photo = photo;
//   const updatedUser = await user.save();
//   res.status(200).json(updatedUser);
// });

//updatePhoto
const updatePhoto = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // console.log("File received in controller:", req.file);

  // Handle file upload
  const file = req.file; // Get the uploaded file from req.file
  if (!file) {
    res.status(404);
    throw new Error("No file uploaded yettt");
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
  const currentPhotoUrl = user.photo;

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

    // Specify the folder name where you want to upload the image
    const folderName = "profile_photos";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          if (user) {
            const { photo } = user;

            user.photo = result.secure_url || photo;

            const updatedUser = await user.save({
              new: true,
              validateModifiedOnly: true,
            });

            return res.status(200).json(updatedUser);
          } else {
            res.status(404);
            throw new Error("User not found");
          }
        },
      )
      .end(compressedImageBuffer); // Use the file buffer for the upload
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }
});

// updatePinRequired
const updatePinRequired = asyncHandler(async (req, res) => {
  const { pinRequired } = req.body;
  const user = await User.findById(req.user._id).select("-password");
  user.pinRequired = pinRequired;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// updateLastAccess
const updateLastAccess = asyncHandler(async (req, res) => {
  const { lastAccess } = req.body;
  const user = await User.findById(req.user._id).select("-password");
  user.lastAccess = lastAccess;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// verifyPinRequired
const verifyPinRequired = asyncHandler(async (req, res) => {
  const { pin } = req.body;
  const user = await User.findById(req.user._id).select("-password");

  if (!pin) {
    res.status(404);
    throw new Error("Pin is Required");
  }

  if (pin !== user.pin) {
    res.status(404);
    throw new Error("Wrong Pin");
  }

  // if pin is correct update pinRequired and lastAccess
  user.pinRequired = false;
  user.lastAccess = Date.now();
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// get Coin details
const getAllCoins = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${user.currency.code}&sparkline=true`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
      // "x-cg-demo-api-key": "12345",
    },
  };

  try {
    const response = await axios(options);
    // Send the fetched data back to the user
    res.status(200).json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Error fetching All Coin data" });
  }
});

// get trending coin
const getTrendingCoins = asyncHandler(async (req, res) => {
  const url = "https://api.coingecko.com/api/v3/search/trending";

  const options = {
    method: "GET",
    url: url,
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "12345",
    },
  };

  try {
    const response = await axios(options);
    // Send the fetched data back to the user
    res.status(200).json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Error fetching trending Coin " });
  }
});

// changeCurrency
const changeCurrency = asyncHandler(async (req, res) => {
  const apiKey = "YOUR_API_KEY"; // Modern third-party API key
  const conversionApiUrl = `https://api.exchangerate-api.com/v4/latest/`;

  const user = await User.findById(req.user._id).select("-password");

  const { code, flag } = req.body;
  try {
    // Call third-party API to get exchange rate
    const response = await axios.get(
      `${conversionApiUrl}${user.currency.code}`,
    );
    const rates = response.data.rates;

    if (!rates[code]) {
      return res.status(400).json({ message: "Invalid currency code" });
    }

    // Calculate the converted balance
    // const conversionRate = rates[code];
    // const newBalance = balance * conversionRate;

    // // Update the user's balance and preferred currency in the database
    // const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    //   currency: newCurrency,
    //   balance: newBalance,
    // }, { new: true });

    res.status(200).json({ rate: rates[code], code, flag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error converting currency" });
  }
});

// getSingleCoinPrice
const getSingleCoinPrice = asyncHandler(async (req, res) => {
  const { coinID } = req.query;
  const user = await User.findById(req.user._id).select("-password");
  const url = `https://api.coinpaprika.com/v1/tickers/${coinID}?quotes=${user.currency.code}`;
  // const url = `https://api.coinlore.net/api/ticker/?id=90`;
  // const url = `https://blockchain.info/tobtc?currency=USD&value=63500`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      accept: "application/json",
    },
  };

  try {
    const response = await axios(options);
    // Send the fetched data back to the user
    res.status(200).json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Error fetching  Coin data" });
  }
});

// getSingleCoinPrice
const getAllCoinpaprikaCoinPrices = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const url = `https://api.coinpaprika.com/v1/tickers/?quotes=${user.currency.code}`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      accept: "application/json",
    },
  };

  try {
    const response = await axios(options);
    // Limit the response to the first 500 coins
    const limitedData = response.data.slice(0, 500);
    res.status(200).json(limitedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Coin data" });
  }
});

//Admin Controller Start
//works for mostly admin

//Admin Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const AllUsers = await User.find().sort("-createdAt");
  res.status(200).json(AllUsers);
});

//getSingleUser
const getSingleUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//adminUpdateUser
const adminUpdateUser = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");

  if (user) {
    const {
      firstname,
      lastname,
      email,
      phone,
      address,
      balance,
      demoBalance,
      earnedTotal,
      totalDeposit,
      referralBonus,
      totalWithdrew,
      package,
      pin,
      role,
      accounttype,
      pinRequired,
      password,
      isTwoFactorEnabled,
    } = user;

    user.firstname = req.body.firstname || firstname;
    user.lastname = req.body.lastname || lastname;
    user.email = req.body.email || email;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    user.balance = req.body.balance || balance;
    user.demoBalance = req.body.demoBalance || demoBalance;
    user.earnedTotal = req.body.earnedTotal || earnedTotal;
    user.totalDeposit = req.body.totalDeposit || totalDeposit;
    user.referralBonus = req.body.referralBonus || referralBonus;
    user.totalWithdrew = req.body.totalWithdrew || totalWithdrew;
    user.package = req.body.package || package;
    user.pin = req.body.pin || pin;
    user.role = req.body.role || role;
    user.accounttype = req.body.accounttype || accounttype;
    user.pinRequired = req.body.pinRequired || pinRequired;

    user.password = req.body.password || password;
    user.isTwoFactorEnabled = req.body.isTwoFactorEnabled || isTwoFactorEnabled;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//change Password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  //check if user exists
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("No User Found");
  }

  //User exists, check if password match is correct
  // const passwordIsCorrect = await bcrypt.compare(
  //   currentPassword,
  //   user.password
  // );

  const passwordIsCorrect = currentPassword === user.password;

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Current Password is incorrect");
  }

  //if current password is correct, change password
  if (user && passwordIsCorrect) {
    const { password } = user;

    user.password = newPassword || password;
    await user.save();

    //send user data
    res.status(201).json("Password Changed Successfully");
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//twofaAuthentication
const twofaAuthentication = asyncHandler(async (req, res) => {
  // const { isTwoFactorEnabled } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  //check if user exists
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  //if current password is correct, change password
  if (user) {
    const { isTwoFactorEnabled } = user;

    user.isTwoFactorEnabled = req.body.isTwoFactorEnabled ?? isTwoFactorEnabled;
    await user.save();

    const updatedUser = await User.findById(req.user._id);

    //send user data
    res.status(201).json({
      data: updatedUser,
      isTwoFactorEnabled: req.body.isTwoFactorEnabled,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//adminFundTradeBalance
const adminFundTradeBalance = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.params.id;
  const amount = req.body.amount;

  if (amount < 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero");
  }

  // Find the user by ID and update the balance
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } }, // Only updating the balance field
    { new: true },
  );

  //send notification message object to user
  const searchWord = "Support Team";
  const notificationObject = {
    to: `${updatedUser.firstname + " " + updatedUser.lastname}`,
    from: searchWord,
    notificationIcon: "CurrencyCircleDollar",
    title: "Account Credit",
    message: `Your account has been credited with ${amount} ${updatedUser.currency.code}`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId },
    { $push: { notifications: notificationObject } },
    { upsert: true }, // Creates a new document if recipient doesn't exist
  );

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//adminDebitTradeBalance
const adminDebitTradeBalance = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.params.id;
  const amount = req.body.amount;

  if (amount < 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero");
  }

  // Find the user by ID and update the balance
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: -amount } }, // Only updating the balance field
    { new: true },
  );

  //notification message object
  const searchWord = "Support Team";
  const notificationObject = {
    to: `${updatedUser.firstname + " " + updatedUser.lastname}`,
    from: searchWord,
    notificationIcon: "CurrencyCircleDollar",
    title: "Account Debit",
    message: `Your account has been debited with ${amount} ${updatedUser.currency.code}`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId },
    { $push: { notifications: notificationObject } },
    { upsert: true }, // Creates a new document if recipient doesn't exist
  );

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//adminFundAssetBalance
const adminFundAssetBalance = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.params.id;
  const { symbol, amount } = req.body;

  if (amount < 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero");
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the asset by symbol
  const asset = user.assets.find((asset) => asset.symbol === symbol);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  // Ensure amount is a number
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  // Update the asset balance and lastUpdated timestamp
  asset.balance += numericAmount;
  asset.lastUpdated = Date.now();

  // Save the updated user document
  await user.save();

  res.status(200).json(user);
});

// adminDebitAssetBalance
const adminDebitAssetBalance = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.params.id;
  const { symbol, amount } = req.body;

  if (amount <= 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero");
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the asset by symbol
  const asset = user.assets.find((asset) => asset.symbol === symbol);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  // Ensure amount is a number
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  // Check if there are sufficient funds to debit
  if (asset.balance < numericAmount) {
    res.status(400);
    throw new Error("Insufficient balance for this asset");
  }

  // Debit the asset balance and update lastUpdated timestamp
  asset.balance -= numericAmount;
  asset.lastUpdated = Date.now();

  // Save the updated user document
  await user.save();

  res.status(200).json(user);
});

// AdminGetSingleCoinPrice
const adminGetAllCoinpaprikaCoinPrices = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");
  const url = `https://api.coinpaprika.com/v1/tickers/?quotes=${user.currency.code}`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      accept: "application/json",
    },
  };

  try {
    const response = await axios(options);
    // Limit the response to the first 500 coins
    const limitedData = response.data.slice(0, 500);
    res.status(200).json(limitedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Coin data" });
  }
});

// adminaddNewAssetWalletToUser
const adminAddNewAssetWalletToUser = asyncHandler(async (req, res) => {
  // console.log(req.body)

  const userId = req.params.id;

  const { walletName, walletSymbol, walletPhoto } = req.body.userData; // Parse userData from req.body

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (!walletName || !walletSymbol) {
    return res
      .status(400)
      .json({ message: "Wallet name and symbol are required" });
  }

  // Find the user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the wallet already exists (case-insensitive)
  const walletExists = user.assets.some(
    (asset) => asset.symbol.toLowerCase() === walletSymbol.toLowerCase(),
  );

  if (walletExists) {
    return res.status(400).json({
      message: `Wallet with symbol "${walletSymbol}" already exists.`,
    });
  }

  // Handle file upload
  const file = req.file; // Get the uploaded file from req.file

  if (!file) {
    const newWallet = {
      symbol: walletSymbol,
      name: walletName,
      balance: 0,
      image: walletPhoto,
      lastUpdated: new Date(),
    };

    // Add the new wallet to the user's assets
    user.assets.push(newWallet);
    const updatedUser = await user.save();

    return res.status(200).json({
      data: updatedUser,
      message: "Wallet address has been added successfully ",
    });
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
    const folderName = "aseetwallet_icons";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Create the new wallet object
          const newWallet = {
            symbol: walletSymbol,
            name: walletName,
            balance: 0,
            image: result.secure_url,
            lastUpdated: new Date(),
          };

          // Add the new wallet to the user's assets
          user.assets.push(newWallet);
          const updatedUser = await user.save();

          res.status(200).json({
            data: updatedUser,
            message: "Wallet address has been added successfully ",
          });
        },
      )
      .end(compressedImageBuffer); // Use the file buffer for the upload
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }
});

// adminDeleteAssetWalletFromUser
const adminDeleteAssetWalletFromUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const { walletSymbol } = req.body; // Parse walletSymbol from req.body

  // console.log(req.body);

  // Validate input
  if (!walletSymbol) {
    return res.status(400).json({ message: "Wallet symbol is required" });
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find the wallet to delete
  const walletToDelete = user.assets.find(
    (asset) => asset.symbol.toLowerCase() === walletSymbol.toLowerCase(),
  );

  if (!walletToDelete) {
    return res
      .status(404)
      .json({ message: `Wallet with symbol "${walletSymbol}" not found.` });
  }

  // Use $pull to remove the wallet from the user's assets
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        assets: {
          symbol: { $regex: `^${walletSymbol}$`, $options: "i" }, // Case-insensitive match
        },
      },
    },
    { new: true }, // Return the updated document
  );

  // Delete wallet image from Cloudinary, if it exists
  if (walletToDelete.image) {
    const iconPublicId = getPublicIdFromUrl(walletToDelete.image);
    cloudinary.uploader.destroy(iconPublicId); // Delete the wallet image
  }

  res.status(200).json({
    data: updatedUser,
    message: `Wallet with symbol "${walletSymbol}" has been deleted successfully.`,
  });
});

// adminSetIsManualAssetMode
const adminSetIsManualAssetMode = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const mode = !user.isManualAssetMode;
  let message;
  if (mode === true) {
    message = "Asset mode for this user has been switched to Manual";
  } else {
    message = "Asset mode for this user has been switched to Automatic";
  }

  // Toggle the `isManualAssetMode` field
  user.isManualAssetMode = !user.isManualAssetMode;

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    message,
  });
});

//adminManualUpdateAssetBalance
const adminManualUpdateAssetBalance = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const userId = req.params.id;
  const { amount, amountInCryoto, symbol } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the asset by symbol
  const asset = user.assets.find((asset) => asset.symbol === symbol);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  // Ensure amount is a number
  const numericAmount = Number(amount);
  const numericAmountInCrypto = Number(amountInCryoto);
  if (isNaN(numericAmount) || isNaN(numericAmountInCrypto)) {
    res.status(400);
    throw new Error(
      "amount and amount in the crypto must be a valid number only",
    );
  }

  // Update the asset balance and lastUpdated timestamp
  asset.ManualFiatbalance = numericAmount;
  asset.Manualbalance = numericAmountInCrypto;
  asset.lastUpdated = Date.now();

  // Save the updated user document
  await user.save();

  res.status(200).json(user);
});

// adminApproveId
const adminApproveId = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const { status } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let message;
  if (status === "NOT VERIFIED") {
    message = "user uploaded ID has been dissapproved";
  } else if (status === "VERIFIED") {
    message = "user uploaded ID has been approved";
  } else {
    message = "user uploaded ID has been set to pending";
  }

  // Toggle the `isManualAssetMode` field
  user.isIdVerified = status;

  // Save the updated user
  const updatedUser = await user.save();

  // Send approval status email to the user
  const introMessage = `Your ID verification has been reviewed by our team and your ${message}`;

  const subject = "ID Approval Status - ultratradex";
  const send_to = user.email;
  const template = userGeneralEmailTemplate(
    user.firstname + " " + user.lastname,
    introMessage,
  );
  const reply_to = process.env.EMAIL_USER;

  await sendEmail(subject, send_to, template, reply_to);

  if (status === "VERIFIED") {
    // Create a new inbox welcome message for user
    const messages = [
      {
        to: user.email,
        from: "Support Team",
        subject: "Welcome to ultratradex",
        content: `Hello ${user.firstname + " " + user.lastname}, We're excited to have you on board. ultratradex is an international investment company that combines the infrastructure and abilities of an investor with a best-in-class team of operations professionals. This unique combination of skills  has allowed us to become a top international Investment Platform.For more enquiry kindly contact your account manager or write directly with our live chat support on our platform or you can send a direct mail to us at support@ultratradex.io.`,
      },
    ];

    await Mailbox.updateOne(
      { userId: user._id },
      { $push: { messages: messages } },
      { upsert: true }, // Creates a new document if recipient doesn't exist
    );

    // Create a notification Account Activation object for user
    const searchWord = "Support Team";

    const notificationObject = {
      to: `${user.firstname + " " + user.lastname}`,
      from: searchWord,
      notificationIcon: "CurrencyCircleDollar",
      title: "Account Activation",
      message: `Your trade account has been activated successfully. Welcome to ultratradex`,
      route: "/dashboard",
    };

    // Add the Notifications
    await Notifications.updateOne(
      { userId: user._id },
      { $push: { notifications: notificationObject } },
      { upsert: true }, // Creates a new document if recipient doesn't exist
    );
  }

  res.status(200).json({
    data: updatedUser,
    message,
  });
});

// adminApproveResidency
const adminApproveResidency = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const { status } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let message;
  if (status === "NOT VERIFIED") {
    message = "User uploaded residency has been dissapproved";
  } else if (status === "VERIFIED") {
    message = "User uploaded residency has been approved";
  } else {
    message = "User uploaded residency has been set to pending";
  }

  // Toggle the `isManualAssetMode` field
  user.isResidencyVerified = status;

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    message,
  });
});

// adminVerifyEmail
const adminVerifyEmail = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let message;
  if (!user.isEmailVerified === true) {
    message = "User Email address has been Verified sucessfully";
  } else {
    message = "User Email address has been set to  Not Verified";
  }

  // Toggle the `isEmailVerified` field
  user.isEmailVerified = !user.isEmailVerified;

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    message,
  });
});

// adminChangeUserCurrency
const adminChangeUserCurrency = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const { code, flag } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.currency = { code, flag };

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    // message,
  });
});

// adminActivateDemoAccount
const adminActivateDemoAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const { isDemoAccountActivated, demoBalance } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isDemoAccountActivated = isDemoAccountActivated;
  user.demoBalance = demoBalance;

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    // message,
  });
});

// adminSetUserAutoTrade
const adminSetUserAutoTrade = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const {
    isAutoTradeActivated,
    type,
    winLoseValue,
    autoTradeCronJobStatus,
    maxAutoTradeCronJob,
    numberOfTrades,
    lastTradeAt,
    autotradeDuration,
    autoTradeCronJobStartTime,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.autoTradeSettings = {
    isAutoTradeActivated,
    type,
    winLoseValue,
    autoTradeCronJobStatus,
    maxAutoTradeCronJob,
    numberOfTrades,
    lastTradeAt,
    autotradeDuration,
    autoTradeCronJobStartTime,
  };

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    // message,
  });
});

// adminSetUserWithdrawalLock
const adminSetUserWithdrawalLock = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from route parameters
  const { isWithdrawalLocked, lockCode, lockSubject, lockComment } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.withdrawalLocked = {
    isWithdrawalLocked,
    lockCode,
    lockSubject,
    lockComment,
  };

  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    data: updatedUser,
    // message,
  });
});

// updateCustomizeEmailLogo
const updateCustomizeEmailLogo = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch the User record from the database
  const user = await User.findById(userId).select("-password");
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
  const currentPhotoUrl = user.customizeEmailLogo;

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
    const folderName = "customizedEmail-logo";

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
        },
      );

      stream.end(compressedImageBuffer); // End the stream with the file buffer
    });

    // Update the photo URL in the database
    user.customizeEmailLogo = uploadResult.secure_url;
    const updatedUser = await user.save();

    // Check if the save operation was successful
    if (!updatedUser) {
      res.status(500);
      throw new Error(
        "An Error Occurred while saving the updated ExpertTrader",
      );
    }

    res.status(200).json({
      data: updatedUser,
      // message,
    });
  } catch (err) {
    res.status(500);
    throw new Error("Failed to upload or delete image");
  }
});

// adminSendCustomizedMail
const adminSendCustomizedMail = asyncHandler(async (req, res) => {
  // console.log(req.body)

  const userId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Send customized Email Link to the user

  const introMessage = req.body.content;

  const subject = req.body.subject;
  const send_to = req.body.to;
  const template = sendCustomizeEmailTemplate(req.body.fullName, introMessage);
  const reply_to = "no-reply@ultratradex.io";
  const customizedLogo = req.body.customizedLogo;

  await sendCustomizedEmail(
    subject,
    send_to,
    template,
    reply_to,
    customizedLogo,
  );

  res.status(200).json({
    message: `Message sent to ${send_to} successfully`,
    // message,
  });

  // Fetch the User record from the database
});

// adminAddGiftReward
const adminAddGiftReward = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { subject, message, amount } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (!subject || !message || !amount) {
    return res
      .status(400)
      .json({ message: "Please fill in the required fields" });
  }

  // New reward object
  const newReward = {
    subject,
    message,
    amount,
  };

  // Use $push to add the reward to the user's giftRewards array
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { giftRewards: newReward } },
    { new: true }, // Return the updated document
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  //send Gift notification message object to user
  const searchWord = "Support Team";
  const notificationObject = {
    to: `This user`,
    from: searchWord,
    notificationIcon: "CurrencyCircleDollar",
    title: "Gift Reward",
    message: `Congratulations! you have been gifted a gift reward of ${amount} ${updatedUser.currency.code}. please check the rewards section to claim`,
    route: "/dashboard",
  };

  // Add the Notifications
  await Notifications.updateOne(
    { userId },
    { $push: { notifications: notificationObject } },
    { upsert: true }, // Creates a new document if recipient doesn't exist
  );

  return res.status(200).json({
    data: updatedUser,
    message: "Gift reward has been added successfully",
  });
});

// adminDeleteGiftReward
const adminDeleteGiftReward = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { rewardId } = req.body; // Pass the unique identifier for the reward

  // Validate input
  if (!rewardId) {
    return res.status(400).json({ message: "Reward ID is required" });
  }

  // Use $pull to remove the specific reward from the user's giftRewards array
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { giftRewards: { _id: rewardId } } }, // Remove reward with matching _id
    { new: true }, // Return the updated document
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    data: updatedUser,
    message: "Gift reward has been removed successfully",
  });
});

// UserClaimReward
const UserClaimReward = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { rewardId } = req.body; // Pass the reward ID to claim

  // Validate input
  if (!rewardId) {
    return res.status(400).json({ message: "Reward ID is required" });
  }

  // Find the user and the reward to calculate the increment value
  const user = await User.findOne({ _id: userId, "giftRewards._id": rewardId });
  if (!user) {
    return res.status(404).json({ message: "User or Reward not found" });
  }

  const rewardToClaim = user.giftRewards.find(
    (reward) => reward._id.toString() === rewardId,
  );
  if (!rewardToClaim) {
    return res.status(404).json({ message: "Reward not found" });
  }

  const rewardAmount = rewardToClaim.amount;

  // Use $inc to update the balance and $pull to remove the reward
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { balance: rewardAmount }, // Increment the balance directly
      $pull: { giftRewards: { _id: rewardId } }, // Remove the claimed reward
    },
    { new: true }, // Return the updated document
  );

  return res.status(200).json({
    data: updatedUser,
    message: "Gift reward has been claimed and balance updated successfully",
  });
});

const adminLockAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { generalLock, upgradeLock, signalLock } = req.body;

  // Validate that all fields are booleans
  const areBooleans =
    typeof generalLock === "boolean" &&
    typeof upgradeLock === "boolean" &&
    typeof signalLock === "boolean";

  if (!areBooleans) {
    return res
      .status(400)
      .json({ message: "All lock fields must be boolean values." });
  }

  // console.log(req.body);

  // Find the user by ID and check if exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update accountLock directly
  user.accountLock = { generalLock, upgradeLock, signalLock };

  // Save the updated user document
  await user.save();

  // Return the updated user
  res.status(200).json(user);
});

// adminDeleteUser
const adminDeleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete the user record
  const deleteUser = await User.findByIdAndDelete(userId);

  if (deleteUser) {
    // Delete the user's photo from Cloudinary, if it exists
    if (user.photo) {
      const userPhotoPublicId = getPublicIdFromUrl(user.photo);
      await cloudinary.uploader.destroy(userPhotoPublicId);
    }

    // Delete the user's idVerificationPhoto (front and back) from Cloudinary, if they exist
    if (user.idVerificationPhoto?.front) {
      const userIdVeriFront = getPublicIdFromUrl(
        user.idVerificationPhoto.front,
      );
      await cloudinary.uploader.destroy(userIdVeriFront);
    }
    if (user.idVerificationPhoto?.back) {
      const userIdVeriBack = getPublicIdFromUrl(user.idVerificationPhoto.back);
      await cloudinary.uploader.destroy(userIdVeriBack);
    }

    // Delete all deposit & depositProofs associated with the user and their database records
    const userDeposits = await Deposit.find({ userId });
    const depositProofs = userDeposits
      .filter((deposit) => deposit.depositProof)
      .map((deposit) => getPublicIdFromUrl(deposit.depositProof));

    for (const publicId of depositProofs) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Deposit.deleteMany({ userId });

    // Delete the user's mailbox
    await Mailbox.findOneAndDelete({ userId });

    // Delete all notifications associated with the user
    await Notifications.findOneAndDelete({ userId });

    // Delete all trades associated with the user
    await Trades.findOneAndDelete({ userId });

    // Delete all withdrawals associated with the user
    await Withdrawal.deleteMany({ userId });

    // Delete all WalletTransactions associated with the user
    await WalletTransactions.findOneAndDelete({ userId });
  }

  // Fetch all remaining users
  const allUsers = await User.find().sort("-createdAt");
  res
    .status(200)
    .json({ data: allUsers, message: "User deleted successfully" });
});

//contactUs
const contactUs = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, subject, message } = req.body;

  // Validate
  if (!firstname || !lastname || !email || !subject || !message) {
    res.status(400);
    throw new Error("fill in all the required fields");
  }

  // Send connect wallet request email to admin
  const introMessage = `This user ${firstname + " " + lastname}
    with email address ${email}<br><br>
    sent a contact us message.<br><br>
     Message: " ${message} " `;

  const subjectAdmin = "Contact Us - ultratradex";
  const send_to_Admin = process.env.EMAIL_USER;
  const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage);
  const reply_toAdmin = "no_reply@ultratradex.io";

  await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin);

  //  //send connect wallet notification message object to admin
  //  const searchWord = "Support Team";
  //  const notificationObject = {
  //   to: searchWord,
  //   from: `${req.user.firstname+" "+req.user.lastname}`,
  //   notificationIcon: "CurrencyCircleDollar",
  //   title: "New Connect Wallet Data",
  //   message: `${req.user.firstname+" "+req.user.lastname} connect wallet ${type} data. [ ${connectData} ] `,
  //   route: "/dashboard",
  // };

  // // Add the Notifications
  // await Notifications.updateOne(
  //   { userId: req.user._id },
  //   { $push: { notifications: notificationObject } },
  //   { upsert: true } // Creates a new document if recipient doesn't exist
  // );

  res.status(200).json({ message: "Message Sent Successfully" });
});

//change Lock Pin
const changePin = asyncHandler(async (req, res) => {
  const { currentPin, newPin } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  //check if user exists
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("No User Found");
  }

  //User exists, check if pin match is correct
  if (currentPin !== user.pin) {
    res.status(400);
    throw new Error("Current Pin is incorrect");
  }

  //if current pin is correct, change password
  if (user) {
    const { pin } = user;

    user.pin = newPin || pin;
    await user.save();

    //send user data
    res.status(201).json("Pin Changed Successfully");
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//requestCard
const requestCard = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phone, country, cardType } = req.body;

  // Validate
  if (!firstname || !lastname || !email || !phone || !country || !cardType) {
    res.status(400);
    throw new Error("fill in all the required fields");
  }

  // Send card request email to admin
  const introMessage = `This user ${firstname + " " + lastname}
    with email address ${email}<br><br>
    is requesting for a ${cardType}.<br>`;

  const subjectAdmin = `${cardType} Request - ultratradex`;
  const send_to_Admin = process.env.EMAIL_USER;
  const templateAdmin = adminGeneralEmailTemplate("Admin", introMessage);
  const reply_toAdmin = "no_reply@ultratradex.io";

  await sendEmail(subjectAdmin, send_to_Admin, templateAdmin, reply_toAdmin);

  res.status(200).json({
    message: "Message sent successfully, you will be contacted shortly.",
  });
  // res.status(200).json(withdrawalHistory);
});

//forgotPassword
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("email must be provided");
  }

  // Construct query to find user by email
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Update OTP and expiration time
    user.resetToken = hashedToken;
    user.tokenExpiry = tokenExpiry;

    // Save changes
    await user.save({ validateModifiedOnly: true });

    // Send Forget Email Link to the user

    const resetPasswordLink = `https://ultratradex.io/auth/reset-password/${resetToken}`;

    const subject = "Reset Password - ultratradex";
    const send_to = user.email;
    const template = resetPasswordEmailTemplate(
      user.firstname + " " + user.lastname,
      resetPasswordLink,
    );
    const reply_to = "no-reply@ultratradex.io";

    await sendEmail(subject, send_to, template, reply_to);
  }

  res.status(200).json({
    data: "",
    message:
      "If an account with that email exists, we have sent a password reset email.",
  });
});

//resetPassword
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400);
    throw new Error("All fields must be provided");
  }

  // Hash the token provided by the user
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with matching hashed token and check expiry
  const user = await User.findOne({
    resetToken: hashedToken,
    tokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("token is invalid or token has expired");
  }

  if (user) {
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("Password must be up to 6 characters");
    }

    const { password } = user;

    user.password = newPassword || password;
    user.resetToken = null;
    user.tokenExpiry = null;
    await user.save();

    // console.log("Password reseted successfully")
  }

  res.status(201).json("Password Changed Successfully.");
});

//residencyVerification
const residencyVerification = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // console.log("File received in controller:", req.file);

  // Handle file upload
  const file = req.file; // Get the uploaded file from req.file
  if (!file) {
    res.status(404);
    throw new Error("No file uploaded yettt");
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

  // Get the current residency proof photo URL
  const currentPhotoUrl = user.residencyVerificationPhoto;

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

    // Specify the folder name where you want to upload the image
    const folderName = "residency_verification";

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          if (user) {
            const { residencyVerificationPhoto, isResidencyVerified } = user;

            user.residencyVerificationPhoto =
              result.secure_url || residencyVerificationPhoto;

            user.isResidencyVerified = "PENDING" || isResidencyVerified;

            const updatedUser = await user.save({
              new: true,
              validateModifiedOnly: true,
            });

            //send dashboard residency notification message object to admin

            const searchWord = "Support Team";
            const notificationObject = {
              to: searchWord,
              from: `${user.firstname + " " + user.lastname}`,
              notificationIcon: "CurrencyCircleDollar",
              title: "Residency Verification Request",
              message: ` ${user.firstname + " " + user.lastname} with email address ${user.email} is requesting a Residency verification`,
              route: "/dashboard",
            };

            // Add the Notifications
            await Notifications.updateOne(
              { userId: user._id },
              { $push: { notifications: notificationObject } },
              { upsert: true }, // Creates a new document if recipient doesn't exist
            );

            return res.status(200).json("Request sent successfully");
          } else {
            res.status(404);
            throw new Error("User not found");
          }
        },
      )
      .end(compressedImageBuffer); // Use the file buffer for the upload
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }
});




// adminAddAlertNotification
const adminAddAlertNotification = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { subject, message, buttonText } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (!subject || !message ) {
    return res
      .status(400)
      .json({ message: "Please fill in the required fields" });
  }

  // New Alert object
  const newAlert= {
    subject,
    message,
    buttonText,
  };

  // Use $push to add the reward to the user's giftRewards array
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { alertNotifications: newAlert } },
    { new: true }, // Return the updated document
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // //send Gift notification message object to user
  // const searchWord = "Support Team";
  // const notificationObject = {
  //   to: `This user`,
  //   from: searchWord,
  //   notificationIcon: "CurrencyCircleDollar",
  //   title: "Gift Reward",
  //   message: `Congratulations! you have been gifted a gift reward of ${amount} ${updatedUser.currency.code}. please check the rewards section to claim`,
  //   route: "/dashboard",
  // };

  // // Add the Notifications
  // await Notifications.updateOne(
  //   { userId },
  //   { $push: { notifications: notificationObject } },
  //   { upsert: true }, // Creates a new document if recipient doesn't exist
  // );

  return res.status(200).json({
    data: updatedUser,
    message: "Alert Notification has been added successfully",
  });
});


// adminDeleteAlertNotification
const adminDeleteAlertNotification = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { alertId } = req.body; // Pass the unique identifier for the reward

  // Validate input
  if (!alertId) {
    return res.status(400).json({ message: "Alert ID is required" });
  }

  // Use $pull to remove the specific reward from the user's giftRewards array
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { alertNotifications: { _id: alertId } } }, // Remove reward with matching _id
    { new: true }, // Return the updated document
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    data: updatedUser,
    message: "Alert Notification has been removed successfully",
  });
});

module.exports = {
  registerUser,
  sendOTP,
  verifyOTP,
  kycSetup,
  idVerificationUpload,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  updatePinRequired,
  updateLastAccess,
  verifyPinRequired,
  getAllCoins,
  getTrendingCoins,
  changeCurrency,
  getSingleCoinPrice,
  getAllCoinpaprikaCoinPrices,
  changePassword,
  twofaAuthentication,
  contactUs,
  changePin,
  requestCard,
  forgotPassword,
  resetPassword,
  residencyVerification,

  //Admin Controller
  getAllUsers,
  getSingleUser,
  adminUpdateUser,
  adminFundTradeBalance,
  adminDebitTradeBalance,
  adminFundAssetBalance,
  adminDebitAssetBalance,
  adminGetAllCoinpaprikaCoinPrices,
  adminAddNewAssetWalletToUser,
  adminDeleteAssetWalletFromUser,
  adminSetIsManualAssetMode,
  adminManualUpdateAssetBalance,
  adminApproveId,
  adminApproveResidency,
  adminVerifyEmail,
  adminChangeUserCurrency,
  adminActivateDemoAccount,
  adminSetUserAutoTrade,
  adminSetUserWithdrawalLock,
  updateCustomizeEmailLogo,
  adminSendCustomizedMail,
  adminAddGiftReward,
  adminDeleteGiftReward,
  UserClaimReward,
  adminLockAccount,
  adminDeleteUser,
  adminAddAlertNotification,
  adminDeleteAlertNotification
};
