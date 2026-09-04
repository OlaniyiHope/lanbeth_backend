import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAllPolicies,
  uploadPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  markPolicyAsRead,
} from "../controller/policyController.js";

const router = express.Router();

router.use(protect);

// All three roles can view + mark as read
router.get("/", authorize("admin", "staff", "policy"), getAllPolicies);
router.get("/:id", authorize("admin", "staff", "policy"), getPolicyById);
router.post("/:id/mark-as-read", authorize("admin", "staff", "policy"), markPolicyAsRead);

// Admin only: upload + edit
router.post("/", authorize("admin"), uploadPolicy);
router.put("/:id", authorize("admin"), updatePolicy);

// Admin + Policy-user can delete (per User_Policy.pdf)
router.delete("/:id", authorize("admin", "policy"), deletePolicy);

export default router;