const express = require("express");
const multer = require('multer');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  updatePinRequired,
  verifyPinRequired,
  updateLastAccess,
  getAllCoins,
  getTrendingCoins,
  changeCurrency,
  getSingleCoinPrice,
  getAllCoinpaprikaCoinPrices,
  getAllUsers,
  getSingleUser,
  adminUpdateUser,
  changePassword,
  twofaAuthentication,
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
  sendOTP,
  verifyOTP,
  kycSetup,
  idVerificationUpload,
  adminDeleteUser,
  contactUs,
  changePin,
  requestCard,
  forgotPassword,
  resetPassword,
  residencyVerification,

} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { changePasswordValidator, twofaAuthenticationValidator, adminUpdateUserValidator, adminFundTradeBalanceValidator, adminAddNewAssetWalletToUserValidator, adminApproveIdValidator, adminChangeUserCurrencyValidator, adminActivateDemoAccountValidator, adminSetUserAutoTradeValidator, adminSetUserWithdrawalLockValidator, adminSendCustomizedMailValidator, adminAddGiftRewardValidator, kycSetupValidator, changePinValidator } = require("../validators/userValidator");

const upload = multer({ storage: multer.memoryStorage() });

const uploadMultiple = multer({
  storage: multer.memoryStorage(), // You can use memoryStorage or switch to diskStorage as needed
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (validImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
    }
  },
});


router.post("/register", registerUser, sendOTP);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

router.post("/kycSetup", protect, upload.single("image"),(req, res, next) => {
  // Parse the userData string back into an object
  if (req.body.userData) {
    try {
      req.body.userData = JSON.parse(req.body.userData);
      // console.log(req.body.userData)
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data format");
    }
  }

  next();
},  kycSetupValidator, protect, kycSetup);


router.post(
  "/idVerificationUpload",
  protect,
  uploadMultiple.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    if (req.body.userData) {
      try {
        req.body.userData = JSON.parse(req.body.userData);
      } catch (error) {
        res.status(400);
        throw new Error("Invalid user data format");
      }
    }
    next();
  },
  idVerificationUpload
);



router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getUser", protect, getUser);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);

router.patch("/updatePhoto", protect, upload.single('image'), updatePhoto);


router.patch("/updatePinRequired", protect, updatePinRequired);
router.patch("/updateLastAccess", protect, updateLastAccess);
router.patch("/verifyPinRequired", protect, verifyPinRequired);

router.get("/getAllCoins", protect, getAllCoins);
router.get("/getTrendingCoins", protect, getTrendingCoins);
router.get("/getSingleCoinPrice", protect, getSingleCoinPrice);
router.get("/getAllCoinpaprikaCoinPrices", protect, getAllCoinpaprikaCoinPrices);

router.patch("/changeCurrency", protect, changeCurrency);

router.patch("/changePassword", protect, changePasswordValidator, changePassword);

router.patch("/twofaAuthentication", protect, twofaAuthenticationValidator, twofaAuthentication);



//admin routes
router.get("/getAllUsers", protect, adminOnly, getAllUsers);
router.get("/getSingleUser/:id", protect, adminOnly, getSingleUser);
router.patch("/adminUpdateUser/:id", protect, adminOnly, adminUpdateUserValidator, adminUpdateUser);

router.patch("/adminFundTradeBalance/:id", protect, adminOnly, adminFundTradeBalanceValidator, adminFundTradeBalance);

router.patch("/adminDebitTradeBalance/:id", protect, adminOnly, adminFundTradeBalanceValidator, adminDebitTradeBalance);


router.patch("/adminFundAssetBalance/:id", protect, adminOnly, adminFundTradeBalanceValidator, adminFundAssetBalance);

router.patch("/adminDebitAssetBalance/:id", protect, adminOnly, adminFundTradeBalanceValidator, adminDebitAssetBalance);

router.get("/adminGetAllCoinpaprikaCoinPrices/:id", protect, adminOnly,  adminGetAllCoinpaprikaCoinPrices);

router.post("/adminAddNewAssetWalletToUser/:id", protect, adminOnly, upload.single("image"),(req, res, next) => {
  // Parse the userData string back into an object
  if (req.body.userData) {
    try {
      req.body.userData = JSON.parse(req.body.userData);
      // console.log(req.body.userData)
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data format");
    }
  }

  next();
},  adminAddNewAssetWalletToUserValidator, adminOnly, adminAddNewAssetWalletToUser);

router.delete("/adminDeleteAssetWalletFromUser/:id", protect, adminOnly, adminDeleteAssetWalletFromUser);

router.patch("/adminSetIsManualAssetMode/:id", protect, adminOnly, adminSetIsManualAssetMode);

router.patch("/adminManualUpdateAssetBalance/:id", protect, adminOnly, adminManualUpdateAssetBalance);


router.patch("/adminApproveId/:id", protect, adminOnly, adminApproveIdValidator, adminApproveId);

router.patch("/adminApproveResidency/:id", protect, adminOnly, adminApproveIdValidator, adminApproveResidency);

router.patch("/adminVerifyEmail/:id", protect, adminOnly, adminVerifyEmail);


router.patch("/adminChangeUserCurrency/:id", protect, adminOnly, adminChangeUserCurrencyValidator, adminChangeUserCurrency);

router.patch("/adminActivateDemoAccount/:id", protect, adminOnly, adminActivateDemoAccountValidator, adminActivateDemoAccount);

router.patch("/adminSetUserAutoTrade/:id", protect, adminOnly, adminSetUserAutoTradeValidator, adminSetUserAutoTrade);

router.patch("/adminSetUserWithdrawalLock/:id", protect, adminOnly, adminSetUserWithdrawalLockValidator, adminSetUserWithdrawalLock);

router.post("/updateCustomizeEmailLogo/:id", protect, adminOnly, upload.single("image"),(req, res, next) => {
  // Parse the userData string back into an object
  if (req.body.userData) {
    try {
      req.body.userData = JSON.parse(req.body.userData);
      // console.log(req.body.userData)
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data format");
    }
  }

  next();
},  adminOnly, updateCustomizeEmailLogo);

router.post("/adminSendCustomizedMail/:id", protect, adminOnly, adminSendCustomizedMailValidator, adminSendCustomizedMail);

router.patch("/adminAddGiftReward/:id", protect, adminOnly, adminAddGiftRewardValidator, adminAddGiftReward);

router.patch("/adminDeleteGiftReward/:id", protect, adminOnly, adminDeleteGiftReward);

router.patch("/UserClaimReward/:id", protect, UserClaimReward);

router.patch("/adminLockAccount/:id", protect, adminOnly, adminLockAccount);

router.delete("/adminDeleteUser/:id", protect, adminOnly, adminDeleteUser);

router.post("/contactUs", contactUs);

router.patch("/changePin", protect, changePinValidator, changePin);

router.post("/requestCard", protect, requestCard);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword", resetPassword);

router.patch("/residencyVerification", protect, upload.single('image'), residencyVerification);








module.exports = router;
