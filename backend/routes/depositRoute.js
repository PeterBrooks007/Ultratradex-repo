const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  depositFund,
  getUserDeposithistory,
  requestDepositDetails,
  getAllPendingDepositRequest,
  approveDepositRequest,
  deleteDepositRequest,
  adminGetUserDeposithistory,
  adminAddTradeHistoryToUser,
} = require("../controllers/depositController");
const { approveDepositRequestValidator } = require("../validators/depositValidator");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// router.post("/depositFund", protect, depositFund);

router.post("/depositFund", protect, upload.single("image"),(req, res, next) => {
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
}, depositFund);


router.get("/getUserDeposithistory", protect, getUserDeposithistory);

router.get("/adminGetUserDeposithistory/:id", protect, adminGetUserDeposithistory);

router.post("/requestDepositDetails", protect, requestDepositDetails);

router.get("/getAllPendingDepositRequest", protect, adminOnly, getAllPendingDepositRequest);

router.patch("/approveDepositRequest/:id", protect, adminOnly,approveDepositRequestValidator, approveDepositRequest);

router.delete("/deleteDepositRequest/:id", protect, deleteDepositRequest);

router.get("/adminGetUserDeposithistory/:id", protect, adminGetUserDeposithistory);

router.post("/adminAddTradeHistoryToUser", protect, adminAddTradeHistoryToUser);


module.exports = router;
