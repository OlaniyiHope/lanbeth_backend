// import express from "express";

// import {
//   protect,
//   authorize,
// } from "../middleware/authMiddleware.js";

// import {
//   getReportCount,
// } from "../controller/reportController.js";

// const router = express.Router();

// router.use(protect);

// router.get(
//   "/count",
//   authorize("admin"),
//   getReportCount
// );

// export default router;
import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  getReportCount,
  getMyReports,
  getReportById,
  deleteReport,
} from "../controller/reportController.js";

const router = express.Router();

router.use(protect);

// ==========================================
// ADMIN REPORT COUNT
// GET /api/reports/count
// ==========================================
router.get(
  "/count",
  authorize("admin"),
  getReportCount
);

// ==========================================
// MY REPORTS
// GET /api/reports/my-report
// Staff = reports submitted by themselves
// Admin = all reports
// ==========================================
router.get(
  "/my-report",
  authorize("admin", "staff"),
  getMyReports
);

// ==========================================
// SINGLE REPORT
// GET /api/reports/single/:reportId
// ==========================================
router.get(
  "/single/:reportId",
  authorize("admin", "staff"),
  getReportById
);

// ==========================================
// DELETE REPORT
// DELETE /api/reports/single/:reportId
// ==========================================
router.delete(
  "/single/:reportId",
  authorize("admin", "staff"),
  deleteReport
);

export default router;