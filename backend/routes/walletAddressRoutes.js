const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const { addWalletAddressValidator, updateWalletAddressValidator } = require("../validators/walletAddressValidator.js");
const { addWalletAddress, getAllWalletAddress, updateWalletAddress, updateWalletAddresIcon, updateWalletAddresQrcode, deleteWalletAddress } = require("../controllers/walletAddressController.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addWalletAddress", protect, adminOnly, upload.single("image"),(req, res, next) => {
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
  },  addWalletAddressValidator, adminOnly, addWalletAddress);


router.get("/getAllWalletAddress", protect, getAllWalletAddress);

router.patch("/updateWalletAddress/:id", protect, adminOnly, updateWalletAddressValidator, updateWalletAddress);

router.post("/updateWalletAddresIcon/:id", protect, adminOnly, upload.single('image'), updateWalletAddresIcon);

router.post("/updateWalletAddresQrcode/:id", protect, adminOnly, upload.single('image'), updateWalletAddresQrcode);


router.delete("/deleteWalletAddress/:id", protect, adminOnly, deleteWalletAddress);








module.exports = router;
