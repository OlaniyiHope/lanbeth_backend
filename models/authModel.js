import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["admin", "staff", "policy"], // 3 roles per client spec (User_Policy.pdf)
      default: "staff",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never returned by default on queries
    },
    phone: { type: String },
    address: { type: String },
    postcode: { type: String },
    region: { type: String },
    gender: { type: String, enum: ["Male", "Female"] },
    dateOfBirth: { type: Date },
    maritalStatus: { type: String },
    religion: { type: String },
    ethnicity: { type: String },

    // Staff-specific fields (screens 15-21) — unused for admin/policy roles
    positionAppliedFor: { type: String }, // e.g. "Care Giver role 12"
    workPermitExpiry: { type: Date },
    nextOfKinName: { type: String },
    nextOfKinPhone: { type: String },

    // Optional: only meaningful if client confirms this is a real 4th
    // permission tier rather than just a job title (see "Medical Supervisor"
    // in the Edit Staff screenshot). Safe to leave unused for now.
    jobTitle: { type: String },
// Staff document uploads (screens 16-19)
    documents: [
      {
        documentType: {
          type: String,
          enum: [
            "Immigration Status",
            "Driver License",
            "Supervision Note",
            "Training Certificate",
            "DBS",
            "National Insurance",
            "Work Permit",
            "Other",
          ],
          required: true,
        },
        fileName: { type: String },
        fileUrl: { type: String },
        expiryDate: { type: Date },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password whenever it's set/changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
