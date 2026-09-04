// import mongoose from "mongoose";

// const JambSchema = new mongoose.Schema({
//   studentName: { type: String, required: true },
//   selectedSubjects: [
//     {
//       subject: { type: String, required: true },
//       examYear: { type: Number, required: true },
//       numQuestions: { type: Number, required: true },
//       topic: { type: String, required: true },
//     },
//   ],
//   examMode: {
//     type: String,
//     enum: ["Exam", "Practice"],
//     required: true,
//   },
//   examTime: { type: Number, required: true }, // Total time in minutes
//   shuffleQuestions: { type: Boolean, default: false },
//   shuffleOptions: { type: Boolean, default: false },
//   instruction: {
//     type: String,
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Jamb", JambSchema);
import mongoose from "mongoose";

const JambSchema = new mongoose.Schema(
  {
    // selectedSubjects: [
    //   {
    //     subject: { type: String, required: true },
    //     examYear: { type: Number, required: true },
    //     numQuestions: { type: Number, required: true },
    //     topic: { type: String, required: true },
    //   },
    // ],
    selectedSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JambSubject", // Reference to JambSubject model
        required: true,
      },
    ],
    examMode: {
      type: String,
      enum: ["Exam", "Practice"],
      required: true,
    },
    examTime: { type: Number, required: true }, // Total time in minutes
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    instruction: { type: String },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JambQuestion", // References the "Question" model
      },
    ],

    submittedAnswers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth", // References the User model
          select: "fullname",
        },
        answers: {
          type: Map, // Maps question IDs to answers
          of: String, // Assuming answers are strings
        },
        score: { type: Number }, // Exam score
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Jamb", JambSchema);
