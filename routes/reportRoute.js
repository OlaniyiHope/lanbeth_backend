// import express from "express";
// import { protect, authorize } from "../middleware/authMiddleware.js";
// import {
//   submitReport,
//   getReportsByDate,
//   getAllReportDates,
//   getReportById,
//   getMyReports,
//   deleteReport,
//   getReportCount
// } from "../controller/reportController.js";

// const router = express.Router({ mergeParams: true });

// router.use(protect);

// router.post("/", authorize("admin", "staff"), submitReport);
// router.get(
//   "/count",
//   authorize("admin"),
//   getReportCount
// );
// router.get("/", authorize("admin", "staff"), (req, res, next) => {
//   if (req.query.date) return getReportsByDate(req, res, next);
//   return getAllReportDates(req, res, next);
// });

// router.get("/my-report", authorize("admin", "staff"), getMyReports);
// router.get("/single/:reportId", authorize("admin", "staff"), getReportById);
// router.delete(
//   "/single/:reportId",
//   authorize("admin", "staff"),
//   deleteReport
// );
// export default router;

import express from "express";

import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  submitReport,
  getReportsByDate,
  getAllReportDates,
  getReportById,
  getMyReports,
  deleteReport,
} from "../controller/reportController.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post("/", authorize("admin", "staff"), submitReport);

router.get("/", authorize("admin", "staff"), (req, res, next) => {
  if (req.query.date) {
    return getReportsByDate(req, res, next);
  }

  return getAllReportDates(req, res, next);
});

router.get(
  "/my-report",
  authorize("admin", "staff"),
  getMyReports
);

router.get(
  "/single/:reportId",
  authorize("admin", "staff"),
  getReportById
);

router.delete(
  "/single/:reportId",
  authorize("admin", "staff"),
  deleteReport
);

export default router;