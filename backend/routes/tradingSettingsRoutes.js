const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const { addExchangeType, getAllTradingSetting, updateTradingSetting, updateTradingSettingPhoto, deleteTradingSettingExchange, deleteArrayOfTradingExchange, addTradingPairs, DeleteArrayTradingPairs } = require("../controllers/tradingSettingsController.js");
const { addTradingSettingsValidator, updateTradingSettingsValidator, addTradingPairsValidator } = require("../validators/tradingSettingsValidator.js");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addExchangeType", protect, adminOnly, upload.single("image"),(req, res, next) => {
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
  },  addTradingSettingsValidator, adminOnly, addExchangeType);


router.get("/getAllTradingSetting", protect, getAllTradingSetting);

router.patch("/updateTradingSetting/:id", protect, adminOnly, updateTradingSettingsValidator, updateTradingSetting);

router.delete("/deleteTradingSettingExchange/:id", protect, adminOnly, deleteTradingSettingExchange);

router.delete("/deleteArrayOfTradingExchange", protect, adminOnly, deleteArrayOfTradingExchange);

router.post("/updateTradingSettingPhoto/:id", protect, adminOnly, upload.single('image'), updateTradingSettingPhoto);

router.patch("/addTradingPairs/:id", protect, adminOnly, addTradingPairsValidator, addTradingPairs);

router.patch("/DeleteArrayTradingPairs/:id", protect, adminOnly, addTradingPairsValidator, DeleteArrayTradingPairs);






module.exports = router;
