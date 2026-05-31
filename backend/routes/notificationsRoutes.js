const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const { getUserNotifications, deleteNotification, adminGetUserNotifications, adminUpdateUserNotification, addNotification, getAllAdminNotifications, adminClearNotification, userClearNotification } = require("../controllers/notificationsController");

const { adminUpdateUserNotificationValidator, addNotificationValidator } = require("../validators/notificationsValidator");

const router = express.Router();


router.post("/addNotification", protect, addNotificationValidator, addNotification);

router.get("/getUserNotifications", protect, getUserNotifications);

router.get("/adminGetUserNotifications/:id", protect, adminOnly, adminGetUserNotifications);

router.get("/getAllAdminNotifications", protect, adminOnly, getAllAdminNotifications);

router.patch("/adminUpdateUserNotification/:id", protect, adminOnly, adminUpdateUserNotificationValidator, adminUpdateUserNotification);

router.delete("/deleteNotification/:id", protect, deleteNotification);

router.delete("/adminClearNotification/:id", protect, adminOnly, adminClearNotification);

router.delete("/userClearNotification/:id", protect, userClearNotification);


module.exports = router;
