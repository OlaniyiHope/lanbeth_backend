import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { listArchive, restoreItem, permanentlyDelete } from "../controller/archiveController.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/", listArchive);
router.post("/:type/:id/restore", restoreItem);
router.delete("/:type/:id", permanentlyDelete);

export default router;