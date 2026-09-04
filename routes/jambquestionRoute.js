// examRoutes.js
import express from "express";

import authenticateUser from "../middleware/authMiddleware.js";
import {
  createMultipleQuestions,
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestions,
  updateQuestion,
} from "../controller/jambquestionController.js";
const router = express.Router();

// Create a new question
router.post("/jamb-questions", createQuestion);
router.post(
  "/jamb-questions/multiple",
  authenticateUser,
  createMultipleQuestions
);

// Retrieve questions for a specific exam
router.get("/jamb-questions/:examId", authenticateUser, getQuestions);
router.get("/:jamb-questionId", getQuestionById);

// Delete a question by ID
router.delete("/jamb-questions/:questionId", authenticateUser, deleteQuestion);
// Create a new route for updating a question
router.put("/jamb-questions/:questionId", authenticateUser, updateQuestion);

export default router;
