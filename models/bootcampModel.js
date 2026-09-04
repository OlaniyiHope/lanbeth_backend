import mongoose from "mongoose";

const bootcampSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    school: {
      type: String,
    },
    grade: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    parentWhatsapp: {
      type: String,
    },
    parentEmail: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["Onsite", "Online"],
      required: true,
    },
    courseInterest: {
      type: [String],
      enum: [
        "Web & App Coding",
        "Robotics & Electronics",
        "Python Programming",
        "Graphic Design Basics",
      ],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Select at least one course",
      },
    },
    experience: {
      type: String,
      enum: ["None", "Beginner", "Intermediate", "Advanced"],
    },
    medical: {
      type: String,
    },
    hear: {
      type: String,
      enum: [
        "Flyer",
        "From a friend",
        "From Instagram",
        "From WhatsApp",
        "From Facebook",
        "From the website",
        "Other",
      ],
      required: true,
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bootcamp", bootcampSchema);