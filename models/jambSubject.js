// import mongoose from "mongoose";

// const JambSubjectSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("JambSubject", JambSubjectSchema);
import mongoose from "mongoose";

const JambSubjectSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true }, // Subject Name (e.g., Mathematics)
    examYear: { type: Number, required: true }, // Exam Year (e.g., 2021)
    numQuestions: { type: Number, required: true }, // Number of Questions (e.g., 10, 20)
    topic: { type: String, required: true }, // Single Topic (e.g., Algebra)
  },
  { timestamps: true }
);

export default mongoose.model("JambSubject", JambSubjectSchema);
