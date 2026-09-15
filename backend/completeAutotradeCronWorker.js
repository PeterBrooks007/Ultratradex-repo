const dotenv = require("dotenv");
dotenv.config();

const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Trades = require("./models/tradesModel");

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[CRON] Connected to MongoDB");
  }
};

const calculateWinrate = (winLoseValue) => {
  if (winLoseValue === "Ten") return Math.floor(Math.random() * 100);
  if (winLoseValue === "Hundred") return Math.floor(Math.random() * 900) + 100;
  if (winLoseValue === "Thousand")
    return Math.floor(Math.random() * 9000) + 1000;
  if (winLoseValue === "Random") return Math.floor(Math.random() * 10000000);
  return Math.floor(Math.random() * 9000000) + 1000000;
};

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
    const tradeDocs = await Trades.find({
      trades: {
        $elemMatch: {
          isProcessed: false,
          status: "PENDING",
          tradeFrom: "bot",
        },
      },
    });

    for (const tradeDoc of tradeDocs) {
      let isTradeDocModified = false;

      const user = await User.findById(tradeDoc.userId);
      if (!user) {
        console.log(
          `[CRON WARN] User not found for Trades Document: ${tradeDoc._id}`,
        );
        continue;
      }

      let isUserModified = false;

      for (const trade of tradeDoc.trades) {
        if (
          trade.isProcessed ||
          trade.status !== "PENDING" ||
          trade.tradeFrom !== "bot"
        ) {
          continue;
        }

        const createdAtTime = new Date(trade.createdAt).getTime();
        const expireDurationMs = (Number(trade.expireTime) || 0) * 60 * 1000;
        const expirationTime = createdAtTime + expireDurationMs;

        if (now >= expirationTime) {
          const tradingMode = trade.tradingMode; // e.g., "Live" or "Demo"
          const tradeAmount = Number(trade.amount) || 0;

          const randomOutcome = getOutcome(user.autoTradeSettings?.type);
          const winrate = calculateWinrate(
            user.autoTradeSettings?.winLoseValue,
          );
          const profitOrLoss = randomOutcome === "Lose" ? tradeAmount : winrate;

          trade.status = randomOutcome;
          trade.profitOrLossAmount = profitOrLoss;
          trade.open = trade.open || "90000";
          trade.close = trade.close || "90100";
          trade.longOrShortUnit = trade.longOrShortUnit || "25X";
          trade.roi = trade.roi || "100%";
          trade.expireTime = -30;
          trade.isProcessed = true;

          // -----------------------------------------------------------------
          // BALANCE & EARNED TOTAL UPDATE (Matches autoTradeUpdate logic)
          // -----------------------------------------------------------------
          if (randomOutcome === "Won" && tradingMode === "Live") {
            user.balance =
              Number(user.balance || 0) + tradeAmount + profitOrLoss;
            user.earnedTotal = Number(user.earnedTotal || 0) + profitOrLoss;
            isUserModified = true;
          }

          if (randomOutcome === "Lose" && tradingMode === "Live") {
            const currentEarned = Number(user.earnedTotal || 0);
            user.earnedTotal =
              currentEarned - tradeAmount < 0 ? 0 : currentEarned - tradeAmount;
            isUserModified = true;
          }

          if (randomOutcome === "Won" && tradingMode === "Demo") {
            user.demoBalance =
              Number(user.demoBalance || 0) + tradeAmount + profitOrLoss;
            isUserModified = true;
          }

          isTradeDocModified = true;
          console.log(
            `[CRON] Processed Bot Trade ${trade._id} for User ${user._id} -> Outcome: ${randomOutcome}`,
          );
        }
      }

      if (isUserModified) {
        await user.save();
      }

      if (isTradeDocModified) {
        tradeDoc.markModified("trades");
        await tradeDoc.save();
      }
    }
  } catch (error) {
    console.error("[CRON ERROR] Trade resolution failed:", error);
  }
};

cron.schedule("*/1 * * * *", async () => {
  console.log("[CRON] Scanning for pending expired bot trades...");
  await resolveExpiredTrades();
});
