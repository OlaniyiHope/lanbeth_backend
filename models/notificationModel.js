import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["document_expiring", "document_expired"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },

    // The user whose document this is about
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    documentId: { type: mongoose.Schema.Types.ObjectId },
    documentType: { type: String },
    expiryDate: { type: Date },

    // Prevents duplicate notifications for the same document/expiry/recipient
    dedupeKey: { type: String, required: true },

    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

notificationSchema.index({ recipient: 1, dedupeKey: 1 }, { unique: true });
notificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);