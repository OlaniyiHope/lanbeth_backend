import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  getReportCount,
} from "../controller/reportController.js";

const router = express.Router();

router.use(protect);

router.get(
  "/count",
  authorize("admin"),
  getReportCount
);

export default router;