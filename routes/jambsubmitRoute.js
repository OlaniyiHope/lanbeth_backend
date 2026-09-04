// examRoutes.js

import express from "express";
import {
  getAllScore,
  getExamScore,
  submitExam,
  getAllStudentScores,
  getSubmissions,
  findExam,
} from "../controller/examController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a route for submitting an exam
router.post("/exams/find-jamb-exam", authenticateUser, findExam);

router.post("/jamb-exams/submit/:sessionId", authenticateUser, submitExam);
router.get(
  "/jamb-exams/get-submission/:examId/:userId",
  authenticateUser,
  getSubmissions
);

// Create a route to get the student's score and name
router.get(
  "/jamb-exams/score/:examId/:userId/:session",
  authenticateUser,
  getExamScore
);
router.get(
  "/students/all-jamb-scores/:userId/:sessionId",
  authenticateUser,
  getAllStudentScores
);

// Create a route to get all students' scores for a specific exam
router.get("/exams/all-jamb-scores/:examId", getAllScore);

export default router;
