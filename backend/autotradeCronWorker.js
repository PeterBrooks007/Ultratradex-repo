const dotenv = require("dotenv").config();
const cron = require("node-cron");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const User = require("./models/userModel"); // Adjust path as needed
const Trades = require("./models/tradesModel"); // Adjust path as needed
const Notifications = require("./models/notificationsModel");
const TradingSettings = require("./models/tradingSettingsModel");

// Path to store the daily bulk cached prices on your server
const CACHE_FILE_PATH = path.join(__dirname, "dailyBulkPriceCache.json");

/**
 * Fetches the full market coin list from CoinGecko once per day
 * and saves it locally to conserve your 10,000 monthly API limit.
 */
const getPriceFromBulkCache = async (targetSymbolPair) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0]; // e.g., "2026-09-17"
    let cacheData = null;

    // 1. Check if bulk cache file exists and is from today
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, "utf8");
      const parsed = JSON.parse(fileContent);

      if (parsed.date === todayStr && Array.isArray(parsed.coins)) {
        console.log(`[CACHE HIT] Using today's bulk coin market data.`);
        cacheData = parsed.coins;
      }
    }

    // 2. If no valid cache for today, make the SINGLE bulk API call to CoinGecko
    if (!cacheData) {
      console.log(
        `[API CALL] Fetching full market coin list from CoinGecko... (1 call used)`,
      );

      const url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1";

      const options = {
        method: "GET",
        url: url,
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
          // "x-cg-demo-api-key": "12345",
        },
      };

      const response = await axios(options);

      cacheData = response.data;

      // Save the bulk array with today's date stamp
      const newCachePayload = {
        date: todayStr,
        coins: cacheData,
      };

      fs.writeFileSync(
        CACHE_FILE_PATH,
        JSON.stringify(newCachePayload, null, 2),
        "utf8",
      );
    }

    // 3. Clean the pair and extract the base symbol (e.g., "BTC-USD" or "BTCHYZ" -> "btc")
    const cleanPair = targetSymbolPair.replace(/^[-/_]+/, "").toLowerCase();
    let baseSymbol = "";

    if (
      cleanPair.includes("-") ||
      cleanPair.includes("_") ||
      cleanPair.includes("/")
    ) {
      const parts = cleanPair.split(/[-/_]/);
      baseSymbol = parts[0];
    } else {
      baseSymbol = cleanPair.substring(0, 3); // Takes first 3 letters for concatenated pairs like BTCUSD/BTCHYZ
    }

    // 4. Search through the cached array for the extracted base symbol
    const foundCoin = cacheData.find(
      (coin) =>
        coin.symbol.toLowerCase() === baseSymbol ||
        coin.id.toLowerCase() === baseSymbol,
    );

    return foundCoin ? foundCoin.current_price || foundCoin.price : null;
  } catch (error) {
    console.error(
      `[BULK PRICE ERROR] Failed to fetch or read bulk price cache:`,
      error.message,
    );
    return null;
  }
};

// Helper to get conversion rate from USD to user's currency (e.g., "EUR", "CAD")
const getFiatConversionRate = async (targetCurrency) => {
  const currency = targetCurrency ? targetCurrency.toUpperCase() : "USD";
  if (currency === "USD") return 1.0; // No conversion needed

  try {
    // Using a free public endpoint for fiat exchange rates
    const response = await axios.get(`https://open.er-api.com/v6/latest/USD`);
    const rates = response.data.rates;

    return rates[currency] || 1.0; // Fallback to 1.0 if currency code isn't found
  } catch (error) {
    console.error(
      `[EXCHANGE RATE ERROR] Failed to fetch conversion rate for ${currency}:`,
      error.message,
    );
    return 1.0; // Fallback to 1:1 if API fails
  }
};

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[CRON] Connected to MongoDB");
  }
};

// Main function: Process users with autoTradeCronJobStatus === "OPEN"
const runAutoTradesForUsers = async () => {
  try {
    await connectDB();

    //========== Fetch all TradeSettings upfront =============//
    const allTradingSettings = await TradingSettings.find({});

    // Check if current day is weekend (0 = Sunday, 6 = Saturday)
    const dayOfWeek = new Date().getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Filter out any settings records that lack valid trading pairs upfront

    const validSettings = allTradingSettings.filter((setting) => {
      if (!setting.tradingPairs || setting.tradingPairs.length === 0)
        return false;

      // On weekends, allow ONLY crypto trading pairs
      if (isWeekend) {
        return (
          setting.exchangeType &&
          setting.exchangeType.toLowerCase().includes("crypto")
        );
      }

      return true;
    });

    if (validSettings.length === 0) {
      console.log(
        isWeekend
          ? "[AUTO-TRADE] Weekend active: No valid Crypto settings found for trading."
          : "[AUTO-TRADE] No TradingSettings with valid trading pairs found.",
      );
      return;
    }

    //============ Query all users where autoTradeCronJobStatus is "OPEN" =======//

    const activeUsers = await User.find({
      "autoTradeSettings.autoTradeCronJobStatus": "OPEN",
    });

    if (activeUsers.length === 0) return;

    for (const user of activeUsers) {
      const tradingMode = "Live"; // or user.isDemoAccountActivated ? "Demo" : "Live";
      const currentBalance =
        tradingMode === "Live" ? user.balance : user.demoBalance;

      // 1. Skip execution if balance is insufficient
      if (!currentBalance || currentBalance <= 0) {
        console.log(
          `[AUTO-TRADE] Skipped User ${user.email}: Insufficient balance.`,
        );
        continue;
      }

      // If trade duration (e.g. 3 or 7 days) has passed, close auto-trading for this user

      const tradeDurationDays =
        Number(user.autoTradeSettings?.autotradeDuration) || 3;

      const autoTradeStartTime = user.autoTradeSettings
        ?.autoTradeCronJobStartTime
        ? new Date(user.autoTradeSettings.autoTradeCronJobStartTime).getTime()
        : 0;

      const DURATION_IN_MS = tradeDurationDays * 24 * 60 * 60 * 1000; // in Days
      // const DURATION_IN_MS = tradeDurationDays * 60 * 1000; // in Mins for testing

      const durationTimeDifference = Date.now() - autoTradeStartTime;

      if (autoTradeStartTime > 0 && durationTimeDifference >= DURATION_IN_MS) {
        user.autoTradeSettings.autoTradeCronJobStatus = "CLOSE"; // Matched schema value
        user.autoTradeSettings.isAutoTradeActivated = true;
        user.autoTradeSettings.numberOfTrades = 0;
        user.autoTradeSettings.lastTradeAt = null; // Clean up actual anchor property
        user.autoTradeSettings.autoTradeCronJobStartTime = null; // Clean up actual anchor property

        user.markModified("autoTradeSettings");
        await user.save();

        console.log(
          `[AUTO-TRADE] ${tradeDurationDays} days duration reached for ${user.email}. Auto-trade closed.`,
        );
        continue; // Skip creating new trades for this user
      }

      // 2. Handle 24-Hour Cycle Reset
      const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // 24hours
      // const TWENTY_FOUR_HOURS_MS = 5 * 60 * 1000; //5mins for testing

      const cycleStartTime = user.autoTradeSettings?.lastTradeAt
        ? new Date(user.autoTradeSettings.lastTradeAt).getTime()
        : 0;

      const timeDifference = Date.now() - cycleStartTime;

      // If 24 hours passed since cycle started, clear the counter & lock timestamp
      if (cycleStartTime > 0 && timeDifference >= TWENTY_FOUR_HOURS_MS) {
        user.autoTradeSettings.numberOfTrades = 0;
        user.autoTradeSettings.lastTradeAt = null; // Clear anchor for new cycle
        user.markModified("autoTradeSettings");
        await user.save();
        console.log(
          `[AUTO-TRADE] 24 hours passed for ${user.email}. Trade count reset to 0.`,
        );
      }

      // 3. Skip if max trades reached for active 24h window
      const maxTrades = user.autoTradeSettings?.maxAutoTradeCronJob || 10;
      const currentTradeCount =
        Number(user.autoTradeSettings?.numberOfTrades) || 0;

      if (currentTradeCount >= maxTrades) {
        console.log(
          `[AUTO-TRADE] Skipped User ${user.email}: Max trades reached for 24h period.`,
        );
        continue;
      }

      // 4. Calculate trade stake (10% of balance, minimum $10)
      const tradeAmount = Math.max(
        10,
        parseFloat((currentBalance * 0.1).toFixed(2)),
      );

      if (tradeAmount > currentBalance) continue;

      //  SELECT EXCHANGE SETTING BASED ON USER AUTOTRADESETTINGS PREFERENCE
      const preferredExchange = user.autoTradeSettings?.tradeExchange
        ? user.autoTradeSettings.tradeExchange.toLowerCase()
        : "random";

      let eligibleSettings = validSettings;

      if (preferredExchange !== "random") {
        eligibleSettings = validSettings.filter(
          (setting) =>
            setting.exchangeType &&
            setting.exchangeType.toLowerCase().includes(preferredExchange),
        );
      }

      // FALLBACK: If user's preference yields no results, fall back to all valid settings
      if (eligibleSettings.length === 0) {
        console.log(
          `[AUTO-TRADE WARNING] No settings found matching preference "${preferredExchange}" for user ${user.email}. Falling back to any available exchange.`,
        );
        eligibleSettings = validSettings;
      }

      if (eligibleSettings.length === 0) {
        console.log(
          `[AUTO-TRADE] Skipped User ${user.email}: No valid trading settings available at all.`,
        );
        continue;
      }

      // Pick a random TradeSetting record from the filtered/fallback list
      const randomSetting =
        eligibleSettings[Math.floor(Math.random() * eligibleSettings.length)];

      const selectedExchangeType = randomSetting.exchangeType; // Matches DB exactly (e.g., "crypto", "forex", "stocks")
      const selectedIcon = randomSetting.photo; // Matches DB photo exactly

      // Pick a random pair guaranteed to belong to that specific setting/exchangeType
      const randomIndex = Math.floor(
        Math.random() * randomSetting.tradingPairs.length,
      );
      const selectedSymbol = randomSetting.tradingPairs[randomIndex];

      // ========= Generate realistic market price based on exchange type ========/
      let dynamicPrice = 0;

      // Try fetching live price via bulk cache if it's crypto
      if (selectedExchangeType.toLowerCase().includes("crypto")) {
        dynamicPrice = await getPriceFromBulkCache(selectedSymbol);
      }

      // Fallback or handle non-crypto exchange types
      if (!dynamicPrice || isNaN(dynamicPrice)) {
        if (selectedExchangeType.toLowerCase().includes("crypto")) {
          // Random Crypto price between $1,000 and $65,000 (Fallback)
          dynamicPrice = parseFloat(
            (Math.random() * (65000 - 1000) + 1000).toFixed(2),
          );
        } else if (selectedExchangeType.toLowerCase().includes("forex")) {
          // Random Forex exchange rate between 1.0500 and 1.5000
          dynamicPrice = parseFloat(
            (Math.random() * (1.5 - 1.05) + 1.05).toFixed(4),
          );
        } else if (
          selectedExchangeType.toLowerCase().includes("stock") ||
          selectedExchangeType.toLowerCase().includes("indices") ||
          selectedExchangeType.toLowerCase().includes("commodities")
        ) {
          // Random Stock / Index / Commodity price between $50 and $500
          dynamicPrice = parseFloat(
            (Math.random() * (500 - 50) + 50).toFixed(2),
          );
        } else {
          // Fallback price generator
          dynamicPrice = parseFloat(
            (Math.random() * (1000 - 100) + 100).toFixed(2),
          );
        }
      }

      // CONVERT PRICE TO USER'S PREFERRED CURRENCY
      const userCurrency = user.currency.code || "USD";
      const conversionRate = await getFiatConversionRate(userCurrency);

      // Multiply the USD price by the exchange rate
      dynamicPrice = parseFloat((dynamicPrice * conversionRate).toFixed(2));

      // Calculate units based on tradeAmount divided by dynamicPrice (e.g., Position Size)
      // Example: $100 stake / $50 price = 2 units
      const calculatedUnits = (tradeAmount / dynamicPrice).toFixed(4);

      // 5. Build trade object
      const tradeDataNow = {
        tradingMode,
        exchangeType: selectedExchangeType,
        exchangeTypeIcon: selectedIcon,
        symbols: selectedSymbol,
        type: "Market",
        buyOrSell: Math.random() >= 0.5 ? "Buy" : "Sell",
        price: dynamicPrice.toString(),
        units: calculatedUnits.toString(),
        ticks: "none",
        risk: "0",
        riskPercentage: "0",
        amount: tradeAmount,
        profitOrLossAmount: 0,
        open: dynamicPrice.toString(),
        close: (dynamicPrice * (Math.random() >= 0.5 ? 1.002 : 0.998)).toFixed(
          selectedExchangeType.toLowerCase().includes("forex") ? 4 : 2,
        ),
        longOrShortUnit: "25X",
        roi: 0,
        status: "PENDING",
        expireTime: 1,
        tradeFrom: "bot",
        isProcessed: false,
        createdAt: new Date(),
      };

      // console.log(tradeDataNow);

      // 6. Push trade to user's Trades document
      await Trades.updateOne(
        { userId: user._id },
        { $push: { trades: tradeDataNow } },
        { upsert: true },
      );

      // 7. Deduct balance
      if (tradingMode === "Live") {
        user.balance = user.balance - tradeAmount;
      } else {
        user.demoBalance = user.demoBalance - tradeAmount;
      }

      // 8. Update Trade Count & Cycle Lock Timestamp
      // Lock start time ONLY when placing the 1st trade of a cycle
      if (currentTradeCount === 0 || !user.autoTradeSettings.lastTradeAt) {
        user.autoTradeSettings.lastTradeAt = new Date();
      }
      // Lock start time ONLY when placing the 1st trade of a cycle for autoTradeCronJobStartTime
      if (
        !user.autoTradeSettings.autoTradeCronJobStartTime ||
        user.autoTradeSettings.autoTradeCronJobStartTime == ""
      ) {
        user.autoTradeSettings.autoTradeCronJobStartTime = new Date();
      }

      user.autoTradeSettings.numberOfTrades =
        Number(user.autoTradeSettings.numberOfTrades || 0) + 1;

      user.markModified("autoTradeSettings");
      await user.save();

      // 9. Create Notification (Matching controller's notification block)
      const notificationObject = {
        to: `${user.firstname} ${user.lastname}`,
        from: "Support Team",
        notificationIcon: "CurrencyCircleDollar",
        title: "Bot Trade Order",
        message:
          "A Bot trade order has been placed in your account, Please check trade history",
        route: "/dashboard",
        createdAt: new Date(),
      };

      await Notifications.updateOne(
        { userId: user._id },
        { $push: { notifications: notificationObject } },
        { upsert: true },
      );

      console.log(
        `[AUTO-TRADE SUCCESS] User: ${user.email} | Trade Count: ${user.autoTradeSettings.numberOfTrades}/${maxTrades}`,
      );
    }
  } catch (error) {
    console.error("[CRON ERROR] Failed during auto-trade execution:", error);
  }
};

// Cron interval execution (Runs every 30 minute)
cron.schedule("*/5 * * * *", async () => {
  console.log(
    "[CRON] Scanning for users with autoTradeCronJobStatus === 'OPEN'...",
  );
  await runAutoTradesForUsers();
});
