// import Homework from "../models/Homework.js";
// import OpenAI from "openai";

// // Only initializes if OPENAI_API_KEY is set, so the server doesn't crash
// // if you haven't configured it yet.
// const openai = process.env.OPENAI_API_KEY
//   ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//   : null;

// // Helper to consistently pull the logged-in user's id off req.user,
// // regardless of whether your JWT payload uses "id" or "_id".
// const getUserId = (req) => req.user?._id || req.user?.id;

// // GET /api/homework/submissions?sessionId=...
// // export const getHomeworkSubmissions = async (req, res) => {
// //   try {
// //     const studentId = getUserId(req);
// //     if (!studentId) {
// //       return res.status(401).json({ message: "Not authenticated." });
// //     }

// //     const { sessionId } = req.query;
// //     const filter = { student: studentId };
// //     if (sessionId) filter.session = sessionId;

// //     const submissions = await Homework.find(filter).sort({ createdAt: -1 });
// //     res.json(submissions);
// //   } catch (error) {
// //     console.error("getHomeworkSubmissions error:", error);
// //     res.status(500).json({ message: "Failed to load homework submissions." });
// //   }
// // };



// export const getHomeworkSubmissions = async (req, res) => {
//   try {
//     const userId = getUserId(req);
//     if (!userId) {
//       return res.status(401).json({ message: "Not authenticated." });
//     }
 
//     const role = req.user?.role;
//     const { sessionId } = req.query;
 
//     const filter = {};
//     if (sessionId) filter.session = sessionId;
//     if (role === "student") {
//       filter.student = userId;
//     }
//     // teachers/admins: no student filter, so they see the whole session's submissions
 
//     console.log("getHomeworkSubmissions - role:", role);
//     console.log("getHomeworkSubmissions - sessionId from query:", sessionId);
//     console.log("getHomeworkSubmissions - filter used:", filter);
 
//     const allDocsIgnoringFilter = await Homework.find({});
//     console.log(
//       "getHomeworkSubmissions - total homework docs in DB (ignoring filter):",
//       allDocsIgnoringFilter.length
//     );
//     console.log(
//       "getHomeworkSubmissions - their session values:",
//       allDocsIgnoringFilter.map((d) => d.session?.toString())
//     );
 
//     const submissions = await Homework.find(filter)
//       .populate("student", "studentName username classname")
//       .sort({ createdAt: -1 });
 
//     console.log("getHomeworkSubmissions - matched count:", submissions.length);
 
//     const shaped = submissions.map((submission) => {
//       const obj = submission.toObject();
//       obj.studentName =
//         submission.student?.studentName || submission.student?.username || "Unknown student";
//       obj.className = submission.student?.classname || "";
//       obj.student = submission.student?._id;
//       return obj;
//     });
 
//     res.json(shaped);
//   } catch (error) {
//     console.error("getHomeworkSubmissions error:", error);
//     res.status(500).json({ message: "Failed to load homework submissions." });
//   }
// };
// // POST /api/homework/submissions (multipart/form-data)
// // S3 upload now happens in the multer-s3 middleware (see homeworkRoute.js),
// // so by the time this runs, req.file.location is already a public URL.
// export const createHomeworkSubmission = async (req, res) => {
//   try {
//     const studentId = getUserId(req);
//     if (!studentId) {
//       return res.status(401).json({ message: "Not authenticated." });
//     }

//     const { title, subject, prompt, answerText, attachmentName, session } = req.body;

//     if (!title || !answerText) {
//       return res.status(400).json({ message: "Homework title and answer are required." });
//     }
//     if (!session) {
//       return res.status(400).json({ message: "Session is required." });
//     }

//     let attachmentUrl = "";
//     let finalAttachmentName = attachmentName || "";

//     if (req.file) {
//       attachmentUrl = req.file.location; // public S3 URL, provided by multer-s3
//       finalAttachmentName = req.file.originalname;
//     }

//     const submission = await Homework.create({
//       title,
//       subject,
//       prompt,
//       answerText,
//       attachmentName: finalAttachmentName,
//       attachmentUrl,
//       student: studentId,
//       session,
//     });

//     res.status(201).json(submission);
//   } catch (error) {
//     console.error("createHomeworkSubmission error:", error);
//     res.status(500).json({ message: "Failed to submit homework." });
//   }
// };

// // POST /api/homework/assistant
// export const askHomeworkAssistant = async (req, res) => {
//   try {
//     const { question, subject } = req.body;

//     if (!question || !question.trim()) {
//       return res.status(400).json({ message: "Question is required." });
//     }

//     if (!openai) {
//       return res.status(500).json({
//         message: "AI assistant is not configured. Set OPENAI_API_KEY on the server.",
//       });
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful homework assistant for school students. Explain concepts clearly and guide the student's thinking rather than just handing over finished answers for graded work.",
//         },
//         {
//           role: "user",
//           content: subject ? `Subject: ${subject}\nQuestion: ${question}` : question,
//         },
//       ],
//       temperature: 0.4,
//     });

//     const answer = completion.choices?.[0]?.message?.content || "";
//     res.json({ answer });
//   } catch (error) {
//     console.error("askHomeworkAssistant error:", error);
//     res.status(500).json({ message: "Homework assistant failed." });
//   }
// };

import Homework from "../models/Homework.js";
import OpenAI from "openai";

// Only initializes if OPENAI_API_KEY is set, so the server doesn't crash
// if you haven't configured it yet.
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Helper to consistently pull the logged-in user's id off req.user,
// regardless of whether your JWT payload uses "id" or "_id".
const getUserId = (req) => req.user?._id || req.user?.id;

// GET /api/homework/submissions?sessionId=...
// Students see only their own submissions. Teachers/admins see everyone's
// submissions for the session, with the student's name/class populated in.
export const getHomeworkSubmissions = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const role = req.user?.role;
    const { sessionId } = req.query;

    const filter = {};
    if (sessionId) filter.session = sessionId;
    if (role === "student") {
      filter.student = userId;
    }
    // teachers/admins: no student filter, so they see the whole session's submissions

    console.log("getHomeworkSubmissions - role:", role);
    console.log("getHomeworkSubmissions - sessionId from query:", sessionId);
    console.log("getHomeworkSubmissions - filter used:", filter);

    const allDocsIgnoringFilter = await Homework.find({});
    console.log(
      "getHomeworkSubmissions - total homework docs in DB (ignoring filter):",
      allDocsIgnoringFilter.length
    );
    console.log(
      "getHomeworkSubmissions - their session values:",
      allDocsIgnoringFilter.map((d) => d.session?.toString())
    );

    const submissions = await Homework.find(filter)
      .populate("student", "studentName username classname")
      .sort({ createdAt: -1 });

    console.log("getHomeworkSubmissions - matched count:", submissions.length);

    const shaped = submissions.map((submission) => {
      const obj = submission.toObject();
      obj.studentName =
        submission.student?.studentName || submission.student?.username || "Unknown student";
      obj.className = submission.student?.classname || "";
      obj.student = submission.student?._id;
      return obj;
    });

    res.json(shaped);
  } catch (error) {
    console.error("getHomeworkSubmissions error:", error);
    res.status(500).json({ message: "Failed to load homework submissions." });
  }
};

// POST /api/homework/submissions (multipart/form-data)
// S3 upload happens in the multer-s3 middleware (see homeworkRoute.js),
// so by the time this runs, req.file.location is already a public URL.
export const createHomeworkSubmission = async (req, res) => {
  try {
    const studentId = getUserId(req);
    if (!studentId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const { title, subject, prompt, answerText, attachmentName, session } = req.body;

    if (!title || !answerText) {
      return res.status(400).json({ message: "Homework title and answer are required." });
    }
    if (!session) {
      return res.status(400).json({ message: "Session is required." });
    }

    let attachmentUrl = "";
    let finalAttachmentName = attachmentName || "";

    if (req.file) {
      attachmentUrl = req.file.location; // public S3 URL, provided by multer-s3
      finalAttachmentName = req.file.originalname;
    }

    const submission = await Homework.create({
      title,
      subject,
      prompt,
      answerText,
      attachmentName: finalAttachmentName,
      attachmentUrl,
      student: studentId,
      session,
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("createHomeworkSubmission error:", error);
    res.status(500).json({ message: "Failed to submit homework." });
  }
};

// PATCH /api/homework/submissions/:id
// Teachers/admins grade a submission: sets grade, feedback, and status.
export const updateHomeworkSubmission = async (req, res) => {
  try {
    const role = req.user?.role;
    const { id } = req.params;
    const { grade, feedback, status } = req.body;

    console.log("updateHomeworkSubmission - role:", role);
    console.log("updateHomeworkSubmission - submission id param:", id);
    console.log("updateHomeworkSubmission - body:", { grade, feedback, status });

    if (role !== "teacher" && role !== "admin") {
      console.log("updateHomeworkSubmission - blocked: role not teacher/admin");
      return res.status(403).json({ message: "Only teachers can grade homework." });
    }

    const update = {};
    if (grade !== undefined) update.grade = grade;
    if (feedback !== undefined) update.feedback = feedback;
    if (status !== undefined) update.status = status;

    const submission = await Homework.findByIdAndUpdate(id, update, { new: true });

    console.log("updateHomeworkSubmission - result:", submission ? "updated" : "not found");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.json(submission);
  } catch (error) {
    console.error("updateHomeworkSubmission error:", error);
    res.status(500).json({ message: "Failed to update homework submission." });
  }
};

// POST /api/homework/assistant
export const askHomeworkAssistant = async (req, res) => {
  try {
    const { question, subject } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required." });
    }

    if (!openai) {
      return res.status(500).json({
        message: "AI assistant is not configured. Set OPENAI_API_KEY on the server.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful homework assistant for school students. Explain concepts clearly and guide the student's thinking rather than just handing over finished answers for graded work.",
        },
        {
          role: "user",
          content: subject ? `Subject: ${subject}\nQuestion: ${question}` : question,
        },
      ],
      temperature: 0.4,
    });

    const answer = completion.choices?.[0]?.message?.content || "";
    res.json({ answer });
  } catch (error) {
    console.error("askHomeworkAssistant error:", error);
    res.status(500).json({ message: "Homework assistant failed." });
  }
};