const mongoose = require("mongoose");
const { Schema } = mongoose;

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    typeOfWithdrawal: {
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
    amount: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
    //   required: true,
    },
    bankName: {
      type: String,
    //   required: true,
    },
    bankAccount: {
      type: String,
    //   required: true,
    },
    routingCode: {
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
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
module.exports = Withdrawal;
