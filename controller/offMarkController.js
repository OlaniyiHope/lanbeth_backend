// // import mongoose from "mongoose";
// // import Mark from "../models/markModel.js";
// // import Exam from "../models/examModel.js";
// // import Session from "../models/sessionModel.js";

// // // export const saveMark = async (req, res) => {
// // //   const { sessionId } = req.params;

// // //   try {
// // //     const { examId, subjectId, updates } = req.body;
// // //     console.log("Received in saveMark controller:", req.body);

// // //     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
// // //       return res.status(400).json({ error: "Invalid session ID" });
// // //     }

// // //     // Check if updates array is present in the request body
// // //     if (!updates || !Array.isArray(updates)) {
// // //       return res
// // //         .status(400)
// // //         .json({ message: "Invalid or missing updates array" });
// // //     }

// // //     // Fetch existing marks for the specified exam and subject
// // //     const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

// // //     // If existing marks are not found or the array is empty, proceed to create new marks
// // //     if (!existingMarks || existingMarks.marks.length === 0) {
// // //       // Save marks to the database using the provided examId and subjectId
// // //       const savedMarks = await Mark.create({
// // //         examId,
// // //         subjectId,
// // //         session: sessionId,
// // //         marks: await Promise.all(
// // //           updates.map(async (mark) => {
// // //             const { studentId, testscore, examscore, marksObtained, comment } =
// // //               mark;

// // //             return {
// // //               studentId,
// // //               subjectId: subjectId, // Add subjectId
// // //               testscore,
// // //               examscore,
// // //               marksObtained,
// // //               comment,
// // //             };
// // //           })
// // //         ),
// // //       });
// // //       console.log("Saved marks:", savedMarks);

// // //       return res.status(201).json({
// // //         message: "Marks saved successfully",
// // //         savedMarks,
// // //       });
// // //     }

// // //     // If existing marks are found, update the marks
// // //     existingMarks.marks.forEach((existingMark) => {
// // //       const update = updates.find(
// // //         (mark) => mark.studentId === existingMark.studentId
// // //       );

// // //       if (update) {
// // //         existingMark.testscore = update.testscore;
// // //         existingMark.examscore = update.examscore;
// // //         existingMark.marksObtained = update.marksObtained;
// // //         existingMark.comment = update.comment;
// // //       }
// // //     });

// // //     await existingMarks.save();

// // //     res.status(200).json({
// // //       message: "Marks updated successfully",
// // //       updatedMarks: existingMarks,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error saving/updating marks:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // // Importing necessary modules

// // export const saveMark = async (req, res) => {
// //   const { sessionId } = req.params;

// //   try {
// //     const { examId, subjectId, updates } = req.body;
// //     console.log("Received in saveMark controller:", req.body);

// //     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
// //       return res.status(400).json({ error: "Invalid session ID" });
// //     }

// //     if (!updates || !Array.isArray(updates)) {
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid or missing updates array" });
// //     }

// //     // Fetch existing marks for the specified exam and subject
// //     const existingMarks = await Mark.findOne({
// //       examId,
// //       subjectId,
// //       session: sessionId,
// //     });

// //     if (!existingMarks || existingMarks.marks.length === 0) {
// //       // Save marks if not found
// //       const savedMarks = await Mark.create({
// //         examId,
// //         subjectId,
// //         session: sessionId,
// //         marks: await Promise.all(
// //           updates.map(async (mark) => {
// //             const { studentId, testscore, examscore, marksObtained, comment } =
// //               mark;

// //             return {
// //               studentId,
// //               subjectId,
// //               testscore,
// //               examscore,
// //               marksObtained,
// //               comment,
// //             };
// //           })
// //         ),
// //       });
// //       console.log("Saved marks:", savedMarks);

// //       return res.status(201).json({
// //         message: "Marks saved successfully",
// //         savedMarks,
// //       });
// //     }

// //     // If marks exist, update the marks for each student
// //     existingMarks.marks.forEach((existingMark) => {
// //       const update = updates.find(
// //         (mark) => mark.studentId === existingMark.studentId
// //       );

// //       if (update) {
// //         existingMark.testscore = update.testscore;
// //         existingMark.examscore = update.examscore;
// //         existingMark.marksObtained = update.marksObtained;
// //         existingMark.comment = update.comment;
// //       }
// //     });

// //     await existingMarks.save();

// //     res.status(200).json({
// //       message: "Marks updated successfully",
// //       updatedMarks: existingMarks,
// //     });
// //   } catch (error) {
// //     console.error("Error saving/updating marks:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getMark = async (req, res) => {
// //   try {
// //     const { examName, sessionId } = req.params;

// //     // Fetch the exam based on the provided examName
// //     const fetchedExam = await Exam.findOne({ name: examName });

// //     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

// //     if (!fetchedExam) {
// //       return res.status(404).json({ message: "Exam not found" });
// //     }

// //     // Fetch the marks based on the ObjectId of the fetched exam
// //     const marks = await Mark.find({
// //       examId: fetchedExam._id,
// //       session: sessionObjectId,
// //     });

// //     if (marks.length === 0) {
// //       return res.status(404).json({ message: "Marks not found" });
// //     }

// //     // Ensure each mark has the subjectId populated
// //     const scores = marks.map((mark) => ({
// //       subjectId: mark.subjectId, // Make sure subjectId is set in your schema
// //       ...mark.toObject(),
// //     }));

// //     res.status(200).json({ examId: fetchedExam._id, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // // export const getMarkbyStudent = async (req, res) => {
// // //   try {
// // //     const userId = req.params.studentId; // Assuming the studentId is passed as a parameter in the URL

// // //     // Fetch marks for the specified student and populate the necessary fields
// // //     const marks = await Mark.find({ "marks.studentId": userId })
// // //       .populate("examId", "name")
// // //       .populate("marks.subjectId", "name");

// // //     // Ensure each mark has the examId and subjectId populated
// // //     const scores = marks.flatMap((mark) =>
// // //       mark.marks
// // //         .filter((m) => m.studentId.toString() === userId)
// // //         .map((m) => ({
// // //           examId: mark.examId,
// // //           subjectId: m.subjectId,
// // //           examName: mark.examId.name,
// // //           subjectName: m.subjectId.name,
// // //           testscore: m.testscore,
// // //           ...m.toObject(),
// // //         }))
// // //     );

// // //     res.status(200).json({ studentId: userId, scores });
// // //   } catch (error) {
// // //     console.error("Error fetching marks for student:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };
// // // export const getMarkbyStudent = async (req, res) => {
// // //   try {
// // //     const userId = req.params.studentId;

// // //     const marks = await Mark.find({ "marks.studentId": userId })
// // //       .populate("examId", "name")
// // //       .populate("marks.subjectId", "name");

// // //     // const scores = marks.flatMap((mark) =>
// // //     //   mark.marks
// // //     //     .filter(
// // //     //       (m) =>
// // //     //         m.studentId.toString() === userId &&
// // //     //         (m.testscore !== 0 || m.examscore !== 0) &&
// // //     //         m.comment.trim() !== ""
// // //     //     )
// // //     //     .map((m) => ({
// // //     //       examId: mark.examId,
// // //     //       subjectId: m.subjectId,
// // //     //       examName: mark.examId.name,
// // //     //       subjectName: m.subjectId.name,
// // //     //       testscore: m.testscore,
// // //     //       ...m.toObject(),
// // //     //     }))
// // //     // );
// // //     // const scores = marks.flatMap((mark) =>
// // //     //   mark.marks
// // //     //     .filter(
// // //     //       (m) =>
// // //     //         m.studentId.toString() === userId &&
// // //     //         (m.testscore !== 0 || m.examscore !== 0) &&
// // //     //         m.comment.trim() !== ""
// // //     //     )
// // //     //     .map((m) => ({
// // //     //       examId: mark.examId,
// // //     //       subjectId: m.subjectId,
// // //     //       examName: mark.examId?.name || "Unknown Exam",
// // //     //       subjectName: m.subjectId?.name || "Unknown Subject",
// // //     //       testscore: m.testscore,
// // //     //       ...m.toObject(),
// // //     //     }))
// // //     // );
// // //     const scores = marks.flatMap((mark) =>
// // //       mark.marks
// // //         .filter(
// // //           (m) =>
// // //             m.studentId.toString() === userId &&
// // //             (m.testscore !== 0 || m.examscore !== 0) &&
// // //             m.comment.trim() !== "" &&
// // //             mark.examId &&
// // //             m.subjectId
// // //         )
// // //         .map((m) => ({
// // //           examId: mark.examId,
// // //           subjectId: m.subjectId,
// // //           examName: mark.examId.name,
// // //           subjectName: m.subjectId.name,
// // //           testscore: m.testscore,
// // //           ...m.toObject(),
// // //         }))
// // //     );

// // //     res.status(200).json({ studentId: userId, scores });
// // //   } catch (error) {
// // //     console.error("Error fetching marks for student:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // // export const getMarkbyStudent = async (req, res) => {
// // //   try {
// // //     const { studentId, sessionId } = req.params;

// // //     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

// // //     const marks = await Mark.find({
// // //       "marks.studentId": studentId,
// // //       session: sessionObjectId,
// // //     })
// // //       .populate("examId", "name")
// // //       .populate("marks.subjectId", "name");

// // //     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

// // //     const scores = marks.flatMap(
// // //       (mark) =>
// // //         mark.marks
// // //           .filter(
// // //             (m) =>
// // //               m.studentId.toString() === studentId &&
// // //               (m.testscore !== 0 || m.examscore !== 0) &&
// // //               m.comment.trim() !== "" &&
// // //               mark.examId &&
// // //               m.subjectId
// // //           )
// // //           .map((m) => {
// // //             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
// // //             // Check if subject ID exists in the Map
// // //             if (!uniqueSubjects.has(subjectKey)) {
// // //               // If subject doesn't exist, add it to the Map and return the mapped object
// // //               uniqueSubjects.set(subjectKey, true);
// // //               return {
// // //                 examId: mark.examId,
// // //                 subjectId: m.subjectId,
// // //                 examName: mark.examId.name,
// // //                 subjectName: m.subjectId.name,
// // //                 testscore: m.testscore,
// // //                 ...m.toObject(),
// // //               };
// // //             }
// // //             return null; // If subject exists, return null (to filter it out)
// // //           })
// // //           .filter((m) => m !== null) // Filter out null values
// // //     );

// // //     res.status(200).json({ studentId: studentId, scores });
// // //   } catch (error) {
// // //     console.error("Error fetching marks for student:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };
// // // export const getMarkbyStudent = async (req, res) => {
// // //   try {
// // //     const { studentId, sessionId } = req.params;

// // //     // Fetch marks where the session matches
// // //     const marks = await Mark.find({
// // //       "marks.studentId": studentId,
// // //       session: sessionId,
// // //     })
// // //       .populate("examId", "name") // Populate exam details
// // //       .populate("marks.subjectId", "name"); // Populate subject details

// // //     if (!marks || marks.length === 0) {
// // //       return res
// // //         .status(404)
// // //         .json({ message: "No marks found for the student." });
// // //     }

// // //     // Filter and map marks to include only data for the specified student
// // //     const scores = marks.map((mark) => ({
// // //       examId: mark.examId?._id,
// // //       examName: mark.examId?.name,
// // //       subjects: mark.marks
// // //         .filter((m) => m.studentId.toString() === studentId) // Filter for this student only
// // //         .map((m) => ({
// // //           testScore: m.testscore,
// // //           examScore: m.examscore,
// // //           comment: m.comment,
// // //           subjectId: m.subjectId?._id,
// // //           subjectName: m.subjectId?.name,
// // //         })),
// // //     }));

// // //     res.status(200).json({ studentId, sessionId, scores });
// // //   } catch (error) {
// // //     console.error("Error fetching marks for student:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     // Querying with "session" field instead of "sessionId"
// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionId, // Corrected to match the field in your database
// //     })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     console.log("Marks found:", marks); // Log what is being returned

// //     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

// //     const scores = marks.flatMap(
// //       (mark) =>
// //         mark.marks
// //           .filter(
// //             (m) =>
// //               m.studentId.toString() === studentId &&
// //               (m.testscore !== 0 || m.examscore !== 0) &&
// //               m.comment.trim() !== "" &&
// //               mark.examId &&
// //               m.subjectId
// //           )
// //           .map((m) => {
// //             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
// //             // Check if subject ID exists in the Map
// //             if (!uniqueSubjects.has(subjectKey)) {
// //               // If subject doesn't exist, add it to the Map and return the mapped object
// //               uniqueSubjects.set(subjectKey, true);
// //               return {
// //                 examId: mark.examId,
// //                 subjectId: m.subjectId,
// //                 examName: mark.examId.name,
// //                 subjectName: m.subjectId.name,
// //                 testscore: m.testscore,
// //                 ...m.toObject(),
// //               };
// //             }
// //             return null; // If subject exists, return null (to filter it out)
// //           })
// //           .filter((m) => m !== null) // Filter out null values
// //     );

// //     res.status(200).json({ studentId, sessionId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getMarkbyStudentwithoutsession = async (req, res) => {
// //   try {
// //     const userId = req.params.studentId;

// //     const marks = await Mark.find({ "marks.studentId": userId })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

// //     const scores = marks.flatMap(
// //       (mark) =>
// //         mark.marks
// //           .filter(
// //             (m) =>
// //               m.studentId.toString() === userId &&
// //               (m.testscore !== 0 || m.examscore !== 0) &&
// //               m.comment.trim() !== "" &&
// //               mark.examId &&
// //               m.subjectId
// //           )
// //           .map((m) => {
// //             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
// //             // Check if subject ID exists in the Map
// //             if (!uniqueSubjects.has(subjectKey)) {
// //               // If subject doesn't exist, add it to the Map and return the mapped object
// //               uniqueSubjects.set(subjectKey, true);
// //               return {
// //                 examId: mark.examId,
// //                 subjectId: m.subjectId,
// //                 examName: mark.examId.name,
// //                 subjectName: m.subjectId.name,
// //                 testscore: m.testscore,
// //                 ...m.toObject(),
// //               };
// //             }
// //             return null; // If subject exists, return null (to filter it out)
// //           })
// //           .filter((m) => m !== null) // Filter out null values
// //     );

// //     res.status(200).json({ studentId: userId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // // export const getScores = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId } = req.params;

// // //     const isExamIdValid = mongoose.isValidObjectId(examId);
// // //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);

// // //     if (!isExamIdValid && !isSubjectIdValid) {
// // //       return res.status(400).json({
// // //         message: "Invalid ObjectId format for both examId and subjectId",
// // //       });
// // //     }

// // //     const marks = await Mark.findOne({
// // //       examId: isExamIdValid ? mongoose.Types.ObjectId(examId) : null,
// // //       "marks.subjectId": isSubjectIdValid
// // //         ? mongoose.Types.ObjectId(subjectId)
// // //         : null,
// // //     });

// // //     if (!marks) {
// // //       return res.status(200).json({ examId, subjectId, scores: [] });
// // //     }

// // //     // Populate the studentId field to get the student details
// // //     await Mark.populate(marks, {
// // //       path: "marks.studentId",
// // //       select: "studentName",
// // //     });

// // //     // Extract relevant information for response
// // //     const scores = marks.marks.map((m) => ({
// // //       studentId: m.studentId,
// // //       studentName: m.studentId ? m.studentId.studentName : null,
// // //       testscore: m.testscore,
// // //       examscore: m.examscore,
// // //       marksObtained: m.testscore + m.examscore,
// // //       comment: m.comment,
// // //     }));

// // //     res.status(200).json({ examId, subjectId, scores });
// // //   } catch (error) {
// // //     console.error("Error fetching scores:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // // export const getScores = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId, sessionId } = req.params;

// // //     const isExamIdValid = mongoose.isValidObjectId(examId);
// // //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// // //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// // //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// // //       return res.status(400).json({
// // //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// // //       });
// // //     }

// // //     const marks = await Mark.findOne({
// // //       examId: mongoose.Types.ObjectId(examId),
// // //       session: mongoose.Types.ObjectId(sessionId),
// // //       // "marks.subjectId": mongoose.Types.ObjectId(subjectId),
// // //       marks: {
// // //         $elemMatch: { subjectId: mongoose.Types.ObjectId(subjectId) },
// // //       },
// // //     });

// // //     if (!marks) {
// // //       return res.status(200).json({ examId, subjectId, sessionId, scores: [] });
// // //     }

// // //     await Mark.populate(marks, {
// // //       path: "marks.studentId",
// // //       select: "studentName",
// // //     });

// // //     const scores = marks.marks
// // //       .filter((m) => m.subjectId.toString() === subjectId)
// // //       .map((m) => ({
// // //         studentId: m.studentId,
// // //         studentName: m.studentId ? m.studentId.studentName : null,
// // //         testscore: m.testscore,
// // //         examscore: m.examscore,
// // //         marksObtained: m.testscore + m.examscore,
// // //         comment: m.comment,
// // //       }));

// // //     res.status(200).json({ examId, subjectId, sessionId, scores });
// // //   } catch (error) {
// // //     console.error("Error fetching scores:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // // export const getScores = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId, sessionId } = req.params;

// // //     // Validate ObjectIds
// // //     const isExamIdValid = mongoose.isValidObjectId(examId);
// // //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// // //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// // //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// // //       return res.status(400).json({
// // //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// // //       });
// // //     }

// // //     // Find mark document for the exam & session that contains the subject
// // //     const marks = await Mark.findOne({
// // //       examId: mongoose.Types.ObjectId(examId),
// // //       session: mongoose.Types.ObjectId(sessionId),
// // //       marks: {
// // //         $elemMatch: { subjectId: mongoose.Types.ObjectId(subjectId) },
// // //       },
// // //     });

// // //     if (!marks) {
// // //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// // //     }

// // //     // Populate student names in the marks
// // //     await Mark.populate(marks, {
// // //       path: "marks.studentId",
// // //       select: "studentName",
// // //     });

// // //     // Add marksObtained = testscore + examscore to each mark
// // //     const filteredMarks = marks.marks
// // //       .filter((m) => m.subjectId.toString() === subjectId)
// // //       .map((m) => ({
// // //         _id: m._id,
// // //         studentId: m.studentId._id,
// // //         studentName: m.studentId.studentName,
// // //         subjectId: m.subjectId,
// // //         testscore: m.testscore,
// // //         examscore: m.examscore,
// // //         marksObtained: m.testscore + m.examscore,
// // //         comment: m.comment,
// // //       }));

// // //     // Final structured response
// // //     res.status(200).json({
// // //       _id: marks._id,
// // //       examId: marks.examId,
// // //       session: marks.session,
// // //       marks: filteredMarks,
// // //       createdAt: marks.createdAt,
// // //       updatedAt: marks.updatedAt,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching scores:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // // export const getScores = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId, sessionId } = req.params;

// // //     // Validate ObjectIds
// // //     const isExamIdValid = mongoose.isValidObjectId(examId);
// // //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// // //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// // //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// // //       return res.status(400).json({
// // //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// // //       });
// // //     }

// // //     // Find mark document for the exam & session that contains the subject
// // //     const marks = await Mark.findOne({
// // //       examId: mongoose.Types.ObjectId(examId),
// // //       session: mongoose.Types.ObjectId(sessionId),
// // //       marks: {
// // //         $elemMatch: { subjectId: mongoose.Types.ObjectId(subjectId) },
// // //       },
// // //     });

// // //     if (!marks) {
// // //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// // //     }

// // //     // Populate student names in the marks
// // //     await Mark.populate(marks, {
// // //       path: "marks.studentId",
// // //       select: "studentName",
// // //     });

// // //     // Add marksObtained = testscore + examscore to each mark
// // //     const filteredMarks = marks.marks
// // //       .filter((m) => m.subjectId.toString() === subjectId)
// // //       .map((m) => ({
// // //         _id: m._id,
// // //         studentId: m.studentId._id,
// // //         studentName: m.studentId.studentName,
// // //         subjectId: m.subjectId,
// // //         testscore: m.testscore,
// // //         examscore: m.examscore,
// // //         marksObtained: m.testscore + m.examscore,
// // //         comment: m.comment,
// // //       }));

// // //     res.status(200).json({
// // //       _id: marks._id,
// // //       examId: marks.examId,
// // //       session: marks.session,
// // //       marks: filteredMarks,
// // //       createdAt: marks.createdAt,
// // //       updatedAt: marks.updatedAt,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching scores:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };

// // // export const getScores = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId, sessionId } = req.params;

// // //     // Validate ObjectIds
// // //     const isExamIdValid = mongoose.isValidObjectId(examId);
// // //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// // //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// // //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// // //       return res.status(400).json({
// // //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// // //       });
// // //     }

// // //     // Find all marks documents that match the examId, subjectId, and sessionId
// // //     const marks = await Mark.find({
// // //       examId: mongoose.Types.ObjectId(examId),
// // //       session: mongoose.Types.ObjectId(sessionId),
// // //       "marks.subjectId": mongoose.Types.ObjectId(subjectId),
// // //     });

// // //     if (!marks || marks.length === 0) {
// // //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// // //     }

// // //     // Flatten the marks array
// // //     let filteredMarks = [];

// // //     // Loop through each mark document
// // //     for (let mark of marks) {
// // //       // Filter and populate student names in the marks array
// // //       await Mark.populate(mark, {
// // //         path: "marks.studentId",
// // //         select: "studentName",
// // //       });

// // //       const subjectMarks = mark.marks
// // //         .filter((m) => m.subjectId.toString() === subjectId)
// // //         .map((m) => ({
// // //           _id: m._id,
// // //           studentId: m.studentId._id,
// // //           studentName: m.studentId.studentName,
// // //           subjectId: m.subjectId,
// // //           testscore: m.testscore,
// // //           examscore: m.examscore,
// // //           marksObtained: m.testscore + m.examscore,
// // //           comment: m.comment,
// // //         }));

// // //       // Add to filteredMarks array
// // //       filteredMarks = filteredMarks.concat(subjectMarks);
// // //     }

// // //     res.status(200).json({
// // //       examId,
// // //       subjectId,
// // //       sessionId,
// // //       marks: filteredMarks,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching scores:", error);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // };
// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     // Validate ObjectIds
// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// //       });
// //     }

// //     // Find all marks documents that match the examId, subjectId, and sessionId
// //     const marks = await Mark.find({
// //       examId: mongoose.Types.ObjectId(examId),
// //       session: mongoose.Types.ObjectId(sessionId),
// //       "marks.subjectId": mongoose.Types.ObjectId(subjectId),
// //     });

// //     if (!marks || marks.length === 0) {
// //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// //     }

// //     // Flatten the marks array
// //     let filteredMarks = [];

// //     // Loop through each mark document
// //     for (let mark of marks) {
// //       // Filter and populate student names in the marks array
// //       await Mark.populate(mark, {
// //         path: "marks.studentId",
// //         select: "studentName",
// //       });

// //       const subjectMarks = mark.marks
// //         .filter((m) => m.subjectId.toString() === subjectId)
// //         .map((m) => ({
// //           _id: m._id,
// //           studentId: m.studentId._id,
// //           studentName: m.studentId.studentName,
// //           subjectId: m.subjectId,
// //           testscore: m.testscore,
// //           examscore: m.examscore,
// //           marksObtained: m.marksObtained, // Use the saved value of marksObtained
// //           comment: m.comment,
// //         }));

// //       // Add to filteredMarks array
// //       filteredMarks = filteredMarks.concat(subjectMarks);
// //     }

// //     res.status(200).json({
// //       examId,
// //       subjectId,
// //       sessionId,
// //       marks: filteredMarks,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // // Delete all scores for a given exam, subject, and session
// // export const deleteScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     // Validate ObjectIds
// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// //       });
// //     }

// //     // Remove all scores for the specific exam, subject, and session
// //     const result = await Mark.updateMany(
// //       {
// //         examId: mongoose.Types.ObjectId(examId),
// //         session: mongoose.Types.ObjectId(sessionId),
// //         "marks.subjectId": mongoose.Types.ObjectId(subjectId),
// //       },
// //       {
// //         $pull: { marks: { subjectId: mongoose.Types.ObjectId(subjectId) } },
// //       }
// //     );

// //     if (result.nModified === 0) {
// //       return res
// //         .status(404)
// //         .json({ message: "No scores found for the given parameters" });
// //     }

// //     res.status(200).json({ message: "Scores deleted successfully" });
// //   } catch (error) {
// //     console.error("Error deleting scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const updateMark = async (req, res) => {
// //   try {
// //     const { examId, subjectId, testscore, examscore, marksObtained, comment } =
// //       req.body;
// //     const studentIdToUpdate = req.params.studentId;

// //     const result = await Mark.updateOne(
// //       {
// //         "marks.studentId": studentIdToUpdate,
// //         examId,
// //         "marks.subjectId": subjectId,
// //       },
// //       {
// //         $set: {
// //           "marks.$[elem].testscore": testscore,
// //           "marks.$[elem].examscore": examscore,
// //           "marks.$[elem].marksObtained": marksObtained,
// //           "marks.$[elem].comment": comment,
// //         },
// //       },
// //       {
// //         arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
// //       }
// //     );

// //     console.log("Update Result:", result);
// //     console.log("Request Body:", req.body);

// //     if (result.nModified === 0) {
// //       return res
// //         .status(404)
// //         .json({ error: "No matching records found for update" });
// //     }

// //     const updatedDocument = await Mark.findOne({
// //       "marks.studentId": studentIdToUpdate,
// //       examId,
// //       "marks.subjectId": subjectId,
// //     });

// //     res
// //       .status(200)
// //       .json({ message: "Marks updated successfully", updatedDocument });
// //   } catch (error) {
// //     console.error("Error updating marks:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // };
// // export const addSessionToMarks = async (req, res) => {
// //   try {
// //     const { sessionId } = req.body; // Get sessionId from request body

// //     if (!sessionId) {
// //       return res.status(400).json({ message: "sessionId is required" });
// //     }

// //     // Find all Mark documents that do not have a session field
// //     const marksToUpdate = await Mark.find({
// //       session: { $exists: false },
// //     });

// //     if (marksToUpdate.length === 0) {
// //       return res
// //         .status(404)
// //         .json({ message: "No marks found without session" });
// //     }

// //     // Loop through each Mark document and update it with the sessionId
// //     for (const mark of marksToUpdate) {
// //       mark.session = sessionId; // Set the sessionId at the root level
// //       await mark.save(); // Save the updated mark document
// //     }

// //     res.status(200).json({
// //       message: "SessionId added to all marks",
// //       updated: marksToUpdate.length,
// //     });
// //   } catch (error) {
// //     console.error("Error adding sessionId to marks:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // // export const updateMarks = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId, updates, sessionId } = req.body;
// // //     console.log("Received in saveMark controller update:", req.body);

// // //     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
// // //       return res.status(400).json({ error: "Invalid request payload" });
// // //     }

// // //     const results = [];
// // //     const updatedDocuments = [];

// // //     for (const update of updates) {
// // //       const { studentId, testscore, examscore, marksObtained, comment } =
// // //         update;

// // //       const filter = {
// // //         examId,
// // //         sessionId,
// // //         "marks.studentId": studentId,
// // //         "marks.subjectId": subjectId,
// // //       };

// // //       const updateOperation = {
// // //         $set: {
// // //           "marks.$[elem].testscore": testscore,
// // //           "marks.$[elem].examscore": examscore,
// // //           "marks.$[elem].marksObtained": marksObtained,
// // //           "marks.$[elem].comment": comment,
// // //         },
// // //       };

// // //       const options = {
// // //         arrayFilters: [{ "elem.studentId": studentId }],
// // //         new: true,
// // //       };

// // //       let updatedDoc = await Mark.findOneAndUpdate(
// // //         filter,
// // //         updateOperation,
// // //         options
// // //       );

// // //       if (!updatedDoc) {
// // //         // If the document doesn't exist, create a new mark
// // //         const newMark = {
// // //           subjectId,
// // //           studentId,
// // //           testscore,
// // //           examscore,
// // //           marksObtained,
// // //           comment,
// // //         };

// // //         const filter = { examId };
// // //         const update = { $push: { marks: newMark } };
// // //         const options = { upsert: true, new: true };

// // //         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
// // //       }

// // //       updatedDocuments.push(updatedDoc);

// // //       results.push({
// // //         studentId,
// // //         success: true,
// // //       });
// // //     }

// // //     res.status(200).json({
// // //       message: "Marks updated successfully",
// // //       results,
// // //       updatedDocuments,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error updating marks:", error);
// // //     res.status(500).json({ error: "Internal Server Error" });
// // //   }
// // // };

// // // export const updateMarks = async (req, res) => {
// // //   try {
// // //     const { examId, subjectId, updates, sessionId } = req.body;
// // //     console.log("Received in saveMark controller update:", req.body);

// // //     // Validate input data
// // //     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
// // //       return res.status(400).json({ error: "Invalid request payload" });
// // //     }

// // //     const results = [];
// // //     const updatedDocuments = [];

// // //     for (const update of updates) {
// // //       const { studentId, testscore, examscore, marksObtained, comment } =
// // //         update;

// // //       // Build the filter to find the correct exam and student marks
// // //       const filter = {
// // //         examId,
// // //         sessionId,
// // //         "marks.studentId": studentId,
// // //         "marks.subjectId": subjectId, // Ensure the right subjectId is matched
// // //       };

// // //       // Define the update operation
// // //       const updateOperation = {
// // //         $set: {
// // //           "marks.$[elem].testscore": testscore,
// // //           "marks.$[elem].examscore": examscore,
// // //           "marks.$[elem].marksObtained": marksObtained,
// // //           "marks.$[elem].comment": comment,
// // //         },
// // //       };

// // //       // Array filter to ensure only the correct student in the marks array is updated
// // //       const options = {
// // //         arrayFilters: [{ "elem.studentId": studentId }],
// // //         new: true,
// // //       };

// // //       // Attempt to find and update the marks for the student
// // //       let updatedDoc = await Mark.findOneAndUpdate(
// // //         filter,
// // //         updateOperation,
// // //         options
// // //       );

// // //       if (!updatedDoc) {
// // //         // If the document doesn't exist (i.e., no matching student marks), create a new mark
// // //         const newMark = {
// // //           subjectId,
// // //           studentId,
// // //           testscore,
// // //           examscore,
// // //           marksObtained,
// // //           comment,
// // //         };

// // //         // If no document is found, push a new mark for the student into the marks array
// // //         const filter = { examId, sessionId };
// // //         const update = { $push: { marks: newMark } };
// // //         const options = { upsert: true, new: true };

// // //         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
// // //       }

// // //       // Track the updated document
// // //       updatedDocuments.push(updatedDoc);

// // //       // Track the update success for the student
// // //       results.push({
// // //         studentId,
// // //         success: true,
// // //       });
// // //     }

// // //     // Return response with updated documents and results
// // //     res.status(200).json({
// // //       message: "Marks updated successfully",
// // //       results,
// // //       updatedDocuments,
// // //     });
// // //   } catch (error) {
// // //     // Catch and handle errors
// // //     console.error("Error updating marks:", error);
// // //     res.status(500).json({ error: "Internal Server Error" });
// // //   }
// // // };

// // export const updateMarks = async (req, res) => {
// //   try {
// //     const { examId, subjectId, updates, sessionId } = req.body;
// //     console.log("Received in updateMark controller:", req.body);

// //     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
// //       return res.status(400).json({ error: "Invalid request payload" });
// //     }

// //     const results = [];
// //     const updatedDocuments = [];

// //     for (const update of updates) {
// //       const { studentId, testscore, examscore, marksObtained, comment } =
// //         update;

// //       // Build the filter to find the correct exam and student marks
// //       const filter = {
// //         examId,
// //         sessionId,
// //         "marks.studentId": studentId,
// //         "marks.subjectId": subjectId, // Ensure the right subjectId is matched
// //       };

// //       // Define the update operation
// //       const updateOperation = {
// //         $set: {
// //           "marks.$[elem].testscore": testscore,
// //           "marks.$[elem].examscore": examscore,
// //           "marks.$[elem].marksObtained": marksObtained,
// //           "marks.$[elem].comment": comment,
// //         },
// //       };

// //       // Array filter to ensure only the correct student in the marks array is updated
// //       const options = {
// //         arrayFilters: [{ "elem.studentId": studentId }],
// //         new: true,
// //       };

// //       // Attempt to find and update the marks for the student
// //       let updatedDoc = await Mark.findOneAndUpdate(
// //         filter,
// //         updateOperation,
// //         options
// //       );

// //       if (!updatedDoc) {
// //         // If the document doesn't exist (i.e., no matching student marks), create a new mark
// //         const newMark = {
// //           subjectId,
// //           studentId,
// //           testscore,
// //           examscore,
// //           marksObtained,
// //           comment,
// //         };

// //         // If no document is found, push a new mark for the student into the marks array
// //         const filter = { examId, sessionId };
// //         const update = { $push: { marks: newMark } };
// //         const options = { upsert: true, new: true };

// //         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
// //       }

// //       // Track the updated document
// //       updatedDocuments.push(updatedDoc);

// //       // Track the update success for the student
// //       results.push({
// //         studentId,
// //         success: true,
// //       });
// //     }

// //     // Return response with updated documents and results
// //     res.status(200).json({
// //       message: "Marks updated successfully",
// //       results,
// //       updatedDocuments,
// //     });
// //   } catch (error) {
// //     // Catch and handle errors
// //     console.error("Error updating marks:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // };
// import mongoose from "mongoose";
// import Mark from "../models/markModel.js";
// import Exam from "../models/examModel.js";
// import Student from "../models/userModel.js";
// import Class from "../models/classModel.js";
// import Session from "../models/sessionModel.js";

// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//       return res.status(400).json({ error: "Invalid session ID" });
//     }

//     // Check if updates array is present in the request body
//     if (!updates || !Array.isArray(updates)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing updates array" });
//     }

//     // Fetch existing marks for the specified exam and subject
//     const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

//     // If existing marks are not found or the array is empty, proceed to create new marks
//     if (!existingMarks || existingMarks.marks.length === 0) {
//       // Save marks to the database using the provided examId and subjectId
//       const savedMarks = await Mark.create({
//         examId,
//         subjectId,
//         session: sessionId,
//         marks: await Promise.all(
//           updates.map(async (mark) => {
//             const { studentId, testscore, examscore, marksObtained, comment } =
//               mark;

//             return {
//               studentId,
//               subjectId: subjectId, // Add subjectId
//               testscore,
//               examscore,
//               marksObtained,
//               comment,
//             };
//           })
//         ),
//       });

//       return res.status(201).json({
//         message: "Marks saved successfully",
//         savedMarks,
//       });
//     }

//     // If existing marks are found, update the marks
//     existingMarks.marks.forEach((existingMark) => {
//       const update = updates.find(
//         (mark) => mark.studentId === existingMark.studentId
//       );

//       if (update) {
//         existingMark.testscore = update.testscore;
//         existingMark.examscore = update.examscore;
//         existingMark.marksObtained = update.marksObtained;
//         existingMark.comment = update.comment;
//       }
//     });

//     await existingMarks.save();

//     res.status(200).json({
//       message: "Marks updated successfully",
//       updatedMarks: existingMarks,
//     });
//   } catch (error) {
//     console.error("Error saving/updating marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMark = async (req, res) => {
//   try {
//     const { examName, sessionId } = req.params;

//     // Fetch the exam based on the provided examName
//     const fetchedExam = await Exam.findOne({ name: examName });

//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     if (!fetchedExam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     // Fetch the marks based on the ObjectId of the fetched exam
//     const marks = await Mark.find({
//       examId: fetchedExam._id,
//       session: sessionObjectId,
//     });

//     if (marks.length === 0) {
//       return res.status(404).json({ message: "Marks not found" });
//     }

//     // Ensure each mark has the subjectId populated
//     const scores = marks.map((mark) => ({
//       subjectId: mark.subjectId, // Make sure subjectId is set in your schema
//       ...mark.toObject(),
//     }));

//     res.status(200).json({ examId: fetchedExam._id, scores });
//   } catch (error) {
//     console.error("Error fetching marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const userId = req.params.studentId; // Assuming the studentId is passed as a parameter in the URL

// //     // Fetch marks for the specified student and populate the necessary fields
// //     const marks = await Mark.find({ "marks.studentId": userId })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     // Ensure each mark has the examId and subjectId populated
// //     const scores = marks.flatMap((mark) =>
// //       mark.marks
// //         .filter((m) => m.studentId.toString() === userId)
// //         .map((m) => ({
// //           examId: mark.examId,
// //           subjectId: m.subjectId,
// //           examName: mark.examId.name,
// //           subjectName: m.subjectId.name,
// //           testscore: m.testscore,
// //           ...m.toObject(),
// //         }))
// //     );

// //     res.status(200).json({ studentId: userId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const userId = req.params.studentId;

// //     const marks = await Mark.find({ "marks.studentId": userId })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     // const scores = marks.flatMap((mark) =>
// //     //   mark.marks
// //     //     .filter(
// //     //       (m) =>
// //     //         m.studentId.toString() === userId &&
// //     //         (m.testscore !== 0 || m.examscore !== 0) &&
// //     //         m.comment.trim() !== ""
// //     //     )
// //     //     .map((m) => ({
// //     //       examId: mark.examId,
// //     //       subjectId: m.subjectId,
// //     //       examName: mark.examId.name,
// //     //       subjectName: m.subjectId.name,
// //     //       testscore: m.testscore,
// //     //       ...m.toObject(),
// //     //     }))
// //     // );
// //     // const scores = marks.flatMap((mark) =>
// //     //   mark.marks
// //     //     .filter(
// //     //       (m) =>
// //     //         m.studentId.toString() === userId &&
// //     //         (m.testscore !== 0 || m.examscore !== 0) &&
// //     //         m.comment.trim() !== ""
// //     //     )
// //     //     .map((m) => ({
// //     //       examId: mark.examId,
// //     //       subjectId: m.subjectId,
// //     //       examName: mark.examId?.name || "Unknown Exam",
// //     //       subjectName: m.subjectId?.name || "Unknown Subject",
// //     //       testscore: m.testscore,
// //     //       ...m.toObject(),
// //     //     }))
// //     // );
// //     const scores = marks.flatMap((mark) =>
// //       mark.marks
// //         .filter(
// //           (m) =>
// //             m.studentId.toString() === userId &&
// //             (m.testscore !== 0 || m.examscore !== 0) &&
// //             m.comment.trim() !== "" &&
// //             mark.examId &&
// //             m.subjectId
// //         )
// //         .map((m) => ({
// //           examId: mark.examId,
// //           subjectId: m.subjectId,
// //           examName: mark.examId.name,
// //           subjectName: m.subjectId.name,
// //           testscore: m.testscore,
// //           ...m.toObject(),
// //         }))
// //     );

// //     res.status(200).json({ studentId: userId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionObjectId,
// //     })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

// //     const scores = marks.flatMap(
// //       (mark) =>
// //         mark.marks
// //           .filter(
// //             (m) =>
// //               m.studentId.toString() === studentId &&
// //               (m.testscore !== 0 || m.examscore !== 0) &&
// //               m.comment.trim() !== "" &&
// //               mark.examId &&
// //               m.subjectId
// //           )
// //           .map((m) => {
// //             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
// //             // Check if subject ID exists in the Map
// //             if (!uniqueSubjects.has(subjectKey)) {
// //               // If subject doesn't exist, add it to the Map and return the mapped object
// //               uniqueSubjects.set(subjectKey, true);
// //               return {
// //                 examId: mark.examId,
// //                 subjectId: m.subjectId,
// //                 examName: mark.examId.name,
// //                 subjectName: m.subjectId.name,
// //                 testscore: m.testscore,
// //                 ...m.toObject(),
// //               };
// //             }
// //             return null; // If subject exists, return null (to filter it out)
// //           })
// //           .filter((m) => m !== null) // Filter out null values
// //     );

// //     res.status(200).json({ studentId: studentId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     // Fetch marks where the session matches
// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionId,
// //     })
// //       .populate("examId", "name") // Populate exam details
// //       .populate("marks.subjectId", "name"); // Populate subject details

// //     if (!marks || marks.length === 0) {
// //       return res
// //         .status(404)
// //         .json({ message: "No marks found for the student." });
// //     }

// //     // Filter and map marks to include only data for the specified student
// //     const scores = marks.map((mark) => ({
// //       examId: mark.examId?._id,
// //       examName: mark.examId?.name,
// //       subjects: mark.marks
// //         .filter((m) => m.studentId.toString() === studentId) // Filter for this student only
// //         .map((m) => ({
// //           testScore: m.testscore,
// //           examScore: m.examscore,
// //           comment: m.comment,
// //           subjectId: m.subjectId?._id,
// //           subjectName: m.subjectId?.name,
// //         })),
// //     }));

// //     res.status(200).json({ studentId, sessionId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     // Querying with "session" field instead of "sessionId"
// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionId, // Corrected to match the field in your database
// //     })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     console.log("Marks found:", marks); // Log what is being returned

// //     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

// //     const scores = marks.flatMap(
// //       (mark) =>
// //         mark.marks
// //           .filter(
// //             (m) =>
// //               m.studentId.toString() === studentId &&
// //               (m.testscore !== 0 || m.examscore !== 0) &&
// //               m.comment.trim() !== "" &&
// //               mark.examId &&
// //               m.subjectId
// //           )
// //           .map((m) => {
// //             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
// //             // Check if subject ID exists in the Map
// //             if (!uniqueSubjects.has(subjectKey)) {
// //               // If subject doesn't exist, add it to the Map and return the mapped object
// //               uniqueSubjects.set(subjectKey, true);
// //               return {
// //                 examId: mark.examId,
// //                 subjectId: m.subjectId,
// //                 examName: mark.examId.name,
// //                 subjectName: m.subjectId.name,
// //                 testscore: m.testscore,
// //                 ...m.toObject(),
// //               };
// //             }
// //             return null; // If subject exists, return null (to filter it out)
// //           })
// //           .filter((m) => m !== null) // Filter out null values
// //     );

// //     res.status(200).json({ studentId, sessionId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionId,
// //     })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     const scores = marks.flatMap((mark) =>
// //       mark.marks
// //         .filter(
// //           (m) =>
// //             m.studentId.toString() === studentId &&
// //             (m.testscore !== 0 || m.examscore !== 0) &&
// //             m.comment.trim() !== "" &&
// //             mark.examId &&
// //             m.subjectId
// //         )
// //         .map((m) => ({
// //           examId: mark.examId,
// //           subjectId: m.subjectId,
// //           examName: mark.examId.name,
// //           subjectName: m.subjectId.name,
// //           testscore: m.testscore,
// //           ...m.toObject(),
// //         }))
// //     );

// //     res.status(200).json({ studentId, sessionId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId,
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     // Flatten the marks and filter valid scores
//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter(
//           (m) =>
//             m.studentId.toString() === studentId &&
//             (m.testscore !== 0 || m.examscore !== 0) &&
//             m.comment.trim() !== "" &&
//             mark.examId &&
//             m.subjectId
//         )
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     // Deduplicate based on examId and subjectId using reduce
//     const uniqueScores = scores.reduce((acc, current) => {
//       // Check if an entry with the same examId and subjectId already exists
//       const isDuplicate = acc.some(
//         (item) =>
//           item.examId._id.toString() === current.examId._id.toString() &&
//           item.subjectId._id.toString() === current.subjectId._id.toString()
//       );

//       if (!isDuplicate) {
//         acc.push(current); // Add unique entry
//       }
//       return acc;
//     }, []);

//     res.status(200).json({ studentId, sessionId, scores: uniqueScores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMarkbyStudentwithoutsession = async (req, res) => {
//   try {
//     const userId = req.params.studentId;

//     const marks = await Mark.find({ "marks.studentId": userId })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

//     const scores = marks.flatMap(
//       (mark) =>
//         mark.marks
//           .filter(
//             (m) =>
//               m.studentId.toString() === userId &&
//               (m.testscore !== 0 || m.examscore !== 0) &&
//               m.comment.trim() !== "" &&
//               mark.examId &&
//               m.subjectId
//           )
//           .map((m) => {
//             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
//             // Check if subject ID exists in the Map
//             if (!uniqueSubjects.has(subjectKey)) {
//               // If subject doesn't exist, add it to the Map and return the mapped object
//               uniqueSubjects.set(subjectKey, true);
//               return {
//                 examId: mark.examId,
//                 subjectId: m.subjectId,
//                 examName: mark.examId.name,
//                 subjectName: m.subjectId.name,
//                 testscore: m.testscore,
//                 ...m.toObject(),
//               };
//             }
//             return null; // If subject exists, return null (to filter it out)
//           })
//           .filter((m) => m !== null) // Filter out null values
//     );

//     res.status(200).json({ studentId: userId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId } = req.params;

// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);

// //     if (!isExamIdValid && !isSubjectIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for both examId and subjectId",
// //       });
// //     }

// //     const marks = await Mark.findOne({
// //       examId: isExamIdValid ? mongoose.Types.ObjectId(examId) : null,
// //       "marks.subjectId": isSubjectIdValid
// //         ? mongoose.Types.ObjectId(subjectId)
// //         : null,
// //     });

// //     if (!marks) {
// //       return res.status(200).json({ examId, subjectId, scores: [] });
// //     }

// //     // Populate the studentId field to get the student details
// //     await Mark.populate(marks, {
// //       path: "marks.studentId",
// //       select: "studentName",
// //     });

// //     // Extract relevant information for response
// //     const scores = marks.marks.map((m) => ({
// //       studentId: m.studentId,
// //       studentName: m.studentId ? m.studentId.studentName : null,
// //       testscore: m.testscore,
// //       examscore: m.examscore,
// //       marksObtained: m.testscore + m.examscore,
// //       comment: m.comment,
// //     }));

// //     res.status(200).json({ examId, subjectId, scores });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, classId, sessionId } = req.params;

// //     if (
// //       !mongoose.isValidObjectId(examId) ||
// //       !mongoose.isValidObjectId(subjectId) ||
// //       !mongoose.isValidObjectId(classId) ||
// //       !mongoose.isValidObjectId(sessionId)
// //     ) {
// //       return res.status(400).json({ message: "Invalid parameters" });
// //     }

// //     const markDoc = await Mark.findOne({
// //       examId,
// //       classId,
// //       session: sessionId,
// //     }).populate({
// //       path: "marks.studentId",
// //       select: "studentName AdmNo",
// //     });

// //     if (!markDoc) {
// //       return res.status(200).json({
// //         examId,
// //         subjectId,
// //         classId,
// //         scores: [],
// //       });
// //     }

// //     // 🎯 Filter marks for this subject only
// //     const scores = markDoc.marks
// //       .filter(
// //         (m) => m.subjectId.toString() === subjectId.toString()
// //       )
// //       .map((m) => ({
// //         studentId: m.studentId?._id,
// //         studentName: m.studentId?.studentName || null,
// //         admNo: m.studentId?.AdmNo || null,
// //         testscore: m.testscore ?? 0,
// //         examscore: m.examscore ?? 0,
// //         marksObtained: (m.testscore ?? 0) + (m.examscore ?? 0),
// //         comment: m.comment || "",
// //       }));

// //     return res.status(200).json({
// //       examId,
// //       subjectId,
// //       classId,
// //       scores,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     return res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     const markDoc = await Mark.findOne({
// //       examId,
// //       session: sessionId,
// //       "marks.subjectId": subjectId,   // 🔥 THIS IS THE FIX
// //     })
// //       .populate("marks.studentId", "studentName AdmNo")
// //       .lean();

// //     if (!markDoc) {
// //       return res.status(404).json({ message: "No marks for this subject" });
// //     }

// //     const scores = markDoc.marks
// //       .filter(m => String(m.subjectId) === subjectId)
// //       .map(m => ({
// //         studentId: m.studentId?._id || m.studentId,
// //         studentName: m.studentId?.studentName || "",
// //         admNo: m.studentId?.AdmNo || "",
// //         testscore: m.testscore ?? 0,
// //         examscore: m.examscore ?? 0,
// //         marksObtained: m.marksObtained ?? 0,
// //         comment: m.comment ?? ""
// //       }));

// //     return res.json({
// //       examId,
// //       subjectId,
// //       total: scores.length,
// //       scores
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };


// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId } = req.params;

// //     console.log("🔵 Params:", { examId, subjectId });

// //     // 1️⃣ Get the exam mark document
// //     const markDoc = await Mark.findOne({ examId })
// //       .populate("marks.studentId", "studentName AdmNo")
// //       .lean();

// //     if (!markDoc) {
// //       return res.status(404).json({ message: "No marks found for this exam" });
// //     }

// //     console.log("🟢 Total marks in exam:", markDoc.marks.length);

// //     // 2️⃣ Filter marks by subject (STRING comparison)
// //     const scores = markDoc.marks
// //       .filter(m => String(m.subjectId) === String(subjectId))
// //       .map(m => ({
// //         studentId: m.studentId?._id || m.studentId,
// //         studentName: m.studentId?.studentName || "",
// //         admNo: m.studentId?.AdmNo || "",
// //         testscore: m.testscore ?? 0,
// //         examscore: m.examscore ?? 0,
// //         marksObtained: m.marksObtained ?? 0,
// //         comment: m.comment ?? ""
// //       }));

// //     console.log("✅ Scores for subject:", scores.length);

// //     return res.json({
// //       examId,
// //       subjectId,
// //       total: scores.length,
// //       scores
// //     });
// //   } catch (err) {
// //     console.error("❌ getScores error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };


// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, classId, sessionId } = req.params; // include classId and sessionId

// //     console.log("🔵 Params:", { examId, subjectId, classId, sessionId });

// //     // 1️⃣ Get all students in the class and session
// //     const students = await Student.find({ class: classId, session: sessionId }).lean();

// //     if (!students || students.length === 0) {
// //       return res.status(404).json({ message: "No students found for this class/session" });
// //     }

// //     console.log("🟢 Total students in class/session:", students.length);

// //     // 2️⃣ Get the exam marks document
// //     const markDoc = await Mark.findOne({ examId })
// //       .populate("marks.studentId", "studentName AdmNo")
// //       .lean();

// //     // Create a lookup map for marks by studentId for the specific subject
// //     const marksMap = {};
// //     if (markDoc) {
// //       markDoc.marks.forEach(m => {
// //         if (String(m.subjectId) === String(subjectId)) {
// //           marksMap[String(m.studentId?._id)] = m;
// //         }
// //       });
// //     }

// //     // 3️⃣ Merge students with marks
// //     const scores = students.map(s => {
// //       const m = marksMap[String(s._id)];
// //       return {
// //         studentId: s._id,
// //         studentName: s.studentName,
// //         admNo: s.AdmNo,
// //         testscore: m?.testscore ?? 0,
// //         examscore: m?.examscore ?? 0,
// //         marksObtained: m?.marksObtained ?? 0,
// //         comment: m?.comment ?? "",
// //       };
// //     });

// //     console.log("✅ Total scores returned:", scores.length);

// //     return res.json({
// //       examId,
// //       subjectId,
// //       total: scores.length,
// //       scores
// //     });

// //   } catch (err) {
// //     console.error("❌ getScores error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId } = req.params;

//     const markDoc = await Mark.findOne({ examId })
//       .populate("marks.studentId", "studentName AdmNo")
//       .lean();

//     if (!markDoc) {
//       return res.json({ examId, subjectId, total: 0, scores: [] });
//     }

//     const scores = markDoc.marks
//       .filter(m => String(m.subjectId) === String(subjectId))
//       .map(m => ({
//         studentId: m.studentId?._id,
//         studentName: m.studentId?.studentName || "",
//         admNo: m.studentId?.AdmNo || "",
//         testscore: m.testscore ?? 0,
//         examscore: m.examscore ?? 0,
//         marksObtained: m.marksObtained ?? 0,
//         comment: m.comment ?? "",
//       }));

//     return res.json({
//       examId,
//       subjectId,
//       total: scores.length,
//       scores,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const updateMark = async (req, res) => {
//   try {
//     const { examId, subjectId, testscore, examscore, marksObtained, comment } =
//       req.body;
//     const studentIdToUpdate = req.params.studentId;

//     const result = await Mark.updateOne(
//       {
//         "marks.studentId": studentIdToUpdate,
//         examId,
//         "marks.subjectId": subjectId,
//       },
//       {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       },
//       {
//         arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
//       }
//     );

//     console.log("Update Result:", result);
//     console.log("Request Body:", req.body);

//     if (result.nModified === 0) {
//       return res
//         .status(404)
//         .json({ error: "No matching records found for update" });
//     }

//     const updatedDocument = await Mark.findOne({
//       "marks.studentId": studentIdToUpdate,
//       examId,
//       "marks.subjectId": subjectId,
//     });

//     res
//       .status(200)
//       .json({ message: "Marks updated successfully", updatedDocument });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// export const addSessionToMarks = async (req, res) => {
//   try {
//     const { sessionId } = req.body; // Get sessionId from request body

//     if (!sessionId) {
//       return res.status(400).json({ message: "sessionId is required" });
//     }

//     // Find all Mark documents that do not have a session field
//     const marksToUpdate = await Mark.find({
//       session: { $exists: false },
//     });

//     if (marksToUpdate.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No marks found without session" });
//     }

//     // Loop through each Mark document and update it with the sessionId
//     for (const mark of marksToUpdate) {
//       mark.session = sessionId; // Set the sessionId at the root level
//       await mark.save(); // Save the updated mark document
//     }

//     res.status(200).json({
//       message: "SessionId added to all marks",
//       updated: marksToUpdate.length,
//     });
//   } catch (error) {
//     console.error("Error adding sessionId to marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const updateMarks = async (req, res) => {
//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
//       return res.status(400).json({ error: "Invalid request payload" });
//     }

//     const results = [];
//     const updatedDocuments = [];

//     for (const update of updates) {
//       const { studentId, testscore, examscore, marksObtained, comment } =
//         update;

//       const filter = {
//         examId,
//         "marks.studentId": studentId,
//         "marks.subjectId": subjectId,
//       };

//       const updateOperation = {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       };

//       const options = {
//         arrayFilters: [{ "elem.studentId": studentId }],
//         new: true,
//       };

//       let updatedDoc = await Mark.findOneAndUpdate(
//         filter,
//         updateOperation,
//         options
//       );

//       if (!updatedDoc) {
//         // If the document doesn't exist, create a new mark
//         const newMark = {
//           subjectId,
//           studentId,
//           testscore,
//           examscore,
//           marksObtained,
//           comment,
//         };

//         const filter = { examId };
//         const update = { $push: { marks: newMark } };
//         const options = { upsert: true, new: true };

//         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
//       }

//       updatedDocuments.push(updatedDoc);

//       results.push({
//         studentId,
//         success: true,
//       });
//     }

//     res.status(200).json({
//       message: "Marks updated successfully",
//       results,
//       updatedDocuments,
//     });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };




// export const saveOrUpdateMarks = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const { examId, subjectId, updates } = req.body;

//     // Validate payload
//     if (
//       !mongoose.Types.ObjectId.isValid(sessionId) ||
//       !mongoose.Types.ObjectId.isValid(examId) ||
//       !mongoose.Types.ObjectId.isValid(subjectId) ||
//       !Array.isArray(updates)
//     ) {
//       return res.status(400).json({ message: "Invalid payload" });
//     }

//     // 1️⃣ Find existing document for this exam + session
//     let markDoc = await Mark.findOne({ examId, session: sessionId });
//     if (!markDoc) {
//       // If not found, create new
//       markDoc = await Mark.create({ examId, session: sessionId, marks: [] });
//     }

//     // 2️⃣ Merge updates
//     updates.forEach((u) => {
//       const studentId = String(u.studentId);
//       const testscore = u.testscore !== undefined ? Number(u.testscore) : undefined;
//       const examscore = u.examscore !== undefined ? Number(u.examscore) : undefined;
//       const comment = u.comment !== undefined ? u.comment : undefined;

//       // Check if this student + subject already exists
//       let existing = markDoc.marks.find(
//         (m) =>
//           String(m.studentId) === studentId &&
//           String(m.subjectId) === String(subjectId)
//       );

//       if (existing) {
//         // Only update provided fields
//         if (testscore !== undefined) existing.testscore = testscore;
//         if (examscore !== undefined) existing.examscore = examscore;
//         if (comment !== undefined) existing.comment = comment;

//         existing.marksObtained =
//           (existing.testscore || 0) + (existing.examscore || 0);
//       } else {
//         // Create new entry if it doesn't exist
//         markDoc.marks.push({
//           studentId,
//           subjectId,
//           testscore: testscore ?? 0,
//           examscore: examscore ?? 0,
//           marksObtained: (testscore ?? 0) + (examscore ?? 0),
//           comment: comment ?? "",
//         });
//       }
//     });

//     // 3️⃣ Save document
//     await markDoc.save();

//     res.status(200).json({
//       message: "Marks saved/updated successfully",
//       totalMarks: markDoc.marks.length,
//       marks: markDoc.marks,
//     });
//   } catch (error) {
//     console.error("❌ saveOrUpdateMarks error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };





// import mongoose from "mongoose";
// import Mark from "../models/markModel.js";
// import Exam from "../models/examModel.js";
// import Student from "../models/userModel.js";
// import Class from "../models/classModel.js";
// import Session from "../models/sessionModel.js";
// import Subject from "../models/subModel.js";
// import XLSX from "xlsx";
// import { callGeminiJsonWithImage } from "../services/geminiService.js";
// // export const saveMark = async (req, res) => {
// //   const { sessionId } = req.params;

// //   try {
// //     const { examId, subjectId, updates } = req.body;

// //     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
// //       return res.status(400).json({ error: "Invalid session ID" });
// //     }

// //     // Check if updates array is present in the request body
// //     if (!updates || !Array.isArray(updates)) {
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid or missing updates array" });
// //     }

// //     // Fetch existing marks for the specified exam and subject
// //     const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

// //     // If existing marks are not found or the array is empty, proceed to create new marks
// //     if (!existingMarks || existingMarks.marks.length === 0) {
// //       // Save marks to the database using the provided examId and subjectId
// //       const savedMarks = await Mark.create({
// //         examId,
// //         subjectId,
// //         session: sessionId,
// //         marks: await Promise.all(
// //           updates.map(async (mark) => {
// //             const { studentId, testscore, examscore, marksObtained, comment } =
// //               mark;

// //             return {
// //               studentId,
// //               subjectId: subjectId, // Add subjectId
// //               testscore,
// //               examscore,
// //               marksObtained,
// //               comment,
// //             };
// //           })
// //         ),
// //       });

// //       return res.status(201).json({
// //         message: "Marks saved successfully",
// //         savedMarks,
// //       });
// //     }

// //     // If existing marks are found, update the marks
// //     existingMarks.marks.forEach((existingMark) => {
// //       const update = updates.find(
// //         (mark) => mark.studentId === existingMark.studentId
// //       );

// //       if (update) {
// //         existingMark.testscore = update.testscore;
// //         existingMark.examscore = update.examscore;
// //         existingMark.marksObtained = update.marksObtained;
// //         existingMark.comment = update.comment;
// //       }
// //     });

// //     await existingMarks.save();

// //     res.status(200).json({
// //       message: "Marks updated successfully",
// //       updatedMarks: existingMarks,
// //     });
// //   } catch (error) {
// //     console.error("Error saving/updating marks:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const saveMark = async (req, res) => {
// //   const { sessionId } = req.params;

// //   try {
// //     const { examId, subjectId, updates } = req.body;

// //     if (
// //       !mongoose.Types.ObjectId.isValid(sessionId) ||
// //       !mongoose.Types.ObjectId.isValid(subjectId)
// //     ) {
// //       return res.status(400).json({ message: "Invalid ID" });
// //     }

// //     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

// //     let markDoc = await Mark.findOne({
// //       examId,
// //       session: sessionId,
// //     });

// //     // 🆕 FIRST SAVE
// //     if (!markDoc) {
// //       markDoc = new Mark({
// //         examId,
// //         session: sessionId,
// //         marks: updates.map(u => ({
// //           studentId: u.studentId,
// //           subjectId: subjectObjectId, // ✅ FIXED
// //           testscore: u.testscore ?? 0,
// //           examscore: u.examscore ?? 0,
// //           marksObtained: (u.testscore ?? 0) + (u.examscore ?? 0),
// //           comment: u.comment ?? "",
// //         })),
// //       });

// //       await markDoc.save();
// //       return res.status(201).json({ message: "Saved", markDoc });
// //     }

// //     // 🔁 UPDATE / INSERT
// //     updates.forEach(update => {
// //       const existing = markDoc.marks.find(
// //         m =>
// //           m.studentId.toString() === update.studentId.toString() &&
// //           m.subjectId.toString() === subjectObjectId.toString()
// //       );

// //       if (existing) {
// //         existing.testscore = update.testscore ?? existing.testscore;
// //         existing.examscore = update.examscore ?? existing.examscore;
// //         existing.marksObtained =
// //           (existing.testscore ?? 0) + (existing.examscore ?? 0);
// //         existing.comment = update.comment ?? existing.comment;
// //       } else {
// //         markDoc.marks.push({
// //           studentId: update.studentId,
// //           subjectId: subjectObjectId, // ✅ FIXED
// //           testscore: update.testscore ?? 0,
// //           examscore: update.examscore ?? 0,
// //           marksObtained:
// //             (update.testscore ?? 0) + (update.examscore ?? 0),
// //           comment: update.comment ?? "",
// //         });
// //       }
// //     });

// //     await markDoc.save();

// //     res.json({ message: "Updated", markDoc });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// // export const saveMark = async (req, res) => {
// //   const { sessionId } = req.params;

// //   try {
// //     const { examId, subjectId, updates } = req.body;

// //     if (
// //       !mongoose.Types.ObjectId.isValid(sessionId) ||
// //       !mongoose.Types.ObjectId.isValid(subjectId)
// //     ) {
// //       return res.status(400).json({ message: "Invalid ID" });
// //     }

// //     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

// //     let markDoc = await Mark.findOne({ examId, session: sessionId });

// //     // FIRST SAVE
// //     if (!markDoc) {
// //       markDoc = new Mark({
// //         examId,
// //         session: sessionId,
// //         marks: updates.map(u => ({
// //           studentId: mongoose.Types.ObjectId(u.studentId),
// //           subjectId: subjectObjectId,
// //           testscore: u.testscore ?? 0,
// //           examscore: u.examscore ?? 0,
// //           marksObtained: (u.testscore ?? 0) + (u.examscore ?? 0),
// //           comment: u.comment ?? "",
// //         })),
// //       });
// //       await markDoc.save();
// //       return res.status(201).json({ message: "Saved", markDoc });
// //     }

// //     // UPDATE / INSERT
// //     for (const update of updates) {
// //       const studentObjectId = mongoose.Types.ObjectId(update.studentId);

// //       const existing = markDoc.marks.find(
// //         m =>
// //           m.studentId.toString() === studentObjectId.toString() &&
// //           m.subjectId.toString() === subjectObjectId.toString()
// //       );

// //       if (existing) {
// //         existing.testscore = update.testscore ?? 0;
// //         existing.examscore = update.examscore ?? 0;
// //         existing.marksObtained = existing.testscore + existing.examscore;
// //         existing.comment = update.comment ?? existing.comment;
// //       } else {
// //         markDoc.marks.push({
// //           studentId: studentObjectId,
// //           subjectId: subjectObjectId,
// //           testscore: update.testscore ?? 0,
// //           examscore: update.examscore ?? 0,
// //           marksObtained: (update.testscore ?? 0) + (update.examscore ?? 0),
// //           comment: update.comment ?? "",
// //         });
// //       }
// //     }

// //     await markDoc.save();

// //     res.json({ message: "Updated", markDoc });
// //   } catch (err) {
// //     console.error("❌ Error saving marks:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (
//       !mongoose.Types.ObjectId.isValid(sessionId) ||
//       !mongoose.Types.ObjectId.isValid(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

//     // Fetch existing mark document
//     let markDoc = await Mark.findOne({ examId, session: sessionId });

//     // If no document exists, create a new one
//     if (!markDoc) {
//       markDoc = new Mark({
//         examId,
//         session: sessionId,
//         marks: updates.map(u => ({
//           studentId: mongoose.Types.ObjectId(u.studentId),
//           subjectId: subjectObjectId,
//           testscore: u.testscore !== undefined ? u.testscore : 0,
//           examscore: u.examscore !== undefined ? u.examscore : 0,
//           marksObtained:
//             (u.testscore !== undefined ? u.testscore : 0) +
//             (u.examscore !== undefined ? u.examscore : 0),
//           comment: u.comment || "",
//         })),
//       });
//       await markDoc.save();
//       return res.status(201).json({ message: "Saved", markDoc });
//     }

//     // Update existing marks or insert new ones
//     for (const update of updates) {
//       const studentObjectId = mongoose.Types.ObjectId(update.studentId);

//       const existing = markDoc.marks.find(
//         m =>
//           m.studentId.toString() === studentObjectId.toString() &&
//           m.subjectId.toString() === subjectObjectId.toString()
//       );

//       if (existing) {
//         // Only update fields if values are provided
//         if (update.testscore !== undefined) existing.testscore = update.testscore;
//         if (update.examscore !== undefined) existing.examscore = update.examscore;
//         if (update.comment !== undefined) existing.comment = update.comment;

//         // Recalculate total safely
//         existing.marksObtained =
//           (existing.testscore || 0) + (existing.examscore || 0);
//       } else {
//         // Insert new mark only with values or default 0 if new
//         markDoc.marks.push({
//           studentId: studentObjectId,
//           subjectId: subjectObjectId,
//           testscore: update.testscore !== undefined ? update.testscore : 0,
//           examscore: update.examscore !== undefined ? update.examscore : 0,
//           marksObtained:
//             (update.testscore !== undefined ? update.testscore : 0) +
//             (update.examscore !== undefined ? update.examscore : 0),
//           comment: update.comment || "",
//         });
//       }
//     }

//     await markDoc.save();

//     res.json({ message: "Updated", markDoc });
//   } catch (err) {
//     console.error("❌ Error saving marks:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const getMark = async (req, res) => {
//   try {
//     const { examName, sessionId } = req.params;

//     // Fetch the exam based on the provided examName
//     const fetchedExam = await Exam.findOne({ name: examName });

//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     if (!fetchedExam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     // Fetch the marks based on the ObjectId of the fetched exam
//     const marks = await Mark.find({
//       examId: fetchedExam._id,
//       session: sessionObjectId,
//     });

//     if (marks.length === 0) {
//       return res.status(404).json({ message: "Marks not found" });
//     }

//     // Ensure each mark has the subjectId populated
//     const scores = marks.map((mark) => ({
//       subjectId: mark.subjectId, // Make sure subjectId is set in your schema
//       ...mark.toObject(),
//     }));

//     res.status(200).json({ examId: fetchedExam._id, scores });
//   } catch (error) {
//     console.error("Error fetching marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId,
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     // Flatten the marks and filter valid scores
//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter(
//           (m) =>
//             m.studentId.toString() === studentId &&
//             mark.examId &&
//             m.subjectId
//         )
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     // Deduplicate based on examId and subjectId using reduce
//     const uniqueScores = scores.reduce((acc, current) => {
//       // Check if an entry with the same examId and subjectId already exists
//       const isDuplicate = acc.some(
//         (item) =>
//           item.examId._id.toString() === current.examId._id.toString() &&
//           item.subjectId._id.toString() === current.subjectId._id.toString()
//       );

//       if (!isDuplicate) {
//         acc.push(current); // Add unique entry
//       }
//       return acc;
//     }, []);

//     res.status(200).json({ studentId, sessionId, scores: uniqueScores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMarkbyStudentwithoutsession = async (req, res) => {
//   try {
//     const userId = req.params.studentId;

//     const marks = await Mark.find({ "marks.studentId": userId })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

//     const scores = marks.flatMap(
//       (mark) =>
//         mark.marks
//           .filter(
//             (m) =>
//               m.studentId.toString() === userId &&
//               (m.testscore !== 0 || m.examscore !== 0) &&
//              m.comment?.trim() &&
//               mark.examId &&
//               m.subjectId
//           )
//           .map((m) => {
//             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
//             // Check if subject ID exists in the Map
//             if (!uniqueSubjects.has(subjectKey)) {
//               // If subject doesn't exist, add it to the Map and return the mapped object
//               uniqueSubjects.set(subjectKey, true);
//               return {
//                 examId: mark.examId,
//                 subjectId: m.subjectId,
//                 examName: mark.examId.name,
//                 subjectName: m.subjectId.name,
//                 testscore: m.testscore,
//                 ...m.toObject(),
//               };
//             }
//             return null; // If subject exists, return null (to filter it out)
//           })
//           .filter((m) => m !== null) // Filter out null values
//     );

//     res.status(200).json({ studentId: userId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };



// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     const markDoc = await Mark.findOne({
// //       examId,
// //       session: sessionId,
// //       "marks.subjectId": subjectId,   // 🔥 THIS IS THE FIX
// //     })
// //       .populate("marks.studentId", "studentName AdmNo")
// //       .lean();

// //     if (!markDoc) {
// //       return res.status(404).json({ message: "No marks for this subject" });
// //     }

// //     const scores = markDoc.marks
// //       .filter(m => String(m.subjectId) === subjectId)
// //       .map(m => ({
// //         studentId: m.studentId?._id || m.studentId,
// //         studentName: m.studentId?.studentName || "",
// //         admNo: m.studentId?.AdmNo || "",
// //         testscore: m.testscore ?? 0,
// //         examscore: m.examscore ?? 0,
// //         marksObtained: m.marksObtained ?? 0,
// //         comment: m.comment ?? ""
// //       }));

// //     return res.json({
// //       examId,
// //       subjectId,
// //       total: scores.length,
// //       scores
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId, sessionId } = req.params;

//     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

//     // ✅ 1. Fetch ALL Mark documents for this exam + session
//     const markDocs = await Mark.find({
//       examId,
//       session: sessionId,
//     })
//       .populate("marks.studentId", "studentName AdmNo")
//       .lean();

//     if (!markDocs.length) {
//       return res.json({ scores: [] });
//     }

//     // ✅ 2. Merge ALL marks from ALL documents
//     const allMarks = markDocs.flatMap(doc => doc.marks);

//     // ✅ 3. Filter by subject
//     const scores = allMarks.filter(
//       m => m.subjectId.toString() === subjectObjectId.toString()
//     );

//     console.log("🎯 Marks after subject filter:", scores.length);

//     res.json({ scores });
//   } catch (err) {
//     console.error("❌ Error fetching scores:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// export const getAllScoresForExamSession = async (req, res) => {
//   try {
//     const { examId, sessionId, classname } = req.params;

//     // 1️⃣ Get all students in this class AND session
//     let students = await Student.find({ 
//       classname: classname.trim(),
//       session: sessionId 
//     }).lean();

//     if (!students.length) {
//       return res.status(404).json({ message: "No students found in this class for the given session" });
//     }

//     // Remove duplicate students just in case
//     const uniqueStudents = Array.from(
//       new Map(students.map(s => [s._id.toString(), s])).values()
//     );

//     // 2️⃣ Get all subjects for this class AND session
//     const subjects = await Subject.find({ classname: classname.trim(), session: sessionId }).lean();
//     if (!subjects.length) {
//       return res.status(404).json({ message: "No subjects found for this class/session" });
//     }

//     // 3️⃣ Get all marks for this exam and session
//     const markDocs = await Mark.find({ examId, session: sessionId })
//       .populate("marks.studentId", "studentName AdmNo")
//       .lean();

//     // 4️⃣ Prepare results per subject
//     const results = subjects.map(subject => {
//       const subjectScores = uniqueStudents.map(student => {
//         // Search all markDocs for this student & subject
//         let mark = null;
//         for (const doc of markDocs) {
//           mark = doc.marks.find(
//             m =>
//               (m.studentId?._id?.toString() || m.studentId?.toString()) === student._id.toString() &&
//               m.subjectId.toString() === subject._id.toString()
//           );
//           if (mark) break;
//         }

//         return {
//           studentId: student._id,
//           studentName: student.studentName,
//           admNo: student.AdmNo,
//           testscore: mark?.testscore ?? 0,
//           examscore: mark?.examscore ?? 0,
//           marksObtained: mark ? mark.testscore + mark.examscore : 0,
//           comment: mark?.comment ?? ""
//         };
//       });

//       return {
//         subjectId: subject._id,
//         subjectName: subject.name,
//         totalStudents: uniqueStudents.length,
//         scores: subjectScores
//       };
//     });

//     // 5️⃣ Return final response
//     return res.json({
//       examId,
//       sessionId,
//       classname,
//       totalSubjects: subjects.length,
//       totalStudents: uniqueStudents.length,
//       results
//     });

//   } catch (err) {
//     console.error("Error fetching all scores:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const fixSubjectIds = async (req, res) => {
//   try {
//     const { sessionId, examId } = req.params;

//     const markDoc = await Mark.findOne({ examId, session: sessionId });

//     if (!markDoc) {
//       return res.status(404).json({ message: "No marks found" });
//     }

//     let fixedSubjectCount = 0;
//     let fixedScoreCount = 0;

//     markDoc.marks.forEach(mark => {
//       // Fix subjectId if it is a string
//       if (typeof mark.subjectId === "string") {
//         mark.subjectId = mongoose.Types.ObjectId(mark.subjectId);
//         fixedSubjectCount++;
//       }

//       // Fix null or undefined scores
//       if (mark.testscore == null) {
//         mark.testscore = 0;
//         fixedScoreCount++;
//       }
//       if (mark.examscore == null) {
//         mark.examscore = 0;
//         fixedScoreCount++;
//       }
//       if (mark.marksObtained == null) {
//         mark.marksObtained = mark.testscore + mark.examscore;
//       }
//     });

//     await markDoc.save();

//     return res.json({
//       message: `Fixed ${fixedSubjectCount} subjectIds and ${fixedScoreCount} missing scores`,
//       markDoc
//     });
//   } catch (err) {
//     console.error("❌ Error fixing subjectIds and scores:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };






// export const updateMark = async (req, res) => {
//   try {
//     const { examId, subjectId, testscore, examscore, marksObtained, comment } =
//       req.body;
//     const studentIdToUpdate = req.params.studentId;

//     const result = await Mark.updateOne(
//       {
//         "marks.studentId": studentIdToUpdate,
//         examId,
//         "marks.subjectId": subjectId,
//       },
//       {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       },
//       {
//         arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
//       }
//     );

//     console.log("Update Result:", result);
//     console.log("Request Body:", req.body);

//     if (result.nModified === 0) {
//       return res
//         .status(404)
//         .json({ error: "No matching records found for update" });
//     }

//     const updatedDocument = await Mark.findOne({
//       "marks.studentId": studentIdToUpdate,
//       examId,
//       "marks.subjectId": subjectId,
//     });

//     res
//       .status(200)
//       .json({ message: "Marks updated successfully", updatedDocument });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// export const addSessionToMarks = async (req, res) => {
//   try {
//     const { sessionId } = req.body; // Get sessionId from request body

//     if (!sessionId) {
//       return res.status(400).json({ message: "sessionId is required" });
//     }

//     // Find all Mark documents that do not have a session field
//     const marksToUpdate = await Mark.find({
//       session: { $exists: false },
//     });

//     if (marksToUpdate.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No marks found without session" });
//     }

//     // Loop through each Mark document and update it with the sessionId
//     for (const mark of marksToUpdate) {
//       mark.session = sessionId; // Set the sessionId at the root level
//       await mark.save(); // Save the updated mark document
//     }

//     res.status(200).json({
//       message: "SessionId added to all marks",
//       updated: marksToUpdate.length,
//     });
//   } catch (error) {
//     console.error("Error adding sessionId to marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const updateMarks = async (req, res) => {
//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
//       return res.status(400).json({ error: "Invalid request payload" });
//     }

//     const results = [];
//     const updatedDocuments = [];

//     for (const update of updates) {
//       const { studentId, testscore, examscore, marksObtained, comment } =
//         update;

//       const filter = {
//         examId,
//         "marks.studentId": studentId,
//         "marks.subjectId": subjectId,
//       };

//       const updateOperation = {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       };

//       const options = {
//         arrayFilters: [{ "elem.studentId": studentId }],
//         new: true,
//       };

//       let updatedDoc = await Mark.findOneAndUpdate(
//         filter,
//         updateOperation,
//         options
//       );

//       if (!updatedDoc) {
//         // If the document doesn't exist, create a new mark
//         const newMark = {
//           subjectId,
//           studentId,
//           testscore,
//           examscore,
//           marksObtained,
//           comment,
//         };

//         const filter = { examId };
//         const update = { $push: { marks: newMark } };
//         const options = { upsert: true, new: true };

//         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
//       }

//       updatedDocuments.push(updatedDoc);

//       results.push({
//         studentId,
//         success: true,
//       });
//     }

//     res.status(200).json({
//       message: "Marks updated successfully",
//       results,
//       updatedDocuments,
//     });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const normalizeText = (value = "") =>
//   String(value)
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, "");

// const normalizeTokens = (value = "") =>
//   String(value)
//     .toLowerCase()
//     .replace(/[^a-z0-9\s]/g, " ")
//     .split(/\s+/)
//     .filter(Boolean);

// const toSafeNumber = (value) => {
//   if (value == null || value === "") return 0;
//   const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const parseSpreadsheetRows = (buffer) => {
//   const workbook = XLSX.read(buffer, { type: "buffer" });
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   return XLSX.utils.sheet_to_json(sheet, { defval: "" });
// };

// const findColumn = (row, candidates) => {
//   const entries = Object.keys(row);
//   const normalizedCandidates = candidates.map(normalizeText);
//   return entries.find((key) => normalizedCandidates.includes(normalizeText(key)));
// };

// const buildImportedRowsFromSheet = (rows) => {
//   return rows
//     .map((row) => {
//       const nameKey = findColumn(row, ["student name", "name", "student", "student detail"]);
//       const admKey = findColumn(row, ["adm no", "admission number", "admission no", "admno"]);
//       const testKey = findColumn(row, ["test", "test score", "testscore"]);
//       const test1Key = findColumn(row, ["test1", "test 1", "first test", "ca1"]);
//       const test2Key = findColumn(row, ["test2", "test 2", "second test", "ca2"]);
//       const examKey = findColumn(row, ["exam", "exam score", "examscore"]);

//       const name = String(nameKey ? row[nameKey] : "").trim();
//       const admNo = String(admKey ? row[admKey] : "").trim();
//       const testScore = Math.min(40, toSafeNumber(testKey ? row[testKey] : 0) + toSafeNumber(test1Key ? row[test1Key] : 0) + toSafeNumber(test2Key ? row[test2Key] : 0));
//       const examScore = Math.min(60, toSafeNumber(examKey ? row[examKey] : 0));

//       if (!name && !admNo) return null;

//       return {
//         rawName: name,
//         rawAdmNo: admNo,
//         testscore: testScore,
//         examscore: examScore,
//       };
//     })
//     .filter(Boolean);
// };

// const getWordBox = (word = {}) => {
//   const bbox = word.bbox || {};
//   const x0 = Number(bbox.x0 ?? bbox.left ?? word.x0 ?? 0);
//   const y0 = Number(bbox.y0 ?? bbox.top ?? word.y0 ?? 0);
//   const x1 = Number(bbox.x1 ?? bbox.right ?? word.x1 ?? x0);
//   const y1 = Number(bbox.y1 ?? bbox.bottom ?? word.y1 ?? y0);
//   return {
//     x0,
//     y0,
//     x1,
//     y1,
//     xMid: (x0 + x1) / 2,
//     yMid: (y0 + y1) / 2,
//   };
// };

// const groupWordsIntoRows = (words = []) => {
//   const sortedWords = [...words]
//     .filter((word) => String(word.text || "").trim())
//     .sort((a, b) => {
//       const first = getWordBox(a);
//       const second = getWordBox(b);
//       if (Math.abs(first.yMid - second.yMid) > 12) return first.yMid - second.yMid;
//       return first.x0 - second.x0;
//     });

//   const rows = [];
//   sortedWords.forEach((word) => {
//     const box = getWordBox(word);
//     const existingRow = rows.find((row) => Math.abs(row.yMid - box.yMid) <= Math.max(18, row.avgHeight * 0.75));
//     if (existingRow) {
//       existingRow.words.push(word);
//       existingRow.yMid = (existingRow.yMid * (existingRow.words.length - 1) + box.yMid) / existingRow.words.length;
//       existingRow.avgHeight =
//         (existingRow.avgHeight * (existingRow.words.length - 1) + Math.max(1, box.y1 - box.y0)) / existingRow.words.length;
//       return;
//     }

//     rows.push({
//       yMid: box.yMid,
//       avgHeight: Math.max(1, box.y1 - box.y0),
//       words: [word],
//     });
//   });

//   return rows
//     .map((row) => ({
//       ...row,
//       words: row.words.sort((a, b) => getWordBox(a).x0 - getWordBox(b).x0),
//       text: row.words.map((word) => String(word.text || "").trim()).join(" ").trim(),
//     }))
//     .filter((row) => row.words.length > 0);
// };

// const extractNumbersFromWords = (words = []) =>
//   words
//     .flatMap((word) => String(word.text || "").match(/\d+/g) || [])
//     .map(Number)
//     .filter((value) => Number.isFinite(value));

// const buildImportedRowsFromOcrWords = (words = []) => {
//   const rows = groupWordsIntoRows(words);
//   if (!rows.length) return [];

//   const headerRow = rows.find((row) => {
//     const normalized = normalizeText(row.text);
//     return normalized.includes("student") && normalized.includes("test") && normalized.includes("exam");
//   });

//   const headerWords = headerRow?.words || [];
//   const studentHeader = headerWords.find((word) => normalizeText(word.text).includes("student"));
//   const testHeader = headerWords.find((word) => normalizeText(word.text).includes("test"));
//   const examHeader = headerWords.find((word) => normalizeText(word.text).includes("exam"));

//   const xMids = words.map((word) => getWordBox(word).xMid).sort((a, b) => a - b);
//   const minX = xMids[0] || 0;
//   const maxX = xMids[xMids.length - 1] || 900;

//   const studentCenter = studentHeader ? getWordBox(studentHeader).xMid : minX + (maxX - minX) * 0.18;
//   const testCenter = testHeader ? getWordBox(testHeader).xMid : minX + (maxX - minX) * 0.53;
//   const examCenter = examHeader ? getWordBox(examHeader).xMid : minX + (maxX - minX) * 0.83;

//   const studentBoundary = (studentCenter + testCenter) / 2;
//   const examBoundary = (testCenter + examCenter) / 2;
//   const startIndex = headerRow ? rows.indexOf(headerRow) + 1 : 0;

//   return rows
//     .slice(startIndex)
//     .map((row) => {
//       const nameWords = [];
//       const testWords = [];
//       const examWords = [];

//       row.words.forEach((word) => {
//         const xMid = getWordBox(word).xMid;
//         if (xMid < studentBoundary) {
//           nameWords.push(word);
//         } else if (xMid < examBoundary) {
//           testWords.push(word);
//         } else {
//           examWords.push(word);
//         }
//       });

//       const rawName = nameWords.map((word) => String(word.text || "").trim()).join(" ").replace(/\s+/g, " ").trim();
//       const testNumbers = extractNumbersFromWords(testWords);
//       const examNumbers = extractNumbersFromWords(examWords);
//       const testscore = Math.min(
//         40,
//         testNumbers.filter((value) => value <= 40).reduce((sum, value) => sum + value, 0)
//       );
//       const examscore = Math.min(
//         60,
//         examNumbers.filter((value) => value <= 60).reduce((max, value) => Math.max(max, value), 0)
//       );

//       const looksLikeName = normalizeTokens(rawName).some((token) => /[a-z]/.test(token));
//       if (!looksLikeName || (!testscore && !examscore)) return null;

//       return {
//         rawName,
//         rawAdmNo: "",
//         testscore,
//         examscore,
//       };
//     })
//     .filter(Boolean);
// };

// const buildImportedRowsFromOcrText = (text) => {
//   const lines = String(text)
//     .split(/\r?\n/)
//     .map((line) => line.trim())
//     .filter(Boolean);

//   const rows = [];
//   for (let index = 0; index < lines.length; index++) {
//     const line = lines[index];
//     const nextChunk = lines.slice(index, index + 5).join(" ");
//     const numbers = (nextChunk.match(/\d+/g) || []).map(Number);
//     if (!/[a-z]/i.test(line) || numbers.length < 2) continue;

//     const testNumbers = numbers.filter((value) => value <= 40);
//     const examNumbers = numbers.filter((value) => value <= 60);
//     const testscore = Math.min(40, (testNumbers[0] || 0) + (testNumbers[1] || 0));
//     const examscore = Math.min(60, examNumbers.find((value) => value > 20) || examNumbers[testNumbers.length] || 0);

//     rows.push({
//       rawName: line,
//       rawAdmNo: "",
//       testscore,
//       examscore,
//     });
//   }

//   return rows;
// };

// const normalizeGeminiRows = (rows = []) =>
//   rows
//     .map((row) => ({
//       rawName: String(row?.student || row?.name || row?.studentName || "").trim(),
//       rawAdmNo: String(row?.admNo || row?.admissionNumber || "").trim(),
//       testscore: Math.min(
//         40,
//         toSafeNumber(row?.testscore ?? row?.test ?? row?.testScore ?? row?.ca ?? row?.continuousAssessment)
//       ),
//       examscore: Math.min(
//         60,
//         toSafeNumber(row?.examscore ?? row?.exam ?? row?.examScore)
//       ),
//     }))
//     .filter((row) => row.rawName && (row.testscore > 0 || row.examscore > 0));

// const levenshteinDistance = (first = "", second = "") => {
//   const a = normalizeText(first);
//   const b = normalizeText(second);
//   if (!a) return b.length;
//   if (!b) return a.length;

//   const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
//   for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
//   for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

//   for (let i = 1; i <= a.length; i++) {
//     for (let j = 1; j <= b.length; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//       matrix[i][j] = Math.min(
//         matrix[i - 1][j] + 1,
//         matrix[i][j - 1] + 1,
//         matrix[i - 1][j - 1] + cost
//       );
//     }
//   }

//   return matrix[a.length][b.length];
// };

// const getNameSimilarity = (left = "", right = "") => {
//   const compactLeft = normalizeText(left);
//   const compactRight = normalizeText(right);
//   if (!compactLeft || !compactRight) return 0;

//   if (compactLeft === compactRight) return 1;

//   const leftTokens = normalizeTokens(left);
//   const rightTokens = normalizeTokens(right);
//   const overlap = leftTokens.filter((token) => rightTokens.includes(token)).length;
//   const tokenScore = overlap / Math.max(leftTokens.length, rightTokens.length, 1);
//   const editScore =
//     1 - levenshteinDistance(compactLeft, compactRight) / Math.max(compactLeft.length, compactRight.length, 1);

//   return Math.max(tokenScore, editScore);
// };

// const matchImportedRowToStudent = (row, students = []) => {
//   const normalizedAdm = normalizeText(row.rawAdmNo);
//   const normalizedName = normalizeText(row.rawName);

//   if (normalizedAdm) {
//     const admMatch = students.find((student) => normalizeText(student.AdmNo) === normalizedAdm);
//     if (admMatch) return admMatch;
//   }

//   const exactNameMatch = students.find(
//     (student) => normalizeText(student.studentName || student.username || student.name) === normalizedName
//   );
//   if (exactNameMatch) return exactNameMatch;

//   let bestMatch = null;
//   let bestScore = 0;

//   students.forEach((student) => {
//     const studentName = student.studentName || student.username || student.name || "";
//     const score = getNameSimilarity(row.rawName, studentName);
//     if (score > bestScore) {
//       bestMatch = student;
//       bestScore = score;
//     }
//   });

//   return bestScore >= 0.72 ? bestMatch : null;
// };

// export const importMarks = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const { className } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "A marks file is required." });
//     }

//     if (!sessionId || !className) {
//       return res.status(400).json({ message: "sessionId and className are required." });
//     }

//     const students = await Student.find({
//       classname: className,
//       session: sessionId,
//     }).lean();

//     const type = String(req.file.mimetype || "");
//     let importedRows = [];
//     let ocrDebug = null;

//     if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) {
//       importedRows = buildImportedRowsFromSheet(parseSpreadsheetRows(req.file.buffer));
//     } else if (type.startsWith("image/")) {
//       let geminiResult = null;
//       let geminiError = null;

//       try {
//         geminiResult = await callGeminiJsonWithImage(
//           [
//             "Read this uploaded school mark sheet image and extract only the student rows in JSON.",
//             'Return JSON in this exact shape: {"rows":[{"student":"John Doe","test":25,"exam":50}]}',
//             "Rules:",
//             "- Only return rows that clearly contain a student name and marks.",
//             "- Ignore headers, lines, doodles, and gibberish.",
//             "- If there are two test columns, add them together and cap test at 40.",
//             "- Cap exam at 60.",
//             "- Do not invent names or marks.",
//             "- If you are unsure about a row, leave it out.",
//           ].join("\n"),
//           {
//             imageBuffer: req.file.buffer,
//             mimeType: req.file.mimetype || "image/jpeg",
//             systemInstruction:
//               "You extract handwritten school marks from images into strict JSON tables.",
//           }
//         );

//         importedRows = normalizeGeminiRows(geminiResult?.rows || []);
//       } catch (error) {
//         geminiError = error?.message || String(error);
//       }

//       ocrDebug = {
//         engineUsed: "gemini-vision",
//         geminiError,
//         geminiRows: importedRows,
//         rawGeminiResponse: geminiResult,
//         parsedRows: importedRows,
//       };
//       console.log("OCR engine used:", ocrDebug.engineUsed);
//       console.log("OCR parsed rows:", importedRows);

//       if (geminiError) {
//         console.error("OCR Gemini import failed:", geminiError);
//         console.error("OCR Gemini debug payload:", ocrDebug);
//         return res.status(422).json({
//           code: "OCR_IMAGE_PARSE_FAILED",
//           message:
//             "We could not read that mark sheet image clearly. Please upload a clearer image or use CSV/Excel.",
//           ocrDebug,
//         });
//       }

//       if (!importedRows.length) {
//         console.warn("OCR import returned no valid rows.", ocrDebug);
//         return res.status(422).json({
//           code: "OCR_NO_ROWS_FOUND",
//           message:
//             "We could not find any valid student rows in that image. Please review the image quality or use CSV/Excel.",
//           ocrDebug,
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Unsupported file format. Use CSV, Excel, or an image." });
//     }

//     const matchedRows = importedRows.map((row) => {
//       const student = matchImportedRowToStudent(row, students);

//       return {
//         matched: Boolean(student),
//         studentId: student?._id || "",
//         studentName: student?.studentName || student?.username || row.rawName || "Unknown Student",
//         AdmNo: student?.AdmNo || row.rawAdmNo || "",
//         testscore: Math.min(40, toSafeNumber(row.testscore)),
//         examscore: Math.min(60, toSafeNumber(row.examscore)),
//       };
//     });

//     return res.status(200).json({
//       rows: matchedRows,
//       unmatched: matchedRows.filter((row) => !row.matched),
//       matchedCount: matchedRows.filter((row) => row.matched).length,
//       totalCount: matchedRows.length,
//       message: "Marks imported successfully. Review and edit before saving.",
//       ocrDebug,
//     });
//   } catch (error) {
//     console.error("importMarks error:", error);
//     return res.status(500).json({ message: "Failed to import marks." });
//   }
// };
  

import mongoose from "mongoose";
import Mark from "../models/markModel.js";
import Exam from "../models/examModel.js";
import Student from "../models/userModel.js";
import Class from "../models/classModel.js";
import Session from "../models/sessionModel.js";
import Subject from "../models/subModel.js";
import XLSX from "xlsx";
import { callGeminiJsonWithImage } from "../services/geminiService.js";

// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (
//       !mongoose.Types.ObjectId.isValid(sessionId) ||
//       !mongoose.Types.ObjectId.isValid(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

//     // Fetch existing mark document
//     let markDoc = await Mark.findOne({ examId, session: sessionId });

//     // If no document exists, create a new one
//     if (!markDoc) {
//       markDoc = new Mark({
//         examId,
//         session: sessionId,
//         marks: updates.map(u => ({
//           studentId: mongoose.Types.ObjectId(u.studentId),
//           subjectId: subjectObjectId,
//           testscore: u.testscore !== undefined ? u.testscore : 0,
//           examscore: u.examscore !== undefined ? u.examscore : 0,
//           marksObtained:
//             (u.testscore !== undefined ? u.testscore : 0) +
//             (u.examscore !== undefined ? u.examscore : 0),
//           comment: u.comment || "",
//         })),
//       });
//       await markDoc.save();
//       return res.status(201).json({ message: "Saved", markDoc });
//     }

//     // Update existing marks or insert new ones
//     for (const update of updates) {
//       const studentObjectId = mongoose.Types.ObjectId(update.studentId);

//       const existing = markDoc.marks.find(
//         m =>
//           m.studentId.toString() === studentObjectId.toString() &&
//           m.subjectId.toString() === subjectObjectId.toString()
//       );

//       if (existing) {
//         // Only update fields if values are provided
//         if (update.testscore !== undefined) existing.testscore = update.testscore;
//         if (update.examscore !== undefined) existing.examscore = update.examscore;
//         if (update.comment !== undefined) existing.comment = update.comment;

//         // Recalculate total safely
//         existing.marksObtained =
//           (existing.testscore || 0) + (existing.examscore || 0);
//       } else {
//         // Insert new mark only with values or default 0 if new
//         markDoc.marks.push({
//           studentId: studentObjectId,
//           subjectId: subjectObjectId,
//           testscore: update.testscore !== undefined ? update.testscore : 0,
//           examscore: update.examscore !== undefined ? update.examscore : 0,
//           marksObtained:
//             (update.testscore !== undefined ? update.testscore : 0) +
//             (update.examscore !== undefined ? update.examscore : 0),
//           comment: update.comment || "",
//         });
//       }
//     }

//     await markDoc.save();

//     res.json({ message: "Updated", markDoc });
//   } catch (err) {
//     console.error("❌ Error saving marks:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const getMark = async (req, res) => {
//   try {
//     const { examName, sessionId } = req.params;

//     // Fetch the exam based on the provided examName
//     const fetchedExam = await Exam.findOne({ name: examName });

//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     if (!fetchedExam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     // Fetch the marks based on the ObjectId of the fetched exam
//     const marks = await Mark.find({
//       examId: fetchedExam._id,
//       session: sessionObjectId,
//     });

//     if (marks.length === 0) {
//       return res.status(404).json({ message: "Marks not found" });
//     }

//     // Ensure each mark has the subjectId populated
//     const scores = marks.map((mark) => ({
//       subjectId: mark.subjectId, // Make sure subjectId is set in your schema
//       ...mark.toObject(),
//     }));

//     res.status(200).json({ examId: fetchedExam._id, scores });
//   } catch (error) {
//     console.error("Error fetching marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const saveMark = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const { examId, subjectId, updates } = req.body;

    console.log("=== saveMark called ===");
    console.log("sessionId:", sessionId, "examId:", examId, "subjectId:", subjectId);

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid or missing updates array" });
    }

    // Always find by examId only — one doc per exam
    let markDoc = await Mark.findOne({ examId });

    if (!markDoc) {
      console.log("➡️ No doc for this exam, creating new...");
      markDoc = await Mark.create({
        examId,
        session: sessionId,
        marks: updates.map((mark) => ({
          studentId: mark.studentId,
          subjectId,
          testscore: Number(mark.testscore ?? 0),
          examscore: Number(mark.examscore ?? 0),
          marksObtained: Number(mark.testscore ?? 0) + Number(mark.examscore ?? 0),
          comment: mark.comment || "",
        })),
      });
      console.log("✅ Created new mark doc:", markDoc._id);
      return res.status(201).json({ message: "Marks saved successfully", markDoc });
    }

    // Doc exists — upsert each student+subject entry inside the marks array
    console.log("➡️ Doc exists (_id:", markDoc._id, "), updating marks for subjectId:", subjectId);

    updates.forEach((update) => {
      const existingIndex = markDoc.marks.findIndex(
        (m) =>
          String(m.studentId) === String(update.studentId) &&
          String(m.subjectId) === String(subjectId)
      );

      const testscore = Number(update.testscore ?? 0);
      const examscore = Number(update.examscore ?? 0);
      const marksObtained = testscore + examscore;

      if (existingIndex > -1) {
        markDoc.marks[existingIndex].testscore = testscore;
        markDoc.marks[existingIndex].examscore = examscore;
        markDoc.marks[existingIndex].marksObtained = marksObtained;
        markDoc.marks[existingIndex].comment = update.comment || "";
      } else {
        markDoc.marks.push({
          studentId: update.studentId,
          subjectId,
          testscore,
          examscore,
          marksObtained,
          comment: update.comment || "",
        });
      }
    });

    await markDoc.save();
    console.log("✅ Marks saved. Total marks in doc now:", markDoc.marks.length);

    return res.status(200).json({ message: "Marks updated successfully", markDoc });
  } catch (error) {
    console.error("Error saving/updating marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMark = async (req, res) => {
  try {
    const { examName, sessionId } = req.params;

    // Fetch the exam based on the provided examName
    const fetchedExam = await Exam.findOne({ name: examName });

    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    if (!fetchedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Fetch the marks based on the ObjectId of the fetched exam
    const marks = await Mark.find({
      examId: fetchedExam._id,
      session: sessionObjectId,
    });

    if (marks.length === 0) {
      return res.status(404).json({ message: "Marks not found" });
    }

    // Ensure each mark has the subjectId populated
    const scores = marks.map((mark) => ({
      subjectId: mark.subjectId, // Make sure subjectId is set in your schema
      ...mark.toObject(),
    }));

    res.status(200).json({ examId: fetchedExam._id, scores });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId,
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     // Flatten the marks and filter valid scores
//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter(
//           (m) =>
//             m.studentId.toString() === studentId &&
//             mark.examId &&
//             m.subjectId
//         )
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     // Deduplicate based on examId and subjectId using reduce
//     const uniqueScores = scores.reduce((acc, current) => {
//       // Check if an entry with the same examId and subjectId already exists
//       const isDuplicate = acc.some(
//         (item) =>
//           item.examId._id.toString() === current.examId._id.toString() &&
//           item.subjectId._id.toString() === current.subjectId._id.toString()
//       );

//       if (!isDuplicate) {
//         acc.push(current); // Add unique entry
//       }
//       return acc;
//     }, []);

//     res.status(200).json({ studentId, sessionId, scores: uniqueScores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


export const getMarkbyStudent = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;

    const marks = await Mark.find({
      "marks.studentId": studentId,
      session: sessionId,
    })
      .populate("examId", "name")
      .populate("marks.subjectId", "name");

    // Flatten the marks and filter valid scores
    const scores = marks.flatMap((mark) =>
      mark.marks
        .filter(
          (m) =>
            m.studentId.toString() === studentId &&
            (m.testscore !== 0 || m.examscore !== 0) &&
            m.comment.trim() !== "" &&
            mark.examId &&
            m.subjectId
        )
        .map((m) => ({
          examId: mark.examId,
          subjectId: m.subjectId,
          examName: mark.examId.name,
          subjectName: m.subjectId.name,
          testscore: m.testscore,
          ...m.toObject(),
        }))
    );

    // Deduplicate based on examId and subjectId using reduce
    const uniqueScores = scores.reduce((acc, current) => {
      // Check if an entry with the same examId and subjectId already exists
      const isDuplicate = acc.some(
        (item) =>
          item.examId._id.toString() === current.examId._id.toString() &&
          item.subjectId._id.toString() === current.subjectId._id.toString()
      );

      if (!isDuplicate) {
        acc.push(current); // Add unique entry
      }
      return acc;
    }, []);

    res.status(200).json({ studentId, sessionId, scores: uniqueScores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMarkbyStudentwithoutsession = async (req, res) => {
  try {
    const userId = req.params.studentId;

    const marks = await Mark.find({ "marks.studentId": userId })
      .populate("examId", "name")
      .populate("marks.subjectId", "name");

    const uniqueSubjects = new Map(); // Use a Map to store unique subjects

    const scores = marks.flatMap(
      (mark) =>
        mark.marks
          .filter(
            (m) =>
              m.studentId.toString() === userId &&
              (m.testscore !== 0 || m.examscore !== 0) &&
             m.comment?.trim() &&
              mark.examId &&
              m.subjectId
          )
          .map((m) => {
            const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
            // Check if subject ID exists in the Map
            if (!uniqueSubjects.has(subjectKey)) {
              // If subject doesn't exist, add it to the Map and return the mapped object
              uniqueSubjects.set(subjectKey, true);
              return {
                examId: mark.examId,
                subjectId: m.subjectId,
                examName: mark.examId.name,
                subjectName: m.subjectId.name,
                testscore: m.testscore,
                ...m.toObject(),
              };
            }
            return null; // If subject exists, return null (to filter it out)
          })
          .filter((m) => m !== null) // Filter out null values
    );

    res.status(200).json({ studentId: userId, scores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId, sessionId } = req.params;

//     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

//     // ✅ 1. Fetch ALL Mark documents for this exam + session
//     const markDocs = await Mark.find({
//       examId,
//       session: sessionId,
//     })
//       .populate("marks.studentId", "studentName AdmNo")
//       .lean();

//     if (!markDocs.length) {
//       return res.json({ scores: [] });
//     }

//     // ✅ 2. Merge ALL marks from ALL documents
//     const allMarks = markDocs.flatMap(doc => doc.marks);

//     // ✅ 3. Filter by subject
//     const scores = allMarks.filter(
//       m => m.subjectId.toString() === subjectObjectId.toString()
//     );

//     console.log("🎯 Marks after subject filter:", scores.length);

//     res.json({ scores });
//   } catch (err) {
//     console.error("❌ Error fetching scores:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId } = req.params;

//     const markDoc = await Mark.findOne({ examId })
//       .populate("marks.studentId", "studentName AdmNo")
//       .lean();

//     if (!markDoc) {
//       return res.json({ examId, subjectId, total: 0, scores: [] });
//     }

//     const scores = markDoc.marks
//       .filter(m => String(m.subjectId) === String(subjectId))
//       .map(m => ({
//         studentId: m.studentId?._id,
//         studentName: m.studentId?.studentName || "",
//         admNo: m.studentId?.AdmNo || "",
//         testscore: m.testscore ?? 0,
//         examscore: m.examscore ?? 0,
//         marksObtained: m.marksObtained ?? 0,
//         comment: m.comment ?? "",
//       }));

//     return res.json({
//       examId,
//       subjectId,
//       total: scores.length,
//       scores,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// };
export const getScores = async (req, res) => {
  try {
    const { examId, subjectId } = req.params;

    console.log("=== getScores called ===");
    console.log("examId:", examId);
    console.log("subjectId:", subjectId);

    const markDoc = await Mark.findOne({ examId })
      .populate("marks.studentId", "studentName AdmNo")
      .lean();

    console.log("markDoc found:", markDoc ? "YES" : "NO");
    console.log("markDoc _id:", markDoc?._id);
    console.log("markDoc examId field:", markDoc?.examId);
    console.log("Total marks entries in doc:", markDoc?.marks?.length ?? 0);

    if (!markDoc) {
      console.log("❌ No mark document found for examId:", examId);
      return res.json({ examId, subjectId, total: 0, scores: [] });
    }

    // Log all unique subjectIds stored in this doc so you can compare
    const storedSubjectIds = [...new Set(markDoc.marks.map(m => String(m.subjectId)))];
    console.log("SubjectIds stored in this markDoc:", storedSubjectIds);
    console.log("SubjectId we are filtering by:", subjectId);
    console.log("Do any match?", storedSubjectIds.includes(String(subjectId)));

    const scores = markDoc.marks
      .filter(m => String(m.subjectId) === String(subjectId))
      .map(m => ({
        studentId: m.studentId?._id,
        studentName: m.studentId?.studentName || "",
        admNo: m.studentId?.AdmNo || "",
        testscore: m.testscore ?? 0,
        examscore: m.examscore ?? 0,
        marksObtained: m.marksObtained ?? 0,
        comment: m.comment ?? "",
      }));

    console.log("Scores after subjectId filter:", scores.length);
    console.log("Scores data:", JSON.stringify(scores, null, 2));

    return res.json({
      examId,
      subjectId,
      total: scores.length,
      scores,
    });
  } catch (err) {
    console.error("getScores error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllScoresForExamSession = async (req, res) => {
  try {
    const { examId, sessionId, classname } = req.params;

    // 1️⃣ Get all students in this class AND session
    let students = await Student.find({ 
      classname: classname.trim(),
      session: sessionId 
    }).lean();

    if (!students.length) {
      return res.status(404).json({ message: "No students found in this class for the given session" });
    }

    // Remove duplicate students just in case
    const uniqueStudents = Array.from(
      new Map(students.map(s => [s._id.toString(), s])).values()
    );

    // 2️⃣ Get all subjects for this class AND session
    const subjects = await Subject.find({ classname: classname.trim(), session: sessionId }).lean();
    if (!subjects.length) {
      return res.status(404).json({ message: "No subjects found for this class/session" });
    }

    // 3️⃣ Get all marks for this exam and session
    const markDocs = await Mark.find({ examId, session: sessionId })
      .populate("marks.studentId", "studentName AdmNo")
      .lean();

    // 4️⃣ Prepare results per subject
    const results = subjects.map(subject => {
      const subjectScores = uniqueStudents.map(student => {
        // Search all markDocs for this student & subject
        let mark = null;
        for (const doc of markDocs) {
          mark = doc.marks.find(
            m =>
              (m.studentId?._id?.toString() || m.studentId?.toString()) === student._id.toString() &&
              m.subjectId.toString() === subject._id.toString()
          );
          if (mark) break;
        }

        return {
          studentId: student._id,
          studentName: student.studentName,
          admNo: student.AdmNo,
          testscore: mark?.testscore ?? 0,
          examscore: mark?.examscore ?? 0,
          marksObtained: mark ? mark.testscore + mark.examscore : 0,
          comment: mark?.comment ?? ""
        };
      });

      return {
        subjectId: subject._id,
        subjectName: subject.name,
        totalStudents: uniqueStudents.length,
        scores: subjectScores
      };
    });

    // 5️⃣ Return final response
    return res.json({
      examId,
      sessionId,
      classname,
      totalSubjects: subjects.length,
      totalStudents: uniqueStudents.length,
      results
    });

  } catch (err) {
    console.error("Error fetching all scores:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fixSubjectIds = async (req, res) => {
  try {
    const { sessionId, examId } = req.params;

    const markDoc = await Mark.findOne({ examId, session: sessionId });

    if (!markDoc) {
      return res.status(404).json({ message: "No marks found" });
    }

    let fixedSubjectCount = 0;
    let fixedScoreCount = 0;

    markDoc.marks.forEach(mark => {
      // Fix subjectId if it is a string
      if (typeof mark.subjectId === "string") {
        mark.subjectId = mongoose.Types.ObjectId(mark.subjectId);
        fixedSubjectCount++;
      }

      // Fix null or undefined scores
      if (mark.testscore == null) {
        mark.testscore = 0;
        fixedScoreCount++;
      }
      if (mark.examscore == null) {
        mark.examscore = 0;
        fixedScoreCount++;
      }
      if (mark.marksObtained == null) {
        mark.marksObtained = mark.testscore + mark.examscore;
      }
    });

    await markDoc.save();

    return res.json({
      message: `Fixed ${fixedSubjectCount} subjectIds and ${fixedScoreCount} missing scores`,
      markDoc
    });
  } catch (err) {
    console.error("❌ Error fixing subjectIds and scores:", err);
    res.status(500).json({ message: "Server error" });
  }
};






export const updateMark = async (req, res) => {
  try {
    const { examId, subjectId, testscore, examscore, marksObtained, comment } =
      req.body;
    const studentIdToUpdate = req.params.studentId;

    const result = await Mark.updateOne(
      {
        "marks.studentId": studentIdToUpdate,
        examId,
        "marks.subjectId": subjectId,
      },
      {
        $set: {
          "marks.$[elem].testscore": testscore,
          "marks.$[elem].examscore": examscore,
          "marks.$[elem].marksObtained": marksObtained,
          "marks.$[elem].comment": comment,
        },
      },
      {
        arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
      }
    );

    console.log("Update Result:", result);
    console.log("Request Body:", req.body);

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "No matching records found for update" });
    }

    const updatedDocument = await Mark.findOne({
      "marks.studentId": studentIdToUpdate,
      examId,
      "marks.subjectId": subjectId,
    });

    res
      .status(200)
      .json({ message: "Marks updated successfully", updatedDocument });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// export const updateMark = async (req, res) => {
//   try {
//     const { examId, subjectId, testscore, examscore, marksObtained, comment } =
//       req.body;
//     const studentIdToUpdate = req.params.studentId;

//     const result = await Mark.updateOne(
//       {
//         "marks.studentId": studentIdToUpdate,
//         examId,
//         "marks.subjectId": subjectId,
//       },
//       {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       },
//       {
//         arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
//       }
//     );

//     console.log("Update Result:", result);
//     console.log("Request Body:", req.body);

//     if (result.nModified === 0) {
//       return res
//         .status(404)
//         .json({ error: "No matching records found for update" });
//     }

//     const updatedDocument = await Mark.findOne({
//       "marks.studentId": studentIdToUpdate,
//       examId,
//       "marks.subjectId": subjectId,
//     });

//     res
//       .status(200)
//       .json({ message: "Marks updated successfully", updatedDocument });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const addSessionToMarks = async (req, res) => {
  try {
    const { sessionId } = req.body; // Get sessionId from request body

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    // Find all Mark documents that do not have a session field
    const marksToUpdate = await Mark.find({
      session: { $exists: false },
    });

    if (marksToUpdate.length === 0) {
      return res
        .status(404)
        .json({ message: "No marks found without session" });
    }

    // Loop through each Mark document and update it with the sessionId
    for (const mark of marksToUpdate) {
      mark.session = sessionId; // Set the sessionId at the root level
      await mark.save(); // Save the updated mark document
    }

    res.status(200).json({
      message: "SessionId added to all marks",
      updated: marksToUpdate.length,
    });
  } catch (error) {
    console.error("Error adding sessionId to marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateMarks = async (req, res) => {
  try {
    const { examId, subjectId, updates } = req.body;

    if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const results = [];
    const updatedDocuments = [];

    for (const update of updates) {
      const { studentId, testscore, examscore, marksObtained, comment } =
        update;

      const filter = {
        examId,
        "marks.studentId": studentId,
        "marks.subjectId": subjectId,
      };

      const updateOperation = {
        $set: {
          "marks.$[elem].testscore": testscore,
          "marks.$[elem].examscore": examscore,
          "marks.$[elem].marksObtained": marksObtained,
          "marks.$[elem].comment": comment,
        },
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true,
      };

      let updatedDoc = await Mark.findOneAndUpdate(
        filter,
        updateOperation,
        options
      );

      if (!updatedDoc) {
        // If the document doesn't exist, create a new mark
        const newMark = {
          subjectId,
          studentId,
          testscore,
          examscore,
          marksObtained,
          comment,
        };

        const filter = { examId };
        const update = { $push: { marks: newMark } };
        const options = { upsert: true, new: true };

        updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
      }

      updatedDocuments.push(updatedDoc);

      results.push({
        studentId,
        success: true,
      });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      results,
      updatedDocuments,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normalizeTokens = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const toSafeNumber = (value) => {
  if (value == null || value === "") return 0;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseSpreadsheetRows = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
};

const findColumn = (row, candidates) => {
  const entries = Object.keys(row);
  const normalizedCandidates = candidates.map(normalizeText);
  return entries.find((key) => normalizedCandidates.includes(normalizeText(key)));
};

const buildImportedRowsFromSheet = (rows) => {
  return rows
    .map((row) => {
      const nameKey = findColumn(row, ["student name", "name", "student", "student detail"]);
      const admKey = findColumn(row, ["adm no", "admission number", "admission no", "admno"]);
      const testKey = findColumn(row, ["test", "test score", "testscore"]);
      const test1Key = findColumn(row, ["test1", "test 1", "first test", "ca1"]);
      const test2Key = findColumn(row, ["test2", "test 2", "second test", "ca2"]);
      const examKey = findColumn(row, ["exam", "exam score", "examscore"]);

      const name = String(nameKey ? row[nameKey] : "").trim();
      const admNo = String(admKey ? row[admKey] : "").trim();
      const testScore = Math.min(40, toSafeNumber(testKey ? row[testKey] : 0) + toSafeNumber(test1Key ? row[test1Key] : 0) + toSafeNumber(test2Key ? row[test2Key] : 0));
      const examScore = Math.min(60, toSafeNumber(examKey ? row[examKey] : 0));

      if (!name && !admNo) return null;

      return {
        rawName: name,
        rawAdmNo: admNo,
        testscore: testScore,
        examscore: examScore,
      };
    })
    .filter(Boolean);
};

const getWordBox = (word = {}) => {
  const bbox = word.bbox || {};
  const x0 = Number(bbox.x0 ?? bbox.left ?? word.x0 ?? 0);
  const y0 = Number(bbox.y0 ?? bbox.top ?? word.y0 ?? 0);
  const x1 = Number(bbox.x1 ?? bbox.right ?? word.x1 ?? x0);
  const y1 = Number(bbox.y1 ?? bbox.bottom ?? word.y1 ?? y0);
  return {
    x0,
    y0,
    x1,
    y1,
    xMid: (x0 + x1) / 2,
    yMid: (y0 + y1) / 2,
  };
};

const groupWordsIntoRows = (words = []) => {
  const sortedWords = [...words]
    .filter((word) => String(word.text || "").trim())
    .sort((a, b) => {
      const first = getWordBox(a);
      const second = getWordBox(b);
      if (Math.abs(first.yMid - second.yMid) > 12) return first.yMid - second.yMid;
      return first.x0 - second.x0;
    });

  const rows = [];
  sortedWords.forEach((word) => {
    const box = getWordBox(word);
    const existingRow = rows.find((row) => Math.abs(row.yMid - box.yMid) <= Math.max(18, row.avgHeight * 0.75));
    if (existingRow) {
      existingRow.words.push(word);
      existingRow.yMid = (existingRow.yMid * (existingRow.words.length - 1) + box.yMid) / existingRow.words.length;
      existingRow.avgHeight =
        (existingRow.avgHeight * (existingRow.words.length - 1) + Math.max(1, box.y1 - box.y0)) / existingRow.words.length;
      return;
    }

    rows.push({
      yMid: box.yMid,
      avgHeight: Math.max(1, box.y1 - box.y0),
      words: [word],
    });
  });

  return rows
    .map((row) => ({
      ...row,
      words: row.words.sort((a, b) => getWordBox(a).x0 - getWordBox(b).x0),
      text: row.words.map((word) => String(word.text || "").trim()).join(" ").trim(),
    }))
    .filter((row) => row.words.length > 0);
};

const extractNumbersFromWords = (words = []) =>
  words
    .flatMap((word) => String(word.text || "").match(/\d+/g) || [])
    .map(Number)
    .filter((value) => Number.isFinite(value));

const buildImportedRowsFromOcrWords = (words = []) => {
  const rows = groupWordsIntoRows(words);
  if (!rows.length) return [];

  const headerRow = rows.find((row) => {
    const normalized = normalizeText(row.text);
    return normalized.includes("student") && normalized.includes("test") && normalized.includes("exam");
  });

  const headerWords = headerRow?.words || [];
  const studentHeader = headerWords.find((word) => normalizeText(word.text).includes("student"));
  const testHeader = headerWords.find((word) => normalizeText(word.text).includes("test"));
  const examHeader = headerWords.find((word) => normalizeText(word.text).includes("exam"));

  const xMids = words.map((word) => getWordBox(word).xMid).sort((a, b) => a - b);
  const minX = xMids[0] || 0;
  const maxX = xMids[xMids.length - 1] || 900;

  const studentCenter = studentHeader ? getWordBox(studentHeader).xMid : minX + (maxX - minX) * 0.18;
  const testCenter = testHeader ? getWordBox(testHeader).xMid : minX + (maxX - minX) * 0.53;
  const examCenter = examHeader ? getWordBox(examHeader).xMid : minX + (maxX - minX) * 0.83;

  const studentBoundary = (studentCenter + testCenter) / 2;
  const examBoundary = (testCenter + examCenter) / 2;
  const startIndex = headerRow ? rows.indexOf(headerRow) + 1 : 0;

  return rows
    .slice(startIndex)
    .map((row) => {
      const nameWords = [];
      const testWords = [];
      const examWords = [];

      row.words.forEach((word) => {
        const xMid = getWordBox(word).xMid;
        if (xMid < studentBoundary) {
          nameWords.push(word);
        } else if (xMid < examBoundary) {
          testWords.push(word);
        } else {
          examWords.push(word);
        }
      });

      const rawName = nameWords.map((word) => String(word.text || "").trim()).join(" ").replace(/\s+/g, " ").trim();
      const testNumbers = extractNumbersFromWords(testWords);
      const examNumbers = extractNumbersFromWords(examWords);
      const testscore = Math.min(
        40,
        testNumbers.filter((value) => value <= 40).reduce((sum, value) => sum + value, 0)
      );
      const examscore = Math.min(
        60,
        examNumbers.filter((value) => value <= 60).reduce((max, value) => Math.max(max, value), 0)
      );

      const looksLikeName = normalizeTokens(rawName).some((token) => /[a-z]/.test(token));
      if (!looksLikeName || (!testscore && !examscore)) return null;

      return {
        rawName,
        rawAdmNo: "",
        testscore,
        examscore,
      };
    })
    .filter(Boolean);
};

const buildImportedRowsFromOcrText = (text) => {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const nextChunk = lines.slice(index, index + 5).join(" ");
    const numbers = (nextChunk.match(/\d+/g) || []).map(Number);
    if (!/[a-z]/i.test(line) || numbers.length < 2) continue;

    const testNumbers = numbers.filter((value) => value <= 40);
    const examNumbers = numbers.filter((value) => value <= 60);
    const testscore = Math.min(40, (testNumbers[0] || 0) + (testNumbers[1] || 0));
    const examscore = Math.min(60, examNumbers.find((value) => value > 20) || examNumbers[testNumbers.length] || 0);

    rows.push({
      rawName: line,
      rawAdmNo: "",
      testscore,
      examscore,
    });
  }

  return rows;
};

const normalizeGeminiRows = (rows = []) =>
  rows
    .map((row) => ({
      rawName: String(row?.student || row?.name || row?.studentName || "").trim(),
      rawAdmNo: String(row?.admNo || row?.admissionNumber || "").trim(),
      testscore: Math.min(
        40,
        toSafeNumber(row?.testscore ?? row?.test ?? row?.testScore ?? row?.ca ?? row?.continuousAssessment)
      ),
      examscore: Math.min(
        60,
        toSafeNumber(row?.examscore ?? row?.exam ?? row?.examScore)
      ),
    }))
    .filter((row) => row.rawName && (row.testscore > 0 || row.examscore > 0));

const levenshteinDistance = (first = "", second = "") => {
  const a = normalizeText(first);
  const b = normalizeText(second);
  if (!a) return b.length;
  if (!b) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const getNameSimilarity = (left = "", right = "") => {
  const compactLeft = normalizeText(left);
  const compactRight = normalizeText(right);
  if (!compactLeft || !compactRight) return 0;

  if (compactLeft === compactRight) return 1;

  const leftTokens = normalizeTokens(left);
  const rightTokens = normalizeTokens(right);
  const overlap = leftTokens.filter((token) => rightTokens.includes(token)).length;
  const tokenScore = overlap / Math.max(leftTokens.length, rightTokens.length, 1);
  const editScore =
    1 - levenshteinDistance(compactLeft, compactRight) / Math.max(compactLeft.length, compactRight.length, 1);

  return Math.max(tokenScore, editScore);
};

const matchImportedRowToStudent = (row, students = []) => {
  const normalizedAdm = normalizeText(row.rawAdmNo);
  const normalizedName = normalizeText(row.rawName);

  if (normalizedAdm) {
    const admMatch = students.find((student) => normalizeText(student.AdmNo) === normalizedAdm);
    if (admMatch) return admMatch;
  }

  const exactNameMatch = students.find(
    (student) => normalizeText(student.studentName || student.username || student.name) === normalizedName
  );
  if (exactNameMatch) return exactNameMatch;

  let bestMatch = null;
  let bestScore = 0;

  students.forEach((student) => {
    const studentName = student.studentName || student.username || student.name || "";
    const score = getNameSimilarity(row.rawName, studentName);
    if (score > bestScore) {
      bestMatch = student;
      bestScore = score;
    }
  });

  return bestScore >= 0.72 ? bestMatch : null;
};

export const importMarks = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { className } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "A marks file is required." });
    }

    if (!sessionId || !className) {
      return res.status(400).json({ message: "sessionId and className are required." });
    }

    const students = await Student.find({
      classname: className,
      session: sessionId,
    }).lean();

    const type = String(req.file.mimetype || "");
    let importedRows = [];
    let ocrDebug = null;

    if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) {
      importedRows = buildImportedRowsFromSheet(parseSpreadsheetRows(req.file.buffer));
    } else if (type.startsWith("image/")) {
      let geminiResult = null;
      let geminiError = null;

      try {
        geminiResult = await callGeminiJsonWithImage(
          [
            "Read this uploaded school mark sheet image and extract only the student rows in JSON.",
            'Return JSON in this exact shape: {"rows":[{"student":"John Doe","test":25,"exam":50}]}',
            "Rules:",
            "- Only return rows that clearly contain a student name and marks.",
            "- Ignore headers, lines, doodles, and gibberish.",
            "- If there are two test columns, add them together and cap test at 40.",
            "- Cap exam at 60.",
            "- Do not invent names or marks.",
            "- If you are unsure about a row, leave it out.",
          ].join("\n"),
          {
            imageBuffer: req.file.buffer,
            mimeType: req.file.mimetype || "image/jpeg",
            systemInstruction:
              "You extract handwritten school marks from images into strict JSON tables.",
          }
        );

        importedRows = normalizeGeminiRows(geminiResult?.rows || []);
      } catch (error) {
        geminiError = error?.message || String(error);
      }

      ocrDebug = {
        engineUsed: "gemini-vision",
        geminiError,
        geminiRows: importedRows,
        rawGeminiResponse: geminiResult,
        parsedRows: importedRows,
      };
      console.log("OCR engine used:", ocrDebug.engineUsed);
      console.log("OCR parsed rows:", importedRows);

      if (geminiError) {
        console.error("OCR Gemini import failed:", geminiError);
        console.error("OCR Gemini debug payload:", ocrDebug);
        return res.status(422).json({
          code: "OCR_IMAGE_PARSE_FAILED",
          message:
            "We could not read that mark sheet image clearly. Please upload a clearer image or use CSV/Excel.",
          ocrDebug,
        });
      }

      if (!importedRows.length) {
        console.warn("OCR import returned no valid rows.", ocrDebug);
        return res.status(422).json({
          code: "OCR_NO_ROWS_FOUND",
          message:
            "We could not find any valid student rows in that image. Please review the image quality or use CSV/Excel.",
          ocrDebug,
        });
      }
    } else {
      return res.status(400).json({ message: "Unsupported file format. Use CSV, Excel, or an image." });
    }

    const matchedRows = importedRows.map((row) => {
      const student = matchImportedRowToStudent(row, students);

      return {
        matched: Boolean(student),
        studentId: student?._id || "",
        studentName: student?.studentName || student?.username || row.rawName || "Unknown Student",
        AdmNo: student?.AdmNo || row.rawAdmNo || "",
        testscore: Math.min(40, toSafeNumber(row.testscore)),
        examscore: Math.min(60, toSafeNumber(row.examscore)),
      };
    });

    return res.status(200).json({
      rows: matchedRows,
      unmatched: matchedRows.filter((row) => !row.matched),
      matchedCount: matchedRows.filter((row) => row.matched).length,
      totalCount: matchedRows.length,
      message: "Marks imported successfully. Review and edit before saving.",
      ocrDebug,
    });
  } catch (error) {
    console.error("importMarks error:", error);
    return res.status(500).json({ message: "Failed to import marks." });
  }
};
  
