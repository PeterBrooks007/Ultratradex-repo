const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { addTrade, adminGetAllUserTrades, adminUpdateUserTrade, deleteTrade, cancelTrade, adminApproveUserTrade, autoTradeUpdate, userUpdateAdminTrade } = require("../controllers/tradesController");
const { addTradeValidator } = require("../validators/tradesValidator");

const router = express.Router();

router.post("/addTrade", protect, addTradeValidator, addTrade);

router.get("/adminGetAllUserTrades/:id", protect, adminGetAllUserTrades);

router.patch("/adminUpdateUserTrade/:id", protect, adminOnly, addTradeValidator, adminUpdateUserTrade);

router.delete("/cancelTrade/:id", protect, cancelTrade);

router.delete("/deleteTrade/:id", protect, deleteTrade);

router.patch("/adminApproveUserTrade/:id", protect, adminOnly, addTradeValidator, adminApproveUserTrade);

router.patch("/autoTradeUpdate/:id", protect, addTradeValidator, autoTradeUpdate);

router.patch("/userUpdateAdminTrade/:id", protect, addTradeValidator, userUpdateAdminTrade);



// router.get("/getAllMailInbox", protect, adminOnly, getAllMailInbox);

// router.get("/getAllMailSent", protect, adminOnly, getAllMailSent);

// router.get("/getAllMailIsStarred", protect, adminOnly, getAllMailIsStarred);

// router.get("/getUserMail", protect, getUserMail);

// router.get("/getAllUsers", protect, adminOnly, getAllUsers);

// router.delete("/adminDeleteMail", protect, adminStarredMailValidator, adminDeleteMail);

// router.patch("/adminMarkMailAsRead", protect,  adminMarkMailAsRead);

// router.patch("/adminStarredMail", protect, adminStarredMailValidator, adminStarredMail);



// router.get("/getAllPendingWithdrawalRequest", protect, adminOnly, getAllPendingWithdrawalRequest);
// router.patch("/approveWithdrawalRequest/:id", protect, adminOnly,approveWithdrawalRequestValidator, approveWithdrawalRequest);
// router.delete("/deleteWithdrawalRequest/:id", protect, adminOnly, deleteWithdrawalRequest);

module.exports = router;
