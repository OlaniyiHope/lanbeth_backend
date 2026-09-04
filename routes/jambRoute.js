import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";

import {
  createJambExam,
  createSubject,
  getAllJambExams,
  getAllSubjects,
  getExamWithQuestions,
  getJambExamById,
  submitJambExamAnswers,
} from "../controller/jambController.js";

const router = express.Router();

// Create JAMB Exam
router.post("/create-jamb-exam", createJambExam);
router.get("/get-exam-with-questions/:examId", getExamWithQuestions);
router.post("/create-subject", authenticateUser, createSubject);

// // router.get("/get-subject/:classname", getSubjectsByClass);
// router.get("/get-subject/:classname/:sessionId", getSubjectsByClass);

// router.get("/get-student-subjects", authenticateUser, getStudentSubjects);
// router.put("/update-subject/:subjectId", updateSubject);

// router.delete("/delete-subject/:subjectId", deleteSubject);
// Get all JAMB Exams
router.get("/jamb-exams", getAllJambExams);
// Get a single JAMB Exam by ID
router.get("/jamb-exams/:id", getJambExamById);

router.get("/get-jamb-subject", getAllSubjects);
// Get JAMB Exam by ID
// router.get("/jamb-exam/:id", authenticateUser, getJambExamById);
router.get("/jamb-exam/:examId/:sessionId", getJambExamById);

// Submit JAMB Exam Answers
router.post("/submit-jamb-exam", authenticateUser, submitJambExamAnswers);

export default router;
