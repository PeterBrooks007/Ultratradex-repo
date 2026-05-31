const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllExpertTraders, updateExpertTrader, deleteExpertTrader, myExpertTrader, getMyExpertTrader, removeFromMyExpertTrader, updateExpertTraderPhoto, addExpertTraders, admingetUserExpertTrader, adminRemoveUserExpertTraderCopied, adminAddExpertTraderToUser } = require("../controllers/expertTradersController.js");
const { updateExpertTraderValidator, addExpertTradersValidator } = require("../validators/expertTradersValidator.js");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addExpertTrader", protect, adminOnly, upload.single("image"),(req, res, next) => {
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
  },  addExpertTradersValidator, adminOnly, addExpertTraders);


router.get("/getAllExpertTraders", protect, getAllExpertTraders);

router.patch("/updateExpertTrader/:id", protect, adminOnly, updateExpertTraderValidator, updateExpertTrader);

router.delete("/deleteExpertTrader/:id", protect, adminOnly, deleteExpertTrader);

router.patch("/myExpertTrader", protect, myExpertTrader);

router.get("/getMyExpertTrader", protect, getMyExpertTrader);


router.patch("/removeFromMyExpertTrader/:id", protect, removeFromMyExpertTrader);

router.post("/updateExpertTraderPhoto/:id", protect, adminOnly, upload.single('image'), updateExpertTraderPhoto);


router.get("/admingetUserExpertTrader/:email", protect, adminOnly, admingetUserExpertTrader);

router.patch("/adminRemoveUserExpertTraderCopied/:id", protect, adminOnly, adminRemoveUserExpertTraderCopied);

router.patch("/adminAddExpertTraderToUser", protect, adminOnly, adminAddExpertTraderToUser);






module.exports = router;
