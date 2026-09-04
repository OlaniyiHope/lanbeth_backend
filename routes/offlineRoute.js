// import express from "express";
// import {
//   submitExam,
//   deleteExam,
//   addSessionToExamWithoutSession,
// } from "../controller/OfflineExam.js";
// import {
//   addSessionToMarks,
//   deleteScores,
//   getMark,
//   getMarkbyStudent,
//   getMarkbyStudentwithoutsession,
//   getScores,
//   saveMark,
//   updateMark,
//   updateMarks,
// } from "../controller/offMarkController.js";

// const router = express.Router();

// //CREATE route
// router.post("/offlineexam", submitExam);
// router.post("/addSessionToExamWithoutSession", addSessionToExamWithoutSession);
// router.post("/save-marks/:sessionId", saveMark);
// // Add the new route for getting scores
// router.get("/get-scores/:examName/:sessionId", getMark);

// router.get(
//   "/get-scores-by-student/:studentId/:sessionId",
//   // authenticateUser,
//   getMarkbyStudent
// );
// router.get(
//   "/get-scored-by-student/:studentId",
//   // authenticateUser,
//   getMarkbyStudentwithoutsession
// );
// router.post("/add-session-to-marks", addSessionToMarks);

// // router.get("/get-all-scores/:examId/:subjectId", getScores);
// router.get("/get-all-scores/:examId/:subjectId/:sessionId", getScores);

// router.put("/update-all-marks/:sessionId", updateMarks);

// router.put("/update-marks/:studentId", updateMark);
// router.delete("/deleteexam/:examId", deleteExam);
// router.delete("/delete-scores/:examId/:subjectId/:sessionId", deleteScores);

// // export default router;
// import express from "express";
// import {
//   submitExam,
//   deleteExam,
//   addSessionToExamWithoutSession,
// } from "../controller/OfflineExam.js";
// import {
//   addSessionToMarks,
//   getMark,
//   getMarkbyStudent,
//   getMarkbyStudentwithoutsession,
//   getScores,
//   saveMark,
//   updateMark,
//   updateMarks,
//   saveOrUpdateMarks
// } from "../controller/offMarkController.js";

// const router = express.Router();

// //CREATE route
// router.post("/offlineexam", submitExam);
// router.post("/addSessionToExamWithoutSession", addSessionToExamWithoutSession);
// router.post("/save-marks/:sessionId", saveMark);
// router.post("/save-or-update/:sessionId", saveOrUpdateMarks);
// // Add the new route for getting scores
// router.get("/get-scores/:examName/:sessionId", getMark);

// router.get(
//   "/get-scores-by-student/:studentId/:sessionId",
//   // authenticateUser,
//   getMarkbyStudent
// );
// router.get(
//   "/get-scored-by-student/:studentId",
//   // authenticateUser,
//   getMarkbyStudentwithoutsession
// );
// router.post("/add-session-to-marks", addSessionToMarks);

// // router.get("/get-all-scores/:examId/:subjectId", getScores);
// router.get(
//   "/get-all-scores/:examId/:subjectId",
//   getScores
// );


// router.put("/update-all-marks", updateMarks);

// router.put("/update-marks/:studentId", updateMark);
// router.delete("/deleteexam/:examId", deleteExam);

// export default router;


import express from "express";
import multer from "multer";
import {
  submitExam,
  deleteExam,
  addSessionToExamWithoutSession,
} from "../controller/OfflineExam.js";
import {
  addSessionToMarks,
  getMark,
  getMarkbyStudent,
  getMarkbyStudentwithoutsession,
  getScores,
  saveMark,
  updateMark,
  updateMarks,
  getAllScoresForExamSession,
  fixSubjectIds,
  importMarks,
} from "../controller/offMarkController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//CREATE route
router.post("/offlineexam", submitExam);
router.post("/addSessionToExamWithoutSession", addSessionToExamWithoutSession);
router.post("/save-marks/:sessionId", saveMark);
router.post("/import-marks/:sessionId", upload.single("file"), importMarks);
router.post(
  "/fix-subject-ids/:sessionId/:examId", // optional if you require auth
  fixSubjectIds
);

// Add the new route for getting scores
router.get("/get-scores/:examName/:sessionId", getMark);

router.get(
  "/get-scores-by-student/:studentId/:sessionId",
  // authenticateUser,
  getMarkbyStudent
);
router.get(
  "/get-scored-by-student/:studentId",
  // authenticateUser,
  getMarkbyStudentwithoutsession
);
router.post("/add-session-to-marks", addSessionToMarks);

// router.get("/get-all-scores/:examId/:subjectId", getScores);
// router.get(
//   "/get-all-scores/:examId/:subjectId/:sessionId",
//   getScores
// );
router.get(
  "/get-all-scores/:examId/:subjectId",
  getScores
);

router.get("/get-all-scored/:examId/:sessionId/:classname", getAllScoresForExamSession);

router.put("/update-all-marks", updateMarks);

router.put("/update-marks/:studentId", updateMark);
router.delete("/deleteexam/:examId", deleteExam);

export default router;
