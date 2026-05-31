const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

// Define the schema for each crypto asset field
const assetSchema = new mongoose.Schema({
  symbol: { type: String, required: true }, // e.g., 'BTC', 'ETH'
  name: { type: String, required: true }, // e.g., 'Bitcoin', 'Ethereum'
  balance: { type: Number, required: true, default: 0 }, // e.g., 2.5
  ManualFiatbalance: { type: Number, default: 0 }, // e.g., $2000
  Manualbalance: { type: Number, default: 0 }, // e.g., $2000
  image: { type: String, required: true, default: 0 }, // e.g., 2.5
  lastUpdated: { type: Date, default: Date.now }, // Keep track of when the balance was last updated
});

// Define the schema for each giftReward field

const giftRewardSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = mongoose.Schema(
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
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 characters"],
      //maxLength: [23, "Password must not be more than 23 characers"]
    },
    role: {
      type: String,
      required: [true],
      default: "customer",
      enum: ["customer", "admin"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+1",
    },
    address: {
      type: Object,
      default: {
        address: "Not provided", // Default to indicate no address is given
        state: "Not provided", // Default state
        country: "Not provided", // Default country
        countryFlag: "", // Default country flag (can be empty or a placeholder URL)
      },
    },
    balance: {
      type: Number,
      default: 0,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    isManualAssetMode: {
      type: Boolean,
      default: false,
    },
    assets: [assetSchema],
    currency: {
      type: Object,
      default: {
        code: "USD",
        flag: "us",
      },
    },
    demoBalance: {
      type: Number,
      default: 0,
    },
    accounttype: {
      type: String,
      default: "FOREX TRADING",
    },
    package: {
      type: String,
      default: "BRONZE",
    },
    earnedTotal: {
      type: Number,
      default: 0,
    },
    totalDeposit: {
      type: Number,
      default: 0,
    },
    totalWithdrew: {
      type: Number,
      default: 0,
    },
    referralBonus: {
      type: Number,
      default: 0,
    },
    pin: {
      type: String,
      default: "1234",
    },
    lastAccess: {
      type: Date,
      default: Date.now,
    },
    pinRequired: {
      type: Boolean,
      default: false,
    },
    myTraders: [
      {
        type: ObjectId,
        ref: "ExpertTraders",
      },
    ],
    myNfts: [
      {
        type: ObjectId,
        ref: "NftSettings",
      },
    ],
    myTradingBots: [
      {
        type: ObjectId,
        ref: "TradingBots",
      },
    ],
    myTradingSignals: [
      {
        type: ObjectId,
        ref: "TradingSignals",
      },
    ],
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // twoFactorSecret: {
    //   type: String,
    // },

    idVerificationPhoto: {
      front: {
        type: String,
        default: "NOT UPLOADED", // Initial default value
      },
      back: {
        type: String,
        default: "NOT UPLOADED", // Initial default value
      },
    },

    isIdVerified: {
      type: String,
      required: [true],
      default: "NOT VERIFIED",
      enum: ["NOT VERIFIED", "PENDING", "VERIFIED"],
    },

    residencyVerificationPhoto: {
      type: String,
      default: "NOT UPLOADED", // Initial default value
    },

    isResidencyVerified: {
      type: String,
      required: [true],
      default: "NOT VERIFIED",
      enum: ["NOT VERIFIED", "PENDING", "VERIFIED"],
    },
    
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDemoAccountActivated: {
      type: Boolean,
      default: false,
    },
    autoTradeSettings: {
      type: Object,
      default: {
        isAutoTradeActivated: true,
        type: "Random", // Always_Win or Always_Lose, or Random win or lose
        winLoseValue: "Thousand", // Ten, Hundred, Thousand, Million, Random
      },
    },
    withdrawalLocked: {
      type: Object,
      default: {
        isWithdrawalLocked: false,
        lockCode: 1234,
        lockSubject: "ITN CODE is required",
        lockComment:
          "An ITN CODE is required to complete your withdrawal process, contact support if you dont have an ITN CODE yet",
      },
    },
    accountLock: {
      type: Object,
      default: {
        generalLock: false,
        upgradeLock: false,
        signalLock: false,
      },
    },
    customizeEmailLogo: {
      type: String,
      default: "Not provided",
    },
    giftRewards: {
      type: [giftRewardSchema], // Array of giftReward objects
      default: [], // Default to an empty array if not provided
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// //Encrypt pass before saving to db
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   // Hash Password
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(this.password, salt);
//   this.password = hashPassword;
//   next();
// });

//Encrypt Otp before saving to db
userSchema.pre("save", async function (next) {
  // Only run this function if otp was actually modified
  if (!this.isModified("otp") || !this.otp) return next();

  // Hash the otp with cost of 12
  this.otp = await bcrypt.hash(this.otp.toString(), 12);

  // console.log(this.otp.toString(), "FROM PRE SAVE HOOK");

  next();
});

//compare Otp
userSchema.methods.correctOTP = async function (
  candidateOTP, //824356
  userOTP // hjhuydfsfyhnkn =>
) {
  return await bcrypt.compare(candidateOTP, userOTP);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
