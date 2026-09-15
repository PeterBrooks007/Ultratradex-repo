const dotenv = require("dotenv");
dotenv.config();

const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./models/userModel"); // Adjust path if needed
const Trades = require("./models/tradeModel"); // Model for tradingSchema

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[CRON] Connected to MongoDB");
  }
};

// Helper: Calculate win rate based on user autoTradeSettings
const calculateWinrate = (winLoseValue) => {
  if (winLoseValue === "Ten") return Math.floor(Math.random() * 100);
  if (winLoseValue === "Hundred") return Math.floor(Math.random() * 900) + 100;
  if (winLoseValue === "Thousand")
    return Math.floor(Math.random() * 9000) + 1000;
  if (winLoseValue === "Random") return Math.floor(Math.random() * 10000000);
  return Math.floor(Math.random() * 9000000) + 1000000;
};

// Helper: Determine random outcome based on user autoTradeSettings
const getOutcome = (type) => {
  let outcomes;
  if (type === "Random") {
    outcomes = ["Won", "Lose"];
  } else if (type === "Always_Win") {
    outcomes = ["Won", "Won"];
  } else {
    outcomes = ["Lose", "Lose"];
  }
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

const resolveExpiredTrades = async () => {
  await connectDB();
  const now = new Date().getTime();

  try {
    // 1. Query the TRADES collection (not User) for documents with pending trades
    const tradeDocs = await Trades.find({
      "trades.isProcessed": false,
      "trades.status": "PENDING",
    });

    for (const tradeDoc of tradeDocs) {
      let isTradeDocModified = false;

      // 2. Fetch the actual user associated with this trades document
      const user = await User.findById(tradeDoc.userId);
      if (!user) {
        console.log(
          `[CRON WARN] User not found for Trades Document: ${tradeDoc._id}`,
        );
        continue;
      }

      let isUserModified = false;

      for (const trade of tradeDoc.trades) {
        // Skip already processed or non-pending sub-trades
        if (trade.isProcessed || trade.status !== "PENDING") continue;

        // Expiry calculation
        const createdAtTime = new Date(trade.createdAt).getTime();
        const expireDurationMs = (Number(trade.expireTime) || 0) * 60 * 1000;
        const expirationTime = createdAtTime + expireDurationMs;

        if (now >= expirationTime) {
          const isLive = trade.tradingMode?.toLowerCase() === "live";

          // -----------------------------------------------------------------
          // BRANCH 1: Admin-Created Trade Resolution
          // -----------------------------------------------------------------
          if (trade.tradeFrom === "admin") {
            const calculatedPnl =
              trade.status === "Lose" ? trade.amount : trade.profitOrLossAmount;

            trade.profitOrLossAmount = calculatedPnl;
            trade.expireTime = -30;
            trade.isProcessed = true;

            if (trade.status === "Won") {
              if (isLive) {
                user.balance = (user.balance || 0) + calculatedPnl;
              } else {
                user.demoBalance = (user.demoBalance || 0) + calculatedPnl;
              }
              isUserModified = true;
            }

            isTradeDocModified = true;
            console.log(
              `[CRON] Processed Admin Trade ${trade._id} for User ${user._id} -> Status: ${trade.status}`,
            );
          }
          // -----------------------------------------------------------------
          // BRANCH 2: AutoTrade Active (User Trade)
          // -----------------------------------------------------------------
          else if (user.autoTradeSettings?.isAutoTradeActivated === true) {
            const randomOutcome = getOutcome(user.autoTradeSettings?.type);
            const winrate = calculateWinrate(
              user.autoTradeSettings?.winLoseValue,
            );
            const profitOrLoss =
              randomOutcome === "Lose" ? trade.amount : winrate;

            trade.status = randomOutcome;
            trade.profitOrLossAmount = profitOrLoss;
            trade.open = trade.open || "90000";
            trade.close = trade.close || "90100";
            trade.longOrShortUnit = trade.longOrShortUnit || "25X";
            trade.roi = trade.roi || "100%";
            trade.expireTime = -30;
            trade.isProcessed = true;

            if (randomOutcome === "Won") {
              if (isLive) {
                user.balance = (user.balance || 0) + profitOrLoss;
              } else {
                user.demoBalance = (user.demoBalance || 0) + profitOrLoss;
              }
              isUserModified = true;
            }

            isTradeDocModified = true;
            console.log(
              `[CRON] Processed AutoTrade ${trade._id} for User ${user._id} -> Status: ${randomOutcome}`,
            );
          }
          // -----------------------------------------------------------------
          // BRANCH 3: Manual User Trades (AutoTrade Off / Default Fallback)
          // -----------------------------------------------------------------
          else {
            trade.status = "Lose";
            trade.profitOrLossAmount = trade.amount;
            trade.expireTime = -30;
            trade.isProcessed = true;

            isTradeDocModified = true;
            console.log(
              `[CRON] Processed Manual Trade ${trade._id} for User ${user._id} -> Status: Lose`,
            );
          }
        }
      }

      // 3. Save updates to both User (balance changes) and Trades document
      if (isUserModified) {
        await user.save();
      }

      if (isTradeDocModified) {
        tradeDoc.markModified("trades"); // Crucial for nested array updates in Mongoose
        await tradeDoc.save();
      }
    }
  } catch (error) {
    console.error("[CRON ERROR] Trade resolution failed:", error);
  }
};

// Cron interval execution (Runs every 2 minutes)
cron.schedule("*/2 * * * *", async () => {
  console.log("[CRON] Scanning for pending expired trades...");
  await resolveExpiredTrades();
});
