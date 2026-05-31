const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectWallet = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a wallet name"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
  },
  { timestamps: true }
);

const ConnectWallet = mongoose.model("ConnectWallet", connectWallet);
module.exports = ConnectWallet;
