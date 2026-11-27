import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"; // adjust path if needed
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getBirthdays,
  sendNotice,
  getSentNotices
} from "../controller/notificationController.js";

const router = express.Router();

router.use(protect, authorize("admin", "staff"));
router.post("/notice", authorize("admin"), sendNotice);
router.get("/", getNotifications);
router.get("/sent", authorize("admin"), getSentNotices);
router.get("/birthdays", getBirthdays);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

export default router;