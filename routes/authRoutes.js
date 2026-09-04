import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controller/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/login", loginUser);

// Admin-only: create staff / policy / admin accounts
// (matches the "+ Add Staff" flow on the Manage Staff screen, page 15/20)
router.post("/register",  registerUser);

// Any logged-in user
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);

export default router;
