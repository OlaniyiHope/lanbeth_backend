import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  getAllPolicies,
  uploadPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  markPolicyAsRead,
} from "../controller/policyController.js";

import uploadPolicyDocument from "../middleware/uploadPolicyDocument.js";

const router = express.Router();

router.use(protect);


/*
|--------------------------------------------------------------------------
| VIEW POLICIES
|--------------------------------------------------------------------------
| Admin, staff and policy users can view.
*/
router.get(
  "/",
  authorize("admin", "staff", "policy"),
  getAllPolicies
);


/*
|--------------------------------------------------------------------------
| UPLOAD POLICY
|--------------------------------------------------------------------------
| Admin and policy users can upload.
*/
router.post(
  "/",
  authorize("admin", "policy"),
  uploadPolicyDocument.single("file"),
  uploadPolicy
);


/*
|--------------------------------------------------------------------------
| SINGLE POLICY
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  authorize("admin", "staff", "policy"),
  getPolicyById
);


/*
|--------------------------------------------------------------------------
| MARK AS READ
|--------------------------------------------------------------------------
*/
router.post(
  "/:id/mark-as-read",
  authorize("admin", "staff", "policy"),
  markPolicyAsRead
);


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
| Admin only.
*/
router.put(
  "/:id",
  authorize("admin"),
  updatePolicy
);


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Admin and policy users.
*/
router.delete(
  "/:id",
  authorize("admin", "policy"),
  deletePolicy
);

export default router;