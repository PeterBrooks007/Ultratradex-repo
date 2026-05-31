const express = require("express");
const multer = require('multer');
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const { addNftValidator, updateNftValidator } = require("../validators/nftSettingsValidator.js");
const { addNft, getAllNfts, updateNft, updateNftPhoto, deleteNft, adminAddNftToUser, admingetUserNfts, adminRemoveUserNft, getMyNfts, userReSellNft } = require("../controllers/nftSettingsController.js");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/addNft", protect, adminOnly, upload.single("image"),(req, res, next) => {
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
  },  addNftValidator, adminOnly, addNft);


router.get("/getAllNfts", protect, getAllNfts);

router.patch("/updateNft/:id", protect, adminOnly, updateNftValidator, updateNft);

router.post("/updateNftPhoto/:id", protect, adminOnly, upload.single('image'), updateNftPhoto);

router.delete("/deleteNft/:id", protect, adminOnly, deleteNft);

router.patch("/adminAddNftToUser", protect, adminOnly, adminAddNftToUser);

router.get("/admingetUserNfts/:email", protect, adminOnly, admingetUserNfts);

router.patch("/adminRemoveUserNft/:id", protect, adminOnly, adminRemoveUserNft);

router.patch("/userReSellNft/:id", protect, userReSellNft);

router.get("/getMyNfts", protect, getMyNfts);




// router.patch("/myExpertTrader", protect, myExpertTrader);



// router.patch("/removeFromMyExpertTrader/:id", protect, removeFromMyExpertTrader);







module.exports = router;
