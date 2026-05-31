const mongoose = require("mongoose");
const { Schema } = mongoose;

const walletAddress = new mongoose.Schema(
  {
    walletName: {
      type: String,
      required: [true, "Please add a wallet name"],
    },
    walletSymbol: {
      type: String,
      required: [true, "Please add a wallet Symbol"],
    },
    walletAddress: {
      type: String,
      required: [true, "Please add a wallet Address"],
    },
    walletQrcode: {
      type: String,
      // required: [true, "Please add a wallet Qrcode"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
      
    },
    walletPhoto: {
      type: String,
      required: [true, "Please add a wallet Photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
  },
  { timestamps: true }
);

const WalletAddress = mongoose.model("WalletAddress", walletAddress);
module.exports = WalletAddress;
