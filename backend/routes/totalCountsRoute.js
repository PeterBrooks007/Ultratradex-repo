const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllAdminTotalCounts, getAllUserTotalCounts } = require("../controllers/totalCountsController");
const router = express.Router();

router.get("/getAllAdminTotalCounts", protect, adminOnly, getAllAdminTotalCounts);

router.get("/getAllUserTotalCounts", protect, getAllUserTotalCounts);

module.exports = router;
