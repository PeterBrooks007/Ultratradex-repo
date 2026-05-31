const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradesSchema = new Schema(
  {
    tradingMode: {
      type: String, // Live or Demo Trade
      required: true,
    },
    exchangeType: {
      type: String, //Crypto, Forex
      required: true,
    },
    exchangeTypeIcon: {
      type: String, 
      required: true,
    },
    symbols: {
      type: String,
    },
    type: {
      type: String, //Msrket, Limit, stoplose, Take profit
    },
    buyOrSell: {
      type: String, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    ticks: {
      type: String,
    },
    risk: {
      type: String,
    },
    riskPercentage: {
      type: String,
    },
    amount: {
      type: Number,
    },
    profitOrLossAmount: {
      type: Number, 
      required: true,
    },
    open: {
      type: String,
    },
    close: {
      type: String, 
    },
    longOrShortUnit: {
      type: String, //25X, 45X etc
    },
    roi: {
      type: String, 
    },
    status: {
      type: String, 
      required: true,
    },
    expireTime: {
      type: Number, 
      required: true,
    },
    tradeFrom: {
      type: String, // admin or user 
      required: true,
    },
    isProcessed: {
      type: Boolean, 
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // { _id: false } // Prevents each message from having its own unique _id
);

const tradingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trades: {
      type: [tradesSchema], // Array of trades
      default: [],
    },
  },
  { timestamps: true }
);

const Trades = mongoose.model("Trades", tradingSchema);
module.exports = Trades;
