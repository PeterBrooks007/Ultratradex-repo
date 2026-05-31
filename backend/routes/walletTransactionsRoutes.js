const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { addTransaction, getUserWalletTransactions, adminGetAllUserWalletTransactions, adminUpdateUserWalletTransaction, deleteTransaction } = require("../controllers/walletTransactionsController");
const { adminUpdateUserWalletTransactionValidator, addTransactionValidator } = require("../validators/walletTransactionsValidator");

const router = express.Router();


router.post("/addTransaction", protect, addTransactionValidator, addTransaction);

router.get("/getUserWalletTransactions", protect, getUserWalletTransactions);

router.get("/adminGetAllUserWalletTransactions/:id", protect, adminOnly, adminGetAllUserWalletTransactions);

router.patch("/adminUpdateUserWalletTransaction/:id", protect, adminOnly, adminUpdateUserWalletTransactionValidator, adminUpdateUserWalletTransaction);

router.delete("/deleteTransaction/:id", protect, deleteTransaction);


module.exports = router;
