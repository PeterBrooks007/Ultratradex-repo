const mongoose = require("mongoose");
const { Schema } = mongoose;

const nftSettings = new mongoose.Schema(
  {
    nftName: {
      type: String,
      required: [true, "Please add a nftName"],
    },
    nftPrice: {
      type: Number,
      required: [true, "Please add a nftPrice"],
    },
    nftCode: {
      type: String,
      required: [true, "Please add a nftCode"],
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

const NftSettings = mongoose.model("NftSettings", nftSettings);
module.exports = NftSettings;
