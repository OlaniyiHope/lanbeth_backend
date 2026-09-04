import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
    },
    prompt: {
      type: String,
    },
    answerText: {
      type: String,
      required: true,
    },
    attachmentName: {
      type: String,
    },
    attachmentUrl: {
      type: String,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
    feedback: {
      type: String,
    },
    grade: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);
