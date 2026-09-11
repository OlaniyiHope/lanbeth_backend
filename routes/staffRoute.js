import express from "express";

import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  getStaffList,
  createStaff,
  getStaffById,
  updateStaff,
  uploadStaffDocument,
  getStaffDocuments,
  getStaffExpiringDocuments,
  getAllExpiryAlerts,
  getStaffDashboard,
  getMyProfile,
  getMyClients,
  deleteStaff,
  getMyDocuments,
  uploadMyDocument,
  deleteMyDocument,
} from "../controller/staffController.js";

import uploadStaffDocumentFile from "../middleware/uploadStaffDocument.js";

const router = express.Router();

router.use(protect);

// =====================================================
// STAFF ROUTES
// =====================================================

router.get(
  "/dashboard",
  authorize("staff"),
  getStaffDashboard
);

router.get(
  "/me/profile",
  authorize("staff"),
  getMyProfile
);

router.get(
  "/my-clients",
  authorize("staff"),
  getMyClients
);

// =====================================================
// STAFF DOCUMENTS
// IMPORTANT: These must come BEFORE /:id
// =====================================================

router.get(
  "/me/documents",
  authorize("staff"),
  getMyDocuments
);

router.post(
  "/me/documents",
  authorize("staff"),
  uploadStaffDocumentFile.single("file"),
  uploadMyDocument
);

router.delete(
  "/me/documents/:documentId",
  authorize("staff"),
  deleteMyDocument
);

// =====================================================
// ADMIN STAFF ROUTES
// =====================================================

router.get(
  "/",
  authorize("admin"),
  getStaffList
);

router.post(
  "/",
  authorize("admin"),
  createStaff
);

router.get(
  "/expiry-alerts",
  authorize("admin"),
  getAllExpiryAlerts
);

// =====================================================
// SPECIFIC STAFF ADMIN ROUTES
// =====================================================

router.get(
  "/:id",
  authorize("admin"),
  getStaffById
);

router.put(
  "/:id",
  authorize("admin"),
  updateStaff
);

router.post(
  "/:id/documents",
  authorize("admin"),
  uploadStaffDocument
);

router.get(
  "/:id/documents",
  authorize("admin"),
  getStaffDocuments
);

router.get(
  "/:id/documents/expiring",
  authorize("admin"),
  getStaffExpiringDocuments
);

router.delete(
  "/:id",
  authorize("admin"),
  deleteStaff
);

export default router;