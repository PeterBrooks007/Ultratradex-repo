const mongoose = require("mongoose");
const { Schema } = mongoose;

const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    typeOfDeposit: {
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
    status: {
      type: String,
      required: true,
    },
    depositProof: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
