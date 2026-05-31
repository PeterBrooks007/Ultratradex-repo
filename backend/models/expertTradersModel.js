const mongoose = require("mongoose");
const { Schema } = mongoose;

const expertTraders = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please add a firstname"],
    },
    lastname: {
      type: String,
      required: [true, "Please add a lastname"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
        "Please enter a valid email",
      ],
    },
    winRate: {
      type: String,
      required: [true, "Please add a win rate"],
    },
    profitShare: {
      type: String,
      required: [true, "Please add a profite share"],
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

const ExpertTraders = mongoose.model("ExpertTraders", expertTraders);
module.exports = ExpertTraders;
