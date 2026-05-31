const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorMiddleware");
const userRoute = require("./routes/userRoute");
const withdrawalRoute = require("./routes/withdrawalRoute");
const depositRoute = require("./routes/depositRoute");
const expertTradersRoutes = require("./routes/expertTradersRoutes");
const tradingBotsRoutes = require("./routes/tradingBotsRoutes");
const tradingSignalsRoutes = require("./routes/tradingSignalsRoutes");
const walletAddressRoutes = require("./routes/walletAddressRoutes");
const mailboxRoutes = require("./routes/mailboxRoutes");
const connectWalletRoutes = require("./routes/connectWalletRoutes");
const tradingSettingsRoutes = require("./routes/tradingSettingsRoutes");
const totalCountsRoutes = require("./routes/totalCountsRoute");
const tradesRoutes = require("./routes/tradesRoutes");
const nftSettingsRoutes = require("./routes/nftSettingsRoutes");
const walletTransactionsRoutes = require("./routes/walletTransactionsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const User = require("./models/userModel");

const { Server } = require("socket.io");

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const http = require("http");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://ultratradex.io"],
    methods: ["GET", "POST"],
  },
});

//MiddleWares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ultratradex.io",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

//Route
app.use("/api/users", userRoute);
app.use("/api/withdrawal", withdrawalRoute);
app.use("/api/deposit", depositRoute);
app.use("/api/expertTraders", expertTradersRoutes);
app.use("/api/tradingBots", tradingBotsRoutes);
app.use("/api/tradingSignals", tradingSignalsRoutes);
app.use("/api/walletAddress", walletAddressRoutes);
app.use("/api/mailbox", mailboxRoutes);
app.use("/api/connectWallet", connectWalletRoutes);
app.use("/api/tradingSettings", tradingSettingsRoutes);
app.use("/api/totalCounts", totalCountsRoutes);
app.use("/api/trades", tradesRoutes);
app.use("/api/nftSettings", nftSettingsRoutes);
app.use("/api/walletTransactions", walletTransactionsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.get("/", (req, res) => {
  res.send("Home Page...");
});

//Error Middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Ensure process stops on DB failure
  });

//Socket.io starts
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  socket.on("userOnline", async (userId) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          isOnline: true,
          lastSeen: null,
        },
        { new: true } // Return the updated document
      );

      //send back all users and the single user to admin
      const allUsers = await User.find().sort("-createdAt");

      io.emit("updateStatus", { allUser: allUsers, singleUser: updatedUser });
    } catch (error) {
      console.error(
        `Error updating user online status for user ${userId}:`,
        error
      );
    }
  });

  socket.on("disconnect", async () => {
    // console.log("A user disconnected:", socket.id);
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { isOnline: false, lastSeen: new Date() },
        { new: true } // Return the updated document
      )
      if (user) {
        //send back all users to admin
        const allUsers = await User.find().sort("-createdAt");
        io.emit("updateStatus", { allUser: allUsers, singleUser: user });
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  socket.on("registerSocket", async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
    } catch (error) {
      console.error("Error registering socket:", error);
    }
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    io.close();
    process.exit(1);
  });
});

process.on("SIGINT", () => {
  console.log("Server shutting down...");
  server.close(() => {
    io.close();
    console.log("Server closed");
    process.exit(0);
  });
});
process.on("SIGTERM", () => {
  console.log("Server shutting down...");
  server.close(() => {
    io.close();
    console.log("Server closed");
    process.exit(0);
  });
});
