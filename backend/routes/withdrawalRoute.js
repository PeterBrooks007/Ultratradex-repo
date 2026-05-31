const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  withdrawFund,
  getUserWithdrawalhistory,
  getAllPendingWithdrawalRequest,
  approveWithdrawalRequest,
  deleteWithdrawalRequest,
  adminGetUserWithdrawalhistory,
} = require("../controllers/withdrawalController");
const { approveWithdrawalRequestValidator } = require("../validators/withdrawalValidator");
const router = express.Router();

router.post("/withdrawFund", protect, withdrawFund);
router.get("/getUserWithdrawalhistory", protect, getUserWithdrawalhistory);
router.get("/getAllPendingWithdrawalRequest", protect, adminOnly, getAllPendingWithdrawalRequest);
router.patch("/approveWithdrawalRequest/:id", protect, adminOnly,approveWithdrawalRequestValidator, approveWithdrawalRequest);
router.delete("/deleteWithdrawalRequest/:id", protect, deleteWithdrawalRequest);


router.get("/adminGetUserWithdrawalhistory/:id", protect, adminGetUserWithdrawalhistory);

// router.post("/adminAddTradeHistoryToUser", protect, adminAddTradeHistoryToUser);

module.exports = router;
