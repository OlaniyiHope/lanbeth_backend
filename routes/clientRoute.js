// import express from "express";
// import { protect, authorize } from "../middleware/authMiddleware.js";
// import {
//   getClients,
//   createClient,
//   getClientById,
//   updateClient,
//   deleteClient,
//   addClientDocument,
//   deleteClientDocument,
//   assignStaffToClient,
// } from "../controller/clientController.js";

// const router = express.Router();

// // All client routes require login
// router.use(protect);

// // Admin: manage clients list
// router.get("/", authorize("admin"), getClients);
// router.post("/", authorize("admin"), createClient);

// // Admin + Staff: view profile (frontend enforces staff = read-only on edit fields)
// router.get("/:id", authorize("admin", "staff"), getClientById);

// // Admin only: edit / delete
// router.put("/:id", authorize("admin"), updateClient);
// router.delete("/:id", authorize("admin"), deleteClient);

// // Admin only: documents
// router.post("/:id/documents", authorize("admin"), addClientDocument);
// router.delete("/:id/documents/:docId", authorize("admin"), deleteClientDocument);

// // Admin only: assign staff to client
// router.put("/:id/assign-staff", authorize("admin"), assignStaffToClient);

// export default router;
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  addClientDocument,
  deleteClientDocument,
  assignStaffToClient,
} from "../controller/clientController.js";
import reportRoute from "./reportRoute.js"; // <-- new import

const router = express.Router();

// All client routes require login
router.use(protect);

// Admin: manage clients list
router.get("/", authorize("admin"), getClients);
router.post("/", authorize("admin"), createClient);

// Admin + Staff: view profile (frontend enforces staff = read-only on edit fields)
router.get("/:id", authorize("admin", "staff"), getClientById);

// Admin only: edit / delete
router.put("/:id", authorize("admin"), updateClient);
router.delete("/:id", authorize("admin"), deleteClient);

// Admin only: documents
router.post("/:id/documents", authorize("admin"), addClientDocument);
router.delete("/:id/documents/:docId", authorize("admin"), deleteClientDocument);

// Admin only: assign staff to client
router.put("/:id/assign-staff", authorize("admin"), assignStaffToClient);

// Nested report routes -> everything under /:id/reports goes to reportRoutes
router.use("/:id/reports", reportRoute); // <-- new line

export default router;