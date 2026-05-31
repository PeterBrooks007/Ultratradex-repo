const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const { addTradingBotsValidator, updateTradingBotsValidator } = require("../validators/tradingBotsValidator.js");
const { addTradingBot, getAllTradingBots, deleteTradingBot, updateTradingBot, updateTradingBotPhoto } = require("../controllers/tradingBotsController.js");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addTradingBot", protect, adminOnly, upload.single("image"),(req, res, next) => {
    // Parse the userData string back into an object
    if (req.body.userData) {
      try {
        req.body.userData = JSON.parse(req.body.userData);
        // console.log(req.body.userData)
      } catch (error) {
        res.status(400);
        throw new Error("Invalid user data format");
      }
    }

    next();
  },  addTradingBotsValidator, adminOnly, addTradingBot);


router.get("/getAllTradingBots", protect, getAllTradingBots);

router.patch("/updateTradingBot/:id", protect, adminOnly, updateTradingBotsValidator, updateTradingBot);

router.delete("/deleteTradingBot/:id", protect, adminOnly, deleteTradingBot);

// router.patch("/myExpertTrader", protect, myExpertTrader);
// router.get("/getMyExpertTrader", protect, getMyExpertTrader);
// router.patch("/removeFromMyExpertTrader/:id", protect, removeFromMyExpertTrader);

router.post("/updateTradingBotPhoto/:id", protect, adminOnly, upload.single('image'), updateTradingBotPhoto);





module.exports = router;
