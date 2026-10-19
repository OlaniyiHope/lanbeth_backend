import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateCurrentUser,
  createAdmin,
  listAdmins,
  setAdminStatus,
  deleteAdmin
} from "../controller/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/login", loginUser);

// Admin-only: create staff / policy / admin accounts
// (matches the "+ Add Staff" flow on the Manage Staff screen, page 15/20)
router.post("/register",  registerUser);

router.post("/admins", protect, authorize("admin"), createAdmin);
// Any logged-in user
router.get("/me", protect, getCurrentUser);

router.get("/admins", protect, authorize("admin"), listAdmins);

router.patch("/admins/:id/status", protect, authorize("admin"), setAdminStatus);
router.delete("/admins/:id", protect, authorize("admin"), deleteAdmin);

router.put("/me", protect, updateCurrentUser);  
router.post("/logout", protect, logoutUser);

export default router;
