import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"; // adjust path if needed
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controller/notificationController.js";

const router = express.Router();

router.use(protect, authorize("admin", "staff"));

router.get("/", getNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

export default router;