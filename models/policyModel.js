import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    policyType: {
      type: String,
      required: true,
      enum: [
        "Policy",
        "Procedure",
        "Guideline",
        "Protocol",
        "Other",
      ],
      default: "Policy",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    fileName: {
      type: String,
      required: true,
    },

    fileKey: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Policy", policySchema);