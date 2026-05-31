const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const { addTradingSignalsValidator, updateTradingSignalsValidator } = require("../validators/tradingSignalsValidator.js");
const { addTradingSignal, getAllTradingSignals, updateTradingSignal, deleteTradingSignal, updateTradingSignalPhoto } = require("../controllers/tradingSignalsController.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addTradingSignal", protect, adminOnly, upload.single("image"),(req, res, next) => {
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
  },  addTradingSignalsValidator, adminOnly, addTradingSignal);


router.get("/getAllTradingSignals", protect, getAllTradingSignals);

router.patch("/updateTradingSignal/:id", protect, adminOnly, updateTradingSignalsValidator, updateTradingSignal);

router.delete("/deleteTradingSignal/:id", protect, adminOnly, deleteTradingSignal);

// router.patch("/myExpertTrader", protect, myExpertTrader);
// router.get("/getMyExpertTrader", protect, getMyExpertTrader);
// router.patch("/removeFromMyExpertTrader/:id", protect, removeFromMyExpertTrader);

router.post("/updateTradingSignalPhoto/:id", protect, adminOnly, upload.single('image'), updateTradingSignalPhoto);





module.exports = router;
