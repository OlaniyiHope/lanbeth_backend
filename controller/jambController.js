import mongoose from "mongoose";
import { parseISO } from "date-fns";
import Jamb from "../models/jambModel.js";
import JambSubject from "../models/jambSubject.js";
import JambQuestion from "../models/jambquestionModel.js";

// export const createJambExam = async (req, res) => {
//   try {
//     const {
//       studentName,
//       selectedSubjects,
//       examMode,
//       examTime,
//       shuffleQuestions,
//       shuffleOptions,
//     } = req.body;

//     // Validation
//     if (
//       !studentName ||
//       selectedSubjects.length === 0 ||
//       !examMode ||
//       !examTime
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all required fields" });
//     }

//     // Create new exam instance
//     const newExam = new Jamb({
//       studentName,
//       selectedSubjects,
//       examMode,
//       examTime,
//       shuffleQuestions,
//       shuffleOptions,
//     });

//     // Save to database
//     await newExam.save();

//     res
//       .status(201)
//       .json({ message: "Exam created successfully", exam: newExam });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Get all JAMB Exams

// export const createJambExam = async (req, res) => {
//   try {
//     const {
//       selectedSubjects,
//       examMode,
//       examTime,
//       shuffleQuestions,
//       shuffleOptions,
//       instruction,
//       questions, // Array of question IDs
//     } = req.body;

//     // Validation
//     if (!selectedSubjects.length || !examMode || !examTime) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all required fields" });
//     }

//     // Create new exam instance
//     const newExam = new Jamb({
//       selectedSubjects,
//       examMode,
//       examTime,
//       shuffleQuestions,
//       shuffleOptions,
//       instruction,
//       questions, // Associate questions with the exam
//       submittedAnswers: [], // Empty at creation
//     });

//     // Save to database
//     await newExam.save();

//     res
//       .status(201)
//       .json({ message: "Exam created successfully", exam: newExam });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const createJambExam = async (req, res) => {
//   try {
//     const {
//       examMode,
//       examTime,
//       shuffleQuestions,
//       shuffleOptions,
//       instruction,
//       questions,
//     } = req.body;

//     // Validate required fields
//     if (!examMode || !examTime) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all required fields" });
//     }

//     // Fetch all available subjects from the database
//     const subjects = await JambSubject.find();

//     if (!subjects.length) {
//       return res
//         .status(400)
//         .json({ message: "No subjects found. Please add subjects first." });
//     }

//     // Extract subject IDs from fetched subjects
//     const selectedSubjects = subjects.map((subject) => subject._id);

//     // Create new exam instance
//     const newExam = new Jamb({
//       selectedSubjects, // Use subjects from the database
//       examMode,
//       examTime,
//       shuffleQuestions,
//       shuffleOptions,
//       instruction,
//       questions, // Associate questions with the exam
//       submittedAnswers: [], // Empty at creation
//     });

//     // Save to database
//     await newExam.save();

//     res
//       .status(201)
//       .json({ message: "Exam created successfully", exam: newExam });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const createJambExam = async (req, res) => {
  try {
    const {
      selectedSubjects, // Accept selected subjects from request body
      examMode,
      examTime,
      shuffleQuestions,
      shuffleOptions,
      instruction,
      questions,
    } = req.body;

    // Validate required fields
    if (!selectedSubjects || selectedSubjects.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one subject" });
    }

    if (!examMode || !examTime) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Validate if selected subjects exist in JambSubject collection
    const validSubjects = await JambSubject.find({
      _id: { $in: selectedSubjects },
    });

    if (validSubjects.length !== selectedSubjects.length) {
      return res
        .status(400)
        .json({ message: "Some selected subjects are invalid" });
    }

    // Create new exam instance
    const newExam = new Jamb({
      selectedSubjects, // Use subjects provided in the request
      examMode,
      examTime,
      shuffleQuestions,
      shuffleOptions,
      instruction,
      questions, // Associate questions with the exam
      submittedAnswers: [], // Empty at creation
    });

    // Save to database
    await newExam.save();

    res
      .status(201)
      .json({ message: "Exam created successfully", exam: newExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getAllJambExams = async (req, res) => {
//   try {
//     const exams = await Jamb.find().populate("questions");
//     res.status(200).json(exams);
//   } catch (error) {
//     console.error("Error fetching JAMB exams:", error);
//     res.status(500).json({ error: "An error occurred while fetching exams." });
//   }
// };
export const getAllJambExams = async (req, res) => {
  try {
    const exams = await Jamb.find()
      .populate("questions") // Populate questions
      .populate("selectedSubjects"); // Populate selectedSubjects to get full details

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching JAMB exams:", error);
    res.status(500).json({ error: "An error occurred while fetching exams." });
  }
};

export const getExamWithQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch the exam by ID
    const exam = await Jamb.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Fetch all questions associated with this exam
    const questions = await JambQuestion.find({ exam: examId });

    res.status(200).json({ exam, questions });
  } catch (error) {
    console.error("Error fetching exam and questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get JAMB Exam by ID
// export const getJambExamById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid exam ID" });
//     }

//     const exam = await Jamb.findById(id).populate("questions");
//     if (!exam) {
//       return res.status(404).json({ error: "Exam not found" });
//     }

//     res.status(200).json(exam);
//   } catch (error) {
//     console.error("Error fetching JAMB exam:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the exam." });
//   }
// };

// export const getJambExamById = async (req, res) => {
//   try {
//     const { examId, sessionId } = req.params;

//     // Validate examId
//     if (!mongoose.Types.ObjectId.isValid(examId)) {
//       return res.status(400).json({ error: "Invalid exam ID" });
//     }

//     // Validate sessionId
//     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//       return res.status(400).json({ error: "Invalid session ID" });
//     }

//     // Convert sessionId to ObjectId for the query
//     const exam = await Jamb.findOne({
//       _id: examId,
//       session: new mongoose.Types.ObjectId(sessionId), // Use ObjectId for session
//     }).populate("questions");

//     if (!exam) {
//       return res.status(404).json({ error: "Exam not found for this session" });
//     }

//     // Allow access if className is "JAMB" or starts with "S.S.3"
//     if (exam.className === "JAMB" || exam.className.startsWith("S.S.3.S")

//     ) {
//       return res.status(200).json(exam);
//     } else {
//       return res.status(403).json({ error: "Access denied for this class" });
//     }
//   } catch (error) {
//     console.error("Error fetching JAMB exam:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the exam." });
//   }
// };

// export const getJambExamById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const exam = await Jamb.findById(id).populate("questions");

//     if (!exam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     res.status(200).json(exam);
//   } catch (error) {
//     console.error("Error fetching JAMB exam by ID:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const getJambExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Jamb.findById(id)
      .populate("questions") // Populate questions
      .populate("selectedSubjects"); // Populate selectedSubjects for full details

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Error fetching JAMB exam by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit JAMB Exam Answers
export const submitJambExamAnswers = async (req, res) => {
  try {
    const { examId, userId, answers, score } = req.body;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ error: "Invalid exam ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const exam = await Jamb.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    exam.submittedAnswers.push({ userId, answers, score });
    await exam.save();

    res.status(200).json({ message: "Exam submitted successfully" });
  } catch (error) {
    console.error("Error submitting JAMB exam:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the exam." });
  }
};
export const getJambExamsByYear = async (req, res) => {
  try {
    const { year } = req.params;

    const exams = await Jamb.find({ year }).populate("questions session");
    if (exams.length === 0) {
      return res.status(404).json({ error: "No exams found for this year" });
    }

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching JAMB exams by year:", error);
    res.status(500).json({ error: "An error occurred while fetching exams." });
  }
};

// export const createSubject = async (req, res) => {
//   const { name } = req.body; // Add session to the request body

//   try {
//     // Find the teacher and class documents by name

//     // If session is provided, add it to the subject
//     const newSub = new JambSubject({
//       name,
//     });

//     const savedSub = await newSub.save();
//     res.status(200).json(savedSub);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
// export const createSubject = async (req, res) => {
//   try {
//     // Expecting an array of subjects in req.body
//     if (!Array.isArray(req.body) || req.body.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Invalid input. Expected an array of subjects." });
//     }

//     // Insert multiple documents at once
//     const savedSubjects = await JambSubject.insertMany(req.body);

//     res.status(201).json(savedSubjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const createSubject = async (req, res) => {
//   try {
//     // Ensure the request body is an array
//     if (!Array.isArray(req.body) || req.body.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Invalid input. Expected an array of subjects." });
//     }

//     // Validate each entry in the array
//     const subjects = req.body.map(
//       ({ subject, examYear, numQuestions, topic }) => {
//         if (!subject || !examYear || !numQuestions || !topic) {
//           throw new Error(
//             "Each subject must have a subject name, examYear, numQuestions, and a topic."
//           );
//         }
//         return { subject, examYear, numQuestions, topic };
//       }
//     );

//     // Insert multiple subjects at once
//     const savedSubjects = await JambSubject.insertMany(subjects);

//     res.status(201).json(savedSubjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
export const createSubject = async (req, res) => {
  try {
    // Ensure the request body is an array
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Invalid input. Expected an array of subjects.",
      });
    }

    // Validate each entry in the array
    const subjects = req.body.map(
      ({ subject, examYear, numQuestions, topic }) => {
        if (!subject || !examYear || !numQuestions || !topic) {
          throw new Error(
            "Each subject must have a subject name, examYear, numQuestions, and a topic."
          );
        }
        return { subject, examYear, numQuestions, topic };
      }
    );

    const savedSubjects = [];

    for (const item of subjects) {
      // Check if the subject already exists
      const existingSubject = await JambSubject.findOne({
        subject: item.subject,
        examYear: item.examYear,
        topic: item.topic,
      });

      if (!existingSubject) {
        // Create a new subject if it doesn't exist
        const newSubject = new JambSubject(item);
        await newSubject.save();
        savedSubjects.push(newSubject);
      }
    }

    res.status(201).json({
      message: "Subjects added successfully",
      subjects: savedSubjects,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const getAllSubjects = async (req, res) => {
//   try {
//     const subjects = await JambSubject.find(); // Fetch all subjects
//     res.status(200).json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// export const getAllSubjects = async (req, res) => {
//   try {
//     // Fetch all subjects with relevant fields
//     const subjects = await JambSubject.find(
//       {},
//       "subject examYear numQuestions topic"
//     );

//     if (!subjects || subjects.length === 0) {
//       return res.status(404).json({ message: "No subjects found." });
//     }

//     res.status(200).json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
export const getAllSubjects = async (req, res) => {
  try {
    // Fetch all subjects and convert to plain objects
    const subjects = await JambSubject.find(
      {},
      "subject examYear numQuestions topic"
    ).lean(); // Converts Mongoose documents to plain JSON

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ message: "No subjects found." });
    }

    // Ensure proper data formatting
    const formattedSubjects = subjects.map((subject) => ({
      _id: subject._id, // Keep the ID
      subject: subject.subject, // String
      examYear: Number(subject.examYear), // Ensure it's a number
      numQuestions: Number(subject.numQuestions), // Ensure it's a number
      topic: String(subject.topic), // Ensure it's a string
    }));

    res.status(200).json(formattedSubjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const updateSubject = async (req, res) => {
//   const { subjectId } = req.params;
//   const { name, teacher, classname } = req.body;

//   try {
//     // Find the subject by ID
//     const subject = await Subject.findById(subjectId);

//     if (!subject) {
//       // If subject not found, return error
//       return res.status(404).json({ error: "Subject not found" });
//     }

//     // Update the subject properties
//     subject.name = name;
//     subject.teacher = teacher;
//     subject.classname = classname;

//     // Save the updated subject
//     const updatedSubject = await subject.save();

//     // Send back the updated subject as response
//     res.status(200).json(updatedSubject);
//   } catch (error) {
//     // Handle errors
//     console.error("Error updating subject:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getallSubject = async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.status(200).json(subjects);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// export const getSubjectsByClass = async (req, res) => {
//   const { classname, sessionId } = req.params; // Extract the class name and session ID from the route parameters

//   try {
//     // Convert sessionId to ObjectId if needed
//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     // Find subjects with the specified class name and session ID
//     const subjects = await Subject.find({
//       classname,
//       session: sessionObjectId,
//     }).exec();

//     if (!subjects || subjects.length === 0) {
//       return res.status(404).json({
//         error: "No subjects found for the specified class and session",
//       });
//     }

//     res.status(200).json(subjects);
//   } catch (err) {
//     console.error("Error fetching subjects:", err);
//     res.status(500).json({ error: "Failed to get subjects" });
//   }
// };

// // Update the getStudentSubjects function
// export const getStudentSubjects = async (req, res) => {
//   const { classname } = req.user.user;
//   console.log("Class Name:", classname);

//   try {
//     // Fetch the subjects based on the classname
//     const subjects = await Subject.find({ classname }, "name"); // Only fetch the 'name' property
//     console.log("Subjects found:", subjects);
//     res.status(200).json({ subjects });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Import necessary modules and models

// export const deleteSubject = async (req, res) => {
//   const { subjectId } = req.params; // Extract the subject ID from the route parameters

//   try {
//     // Find and delete the subject by ID
//     const deletedSubject = await Subject.findByIdAndDelete(subjectId);

//     if (!deletedSubject) {
//       // If subject not found, return an error
//       return res.status(404).json({ error: "Subject not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Subject deleted successfully", deletedSubject });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
