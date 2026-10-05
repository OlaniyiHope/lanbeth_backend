// import mongoose from "mongoose";

// const clientSchema = new mongoose.Schema(
//   {
//     clientId: { type: String, unique: true }, // e.g. CLT-2024-001
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String },
//     dateOfBirth: { type: Date },
//     gender: { type: String, enum: ["Male", "Female"] },
//     bloodType: { type: String },
//     height: { type: String },
//     address: { type: String },
//     religion: { type: String },
//     ethnicity: { type: String },
//     region: { type: String },
//     maritalStatus: { type: String },
//     keySafeCode: { type: String },
//     communicationPreference: { type: String },
//     doctor: { type: String }, // shown on client card e.g. "Dr. Sarah Johnson"
//     status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
// postCode: { type: String },
//     emergencyContact: {
//       familyMemberName: String,
//       relationship: String,
//       nextOfKinName: String,
//       nextOfKinPhone: String,
//     },

//     title: { type: String },            // e.g. "Blood Test", "MRI Scan"
// dateOfAssessment: { type: Date },
// expiryDate: { type: Date },
// professionals: [
//   {
//     role: {
//       type: String,
//       enum: [
//         "Dentist",
//         "Social Worker",
//         "GP",
//         "Pharmacy",
//         "Optician",
//         "Health Care Assessment",
//         "Placing Local Authority",
//         "College / University",
//         "Training / College / Personal Tutor",
//       ],
//       required: true,
//     },
//     name: String,
//     phone: String,
//     email: String,
//     address: String,
//     postCode: String,
//     surgeryAddress: String,
//     registeredDate: Date,
//   },
// ],
// profilePhoto: { type: String }, // small resized image as a data URL
//     medicalHistory: { type: String },
//     allergies: { type: String }, // comma-separated per screen 6

//     medications: [
//       {
//         name: String,
//         dosage: String,
//         time: String,
//         date: Date,
//         instructions: String,
//       },
//     ],

//     favoriteActivities: { type: String },

//     dailyCare: {
//       bedtime: String,
//       bathTime: String,
//     },

//     foodIntake: [
//       {
//         mealType: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Tea", "Inter Supper"] },
//         mealDescription: String,
//         mealTime: String,
//         mealDay: String,
//       },
//     ],

//   documents: [
//   {
//     documentType: {
//       type: String,
//       enum: [
//         "Care Plan",
//         "Identity Document",
//         "Medical Record",
//         "Medication Record",
//         "Assessment",
//         "Support Plan",
//         "Consent Form",
//         "Risk Assessment",
//         "Training Record",
//         "Other",
//       ],
//       required: true,
//     },

//     fileName: {
//       type: String,
//       required: true,
//     },

//     // Private S3 object key
//     fileKey: {
//       type: String,
//       required: true,
//     },

//     // Optional legacy/display URL
//     fileUrl: {
//       type: String,
//     },

//     uploadedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
// ],
//     assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // screen "Assign client"
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Client", clientSchema);
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] }, // "Other" added
    bloodType: { type: String },
    height: { type: String },
    address: { type: String },
    religion: { type: String },
    ethnicity: { type: String },
    region: { type: String },
    maritalStatus: { type: String },
    keySafeCode: { type: String },
    communicationPreference: { type: String },
    doctor: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    postCode: { type: String },

    emergencyContact: {
      familyMemberName: String,
      relationship: String,
      nextOfKinName: String,
      nextOfKinPhone: String,
    },

    // (title / dateOfAssessment / expiryDate removed from here)

    professionals: [
      {
        role: {
          type: String,
          enum: [
            "Dentist",
            "Social Worker",
            "GP",
            "Pharmacy",
            "Optician",
            "Health Care Assessment",
            "Placing Local Authority",
            "College / University",
            "Training / College / Personal Tutor",
          ],
          required: true,
        },
        name: String,
        phone: String,
        email: String,
        address: String,
        postCode: String,
        surgeryAddress: String,
        registeredDate: Date,
      },
    ],

    profilePhoto: { type: String },
    medicalHistory: { type: String },
    allergies: { type: String },

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
        mealType: {
          type: String,
          enum: ["Breakfast", "Lunch", "Dinner", "Tea", "Supper", "Inter Supper"], // "Supper" added
        },
        mealDescription: String,
        mealTime: String,
        mealDay: String,
      },
    ],

    documents: [
      {
        documentType: {
          type: String,
          enum: [
            "Care Plan",
            "Identity Document",
            "Medical Record",
            "Medication Record",
            "Assessment",
            "Support Plan",
            "Consent Form",
            "Risk Assessment",
            "Training Record",
            "Other",
          ],
          required: true,
        },
        title: { type: String },            // moved here
        dateOfAssessment: { type: Date },   // moved here
        expiryDate: { type: Date },         // moved here
        fileName: { type: String, required: true },
        fileKey: { type: String, required: true },
        fileUrl: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);