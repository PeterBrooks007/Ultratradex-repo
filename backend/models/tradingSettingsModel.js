const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradingSettings = new mongoose.Schema(
  {
    exchangeType: {
      type: String,
      required: [true, "Please add a exchange type name"],
    },
    tradingPairs: {
      type: [String], // Optional array of strings for trading pairs
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    
  },
  { timestamps: true }
);

const TradingSettings = mongoose.model("TradingSettings", tradingSettings);
module.exports = TradingSettings;
