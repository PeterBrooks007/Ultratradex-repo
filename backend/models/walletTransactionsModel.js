const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    typeOfTransaction: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    methodIcon: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
    //   required: true,
    },
    description: {
      type: String,
    //   required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  
  },
  // { _id: false } // Prevents each message from having its own unique _id
);

const walletTransactionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactions: {
      type: [transactionSchema], // Array of messages
      default: [],
    },
  },
  { timestamps: true }
);

const WalletTransactions = mongoose.model("WalletTransactions", walletTransactionsSchema);
module.exports = WalletTransactions;
