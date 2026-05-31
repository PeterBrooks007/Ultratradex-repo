const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { addmail, getAllMail, getAllMailInbox, getAllMailSent, getUserMail, getAllUsers, userDeleteMail, adminDeleteMail, adminMarkMailAsRead, adminStarredMail, getAllMailIsStarred } = require("../controllers/mailboxController");
const { addmailValidator, adminStarredMailValidator } = require("../validators/mailboxValidator");

const router = express.Router();

router.post("/addmail", protect, addmailValidator, addmail);

router.get("/getAllMail", protect, adminOnly, getAllMail);

router.get("/getAllMailInbox", protect, adminOnly, getAllMailInbox);

router.get("/getAllMailSent", protect, adminOnly, getAllMailSent);

router.get("/getAllMailIsStarred", protect, adminOnly, getAllMailIsStarred);

router.get("/getUserMail", protect, getUserMail);

router.get("/getAllUsers", protect, adminOnly, getAllUsers);

router.delete("/adminDeleteMail", protect, adminStarredMailValidator, adminDeleteMail);

router.patch("/adminMarkMailAsRead", protect,  adminMarkMailAsRead);

router.patch("/adminStarredMail", protect, adminStarredMailValidator, adminStarredMail);

// router.delete("/userDeleteMail/:id", protect, userDeleteMail);


// router.get("/getAllPendingWithdrawalRequest", protect, adminOnly, getAllPendingWithdrawalRequest);
// router.patch("/approveWithdrawalRequest/:id", protect, adminOnly,approveWithdrawalRequestValidator, approveWithdrawalRequest);
// router.delete("/deleteWithdrawalRequest/:id", protect, adminOnly, deleteWithdrawalRequest);

module.exports = router;
