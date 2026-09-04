import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String, // e.g. "CSC201" — optional but useful for polytechnic-style courses
    },
    description: {
      type: String,
    },
    department: {
      type: String,
    },
    thumbnailUrl: {
      type: String, // optional cover image, uploaded to S3
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
