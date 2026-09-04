import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true }, // e.g. CLT-2024-001
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female"] },
    bloodType: { type: String },
    height: { type: String },
    address: { type: String },
    religion: { type: String },
    ethnicity: { type: String },
    region: { type: String },
    maritalStatus: { type: String },
    keySafeCode: { type: String },
    communicationPreference: { type: String },
    doctor: { type: String }, // shown on client card e.g. "Dr. Sarah Johnson"
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    emergencyContact: {
      familyMemberName: String,
      relationship: String,
      nextOfKinName: String,
      nextOfKinPhone: String,
    },

    medicalHistory: { type: String },
    allergies: { type: String }, // comma-separated per screen 6

    medications: [
      {
        name: String,
        dosage: String,
        time: String,
        date: Date,
        instructions: String,
      },
    ],

    favoriteActivities: { type: String },

    dailyCare: {
      bedtime: String,
      bathTime: String,
    },

    foodIntake: [
      {
        mealType: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Tea", "Inter Supper"] },
        mealDescription: String,
        mealTime: String,
        mealDay: String,
      },
    ],

    documents: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // screen "Assign client"
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);