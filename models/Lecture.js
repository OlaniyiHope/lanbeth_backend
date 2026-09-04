import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    // "link"  -> url points to an external video/lecture link (YouTube, Zoom recording, etc.)
    // "file"  -> url points to a file uploaded to S3 (PDF, slides, recorded video file, etc.)
    resourceType: {
      type: String,
      enum: ["link", "file"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String, // only set when resourceType is "file"
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lecture", lectureSchema);
