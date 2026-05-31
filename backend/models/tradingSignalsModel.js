const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradingSignals = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a firstname"],
    },
    price: {
      type: Number,
      required: [true, "Please add a Price"],
    },
    dailyTrades: {
      type: Number,
      required: [true, "Please add daily trades"],
    },
    winRate: {
      type: String,
      required: [true, "Please add a Win rate"],
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
  },
  { timestamps: true }
);

const TradingSignals = mongoose.model("TradingSignals", tradingSignals);
module.exports = TradingSignals;
