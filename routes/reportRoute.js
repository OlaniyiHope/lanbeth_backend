import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  submitReport,
  getReportsByDate,
  getAllReportDates,
  getReportById,
} from "../controller/reportController.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post("/", authorize("admin", "staff"), submitReport);

router.get("/", authorize("admin", "staff"), (req, res, next) => {
  if (req.query.date) return getReportsByDate(req, res, next);
  return getAllReportDates(req, res, next);
});

router.get("/single/:reportId", authorize("admin", "staff"), getReportById);

export default router;