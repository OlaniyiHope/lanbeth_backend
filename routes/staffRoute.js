// // import express from "express";

// // import { protect, authorize } from "../middleware/authMiddleware.js";

// // import {
// //   getStaffList,
// //   createStaff,
// //   getStaffById,
// //   updateStaff,
// //   uploadStaffDocument,
// //   getStaffDocuments,
// //   getStaffExpiringDocuments,
// //   getAllExpiryAlerts,
// //   getStaffDashboard,
// // } from "../controller/staffController.js";

// // const router = express.Router();

// // /*
// // |--------------------------------------------------------------------------
// // | Authentication
// // |--------------------------------------------------------------------------
// // | Every route requires a valid JWT.
// // |--------------------------------------------------------------------------
// // */

// // router.use(protect);


// // /*
// // |--------------------------------------------------------------------------
// // | STAFF DASHBOARD
// // |--------------------------------------------------------------------------
// // | This MUST be before any admin-only middleware.
// // |--------------------------------------------------------------------------
// // */

// // router.get(
// //   "/dashboard",
// //   authorize("staff"),
// //   getStaffDashboard
// // );


// // /*
// // |--------------------------------------------------------------------------
// // | ADMIN STAFF MANAGEMENT
// // |--------------------------------------------------------------------------
// // */

// // router.get(
// //   "/",
// //   authorize("admin"),
// //   getStaffList
// // );

// // router.post(
// //   "/",
// //   authorize("admin"),
// //   createStaff
// // );


// // /*
// // |--------------------------------------------------------------------------
// // | ADMIN EXPIRY ALERTS
// // |--------------------------------------------------------------------------
// // */

// // router.get(
// //   "/expiry-alerts",
// //   authorize("admin"),
// //   getAllExpiryAlerts
// // );


// // /*
// // |--------------------------------------------------------------------------
// // | ADMIN STAFF DETAILS
// // |--------------------------------------------------------------------------
// // */

// // router.get(
// //   "/:id",
// //   authorize("admin"),
// //   getStaffById
// // );

// // router.put(
// //   "/:id",
// //   authorize("admin"),
// //   updateStaff
// // );


// // /*
// // |--------------------------------------------------------------------------
// // | ADMIN STAFF DOCUMENTS
// // |--------------------------------------------------------------------------
// // */

// // router.post(
// //   "/:id/documents",
// //   authorize("admin"),
// //   uploadStaffDocument
// // );

// // router.get(
// //   "/:id/documents",
// //   authorize("admin"),
// //   getStaffDocuments
// // );

// // router.get(
// //   "/:id/documents/expiring",
// //   authorize("admin"),
// //   getStaffExpiringDocuments
// // );


// // export default router;
// import express from "express";

// import {
//   protect,
//   authorize,
// } from "../middleware/authMiddleware.js";

// import {
//   getStaffList,
//   createStaff,
//   getStaffById,
//   updateStaff,
//   uploadStaffDocument,
//   getStaffDocuments,
//   getStaffExpiringDocuments,
//   getAllExpiryAlerts,
//   getStaffDashboard,
//   getMyProfile,
//     getMyClients,
// } from "../controller/staffController.js";

// const router = express.Router();

// router.use(protect);

// /*
// |--------------------------------------------------------------------------
// | STAFF SELF-SERVICE ROUTES
// |--------------------------------------------------------------------------
// | These routes are accessible by logged-in staff.
// */

// // Logged-in staff member's own profile
// router.get("/me/profile", authorize("staff"), getMyProfile);

// // Logged-in staff member's dashboard
// router.get("/dashboard", authorize("staff"), getStaffDashboard);


// /*
// |--------------------------------------------------------------------------
// | ADMIN STAFF MANAGEMENT
// |--------------------------------------------------------------------------
// | Everything below is admin-only.
// */

// router.get("/", authorize("admin"), getStaffList);

// router.post("/", authorize("admin"), createStaff);

// router.get(
//   "/expiry-alerts",
//   authorize("admin"),
//   getAllExpiryAlerts
// );

// router.get(
//   "/:id",
//   authorize("admin"),
//   getStaffById
// );

// router.put(
//   "/:id",
//   authorize("admin"),
//   updateStaff
// );

// router.post(
//   "/:id/documents",
//   authorize("admin"),
//   uploadStaffDocument
// );
// router.get(
//   "/my-clients",
//   authorize("staff"),
//   getMyClients
// );
// router.get(
//   "/:id/documents",
//   authorize("admin"),
//   getStaffDocuments
// );

// router.get(
//   "/:id/documents/expiring",
//   authorize("admin"),
//   getStaffExpiringDocuments
// );

// export default router;

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
    deleteStaff
  } from "../controller/staffController.js";

  const router = express.Router();


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  router.use(protect);


  // =====================================================
  // STAFF ROUTES
  // =====================================================

  // Logged-in staff member's dashboard
  router.get(
    "/dashboard",
    authorize("staff"),
    getStaffDashboard
  );


  // Logged-in staff member's profile
  router.get(
    "/me/profile",
    authorize("staff"),
    getMyProfile
  );


  // Logged-in staff member's assigned clients
  router.get(
    "/my-clients",
    authorize("staff"),
    getMyClients
  );


  // =====================================================
  // ADMIN ROUTES
  // =====================================================

  // Get all staff
  router.get(
    "/",
    authorize("admin"),
    getStaffList
  );


  // Create staff
  router.post(
    "/",
    authorize("admin"),
    createStaff
  );


  // Expiry alerts
  // Must be before /:id
  router.get(
    "/expiry-alerts",
    authorize("admin"),
    getAllExpiryAlerts
  );


  // Get specific staff
  router.get(
    "/:id",
    authorize("admin"),
    getStaffById
  );


  // Update specific staff
  router.put(
    "/:id",
    authorize("admin"),
    updateStaff
  );


  // Upload staff document
  router.post(
    "/:id/documents",
    authorize("admin"),
    uploadStaffDocument
  );


  // Get staff documents
  router.get(
    "/:id/documents",
    authorize("admin"),
    getStaffDocuments
  );
// Delete specific staff
router.delete(
  "/:id",
  authorize("admin"),
  deleteStaff
);


  // Get expiring staff documents
  router.get(
    "/:id/documents/expiring",
    authorize("admin"),
    getStaffExpiringDocuments
  );


  export default router;