const dotenv = require("dotenv").config();
const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./models/userModel"); // Adjust path as needed
const Trades = require("./models/tradesModel"); // Adjust path as needed
const Notifications = require("./models/notificationsModel"); // Adjust path as needed

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[CRON] Connected to MongoDB");
  }
};

// Preset pairs matching your exchange structure
const FOREX_PAIRS = [
  { exchangeType: "Forex", exchangeTypeIcon: "https://i.ibb.co/EURUSD.png", symbols: "EUR/USD" },
  { exchangeType: "Forex", exchangeTypeIcon: "https://i.ibb.co/GBPUSD.png", symbols: "GBP/USD" },
  { exchangeType: "Forex", exchangeTypeIcon: "https://i.ibb.co/USDJPY.png", symbols: "USD/JPY" },
  { exchangeType: "Crypto", exchangeTypeIcon: "https://i.ibb.co/BTCUSD.png", symbols: "BTC/USD" },
];

// Calculate win/loss and profit amount based on user's autoTradeSettings
const calculateOutcome = (user, tradeAmount) => {
  const autoSettings = user?.autoTradeSettings || {};
  const type = autoSettings.type || "Random"; // Always_Win, Always_Lose, or Random
  const winLoseValue = autoSettings.winLoseValue || "Hundred"; // Ten, Hundred, Thousand, Million, Random

  // 1. Win / Loss Determination
  let isWin = false;
  if (type === "Always_Win") {
    isWin = true;
  } else if (type === "Always_Lose") {
    isWin = false;
  } else {
    isWin = Math.random() >= 0.5; // 50/50 Random
  }

  // 2. Multiplier Determination
  let multiplier = 0.5;
  switch (winLoseValue) {
    case "Ten":
      multiplier = 0.1;
      break;
    case "Hundred":
      multiplier = 0.5;
      break;
    case "Thousand":
      multiplier = 1.0;
      break;
    case "Million":
      multiplier = 2.0;
      break;
    case "Random":
    default:
      multiplier = parseFloat((Math.random() * (0.85 - 0.15) + 0.15).toFixed(2));
      break;
  }

  let computedAmount = tradeAmount * multiplier;
  computedAmount = isWin ? Math.abs(computedAmount) : -Math.abs(computedAmount);

  return {
    status: isWin ? "Won" : "Lose",
    profitOrLossAmount: parseFloat(computedAmount.toFixed(2)),
  };
};

// Main function: Process users with autoTradeCronJobStatus === "OPEN"
const runAutoTradesForUsers = async () => {
  try {
    await connectDB();

    // Query all users where autoTradeCronJobStatus is "OPEN"
    const activeUsers = await User.find({
      "autoTradeSettings.autoTradeCronJobStatus": "OPEN",
    });

    if (activeUsers.length === 0) return;

    for (const user of activeUsers) {
      // const tradingMode = user.isDemoAccountActivated ? "Demo" : "Live";
      const tradingMode = "Live";
      const currentBalance = tradingMode === "Live" ? user.balance : user.demoBalance;

      // Skip execution if balance is insufficient
      if (!currentBalance || currentBalance <= 0) {
        console.log(`[AUTO-TRADE] Skipped User ${user.email}: Insufficient balance.`);
        continue;
      }

      // Calculate trade stake (e.g., 10% of balance, minimum $10)
      const tradeAmount = Math.max(10, parseFloat((currentBalance * 0.1).toFixed(2)));

      // Validate against available balance (Mirroring addTrade controller)
      if (tradeAmount > currentBalance) continue;

      const randomAsset = FOREX_PAIRS[Math.floor(Math.random() * FOREX_PAIRS.length)];
      const entryPrice = parseFloat((Math.random() * (1.2000 - 1.0500) + 1.0500).toFixed(4));
      const units = parseFloat((tradeAmount / entryPrice).toFixed(2));

      // Determine outcome
      const { status, profitOrLossAmount } = calculateOutcome(user, tradeAmount);

      // Build trade object matching addTrade controller payload
      const tradeDataNow = {
        tradingMode,
        exchangeType: randomAsset.exchangeType,
        exchangeTypeIcon: randomAsset.exchangeTypeIcon,
        symbols: randomAsset.symbols,
        type: "Market",
        buyOrSell: Math.random() >= 0.5 ? "BUY" : "SELL",
        price: entryPrice,
        units: units,
        ticks: "none",
        risk: "0",
        riskPercentage: "0",
        amount: tradeAmount,
        profitOrLossAmount: profitOrLossAmount,
        open: entryPrice.toString(),
        close: (entryPrice + (profitOrLossAmount > 0 ? 0.0020 : -0.0020)).toFixed(4),
        longOrShortUnit: "25X",
        roi: `${((profitOrLossAmount / tradeAmount) * 100).toFixed(2)}%`,
        status: status, // "Won" or "Lose"
        expireTime: 1,
        tradeFrom: "admin", // Automated placement treated as admin execution
        isProcessed: true,
        createdAt: new Date(),
      };


      console.log(tradeDataNow)



      // 1. Push trade to user Trades collection (Matching controller's Trades.updateOne)
      // await Trades.updateOne(
      //   { userId: user._id },
      //   { $push: { trades: tradeDataNow } },
      //   { upsert: true }
      // );

      // 2. Adjust Balance and Earned Total (Deduct initial stake + apply profit/loss return)
      const netChange = profitOrLossAmount; // Balance was reduced by tradeAmount, then returned (tradeAmount + P/L)
      
      if (tradingMode === "Live") {
        user.balance = Math.max(0, user.balance + netChange);
        if (profitOrLossAmount > 0) {
          user.earnedTotal = (user.earnedTotal || 0) + profitOrLossAmount;
        }
      } else {
        user.demoBalance = Math.max(0, user.demoBalance + netChange);
      }

      // await user.save();

      // 3. Create Notification (Matching controller's notification block)
      const notificationObject = {
        to: `${user.firstname} ${user.lastname}`,
        from: "Support Team",
        notificationIcon: "CurrencyCircleDollar",
        title: "New Trade Order",
        message: "A trade order has been placed in your account, Please check trade history",
        route: "/dashboard",
        createdAt: new Date(),
      };

      // await Notifications.updateOne(
      //   { userId: user._id },
      //   { $push: { notifications: notificationObject } },
      //   { upsert: true }
      // );

      console.log(`[AUTO-TRADE SUCCESS] User: ${user.email} | Outcome: ${status} | Net P/L: ${profitOrLossAmount}`);
    }
  } catch (error) {
    console.error("[CRON ERROR] Failed during auto-trade execution:", error);
  }
};

// Cron interval execution (Runs every minute)
cron.schedule("* * * * *", async () => {
  console.log("[CRON] Scanning for users with autoTradeCronJobStatus === 'OPEN'...");
  await runAutoTradesForUsers();
});