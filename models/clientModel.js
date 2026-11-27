
// import mongoose from "mongoose";

// const clientSchema = new mongoose.Schema(
//   {
//     clientId: { type: String, unique: true },
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String },
//     dateOfBirth: { type: Date },
//     gender: { type: String, enum: ["Male", "Female", "Other"] }, // "Other" added
//     bloodType: { type: String },
//     height: { type: String },
//     address: { type: String },
//     religion: { type: String },
//     ethnicity: { type: String },
//     region: { type: String },
//     maritalStatus: { type: String },
//     keySafeCode: { type: String },
//     localAuthorityNo: { type: String, trim: true, index: true },
//     // Council section
// councilServiceUserId: { type: String, trim: true, index: true },
// councilCareProviderId: { type: String, trim: true, index: true },
// serviceType: { type: String, trim: true },
// serviceLevel: { type: String, trim: true },

// // Used by the client table
// authority: { type: String, trim: true },
// foodAllergy: { type: String, trim: true },
//     communicationPreference: { type: String },
//     doctor: { type: String },
//     status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
//     postCode: { type: String },
// isArchived: { type: Boolean, default: false, index: true },
// archivedAt: { type: Date },
// archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     emergencyContact: {
//       familyMemberName: String,
//       relationship: String,
//       nextOfKinName: String,
//       nextOfKinPhone: String,
//     },

//     // (title / dateOfAssessment / expiryDate removed from here)

//     professionals: [
//       {
//         role: {
//           type: String,
//           enum: [
//             "Dentist",
//             "Social Worker",
//             "GP",
//             "Pharmacy",
//             "Optician",
//             "Health Care Assessment",
//             "Placing Local Authority",
//             "College / University",
//             "Training / College / Personal Tutor",
//           ],
//           required: true,
//         },
//         name: String,
//         phone: String,
//         email: String,
//         address: String,
//         postCode: String,
//         surgeryAddress: String,
//         registeredDate: Date,
//       },
//     ],

//     profilePhoto: { type: String },
//     medicalHistory: { type: String },
//     allergies: { type: String },

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
// pronouns: { type: String, enum: ["He", "She", "They", ""], default: "" },
//     dailyCare: {
//       bedtime: String,
//       bathTime: String,
//     },

//     foodIntake: [
//       {
//         mealType: {
//           type: String,
//           enum: ["Breakfast", "Lunch", "Dinner", "Tea", "Supper", "Inter Supper"], // "Supper" added
//         },
//         mealDescription: String,
//         mealTime: String,
//         mealDay: String,
//       },
//     ],

//     documents: [
//       {
//         documentType: {
//           type: String,
//           enum: [
//             "Care Plan",
//             "Identity Document",
//             "Medical Record",
//             "Medication Record",
//             "Assessment",
//             "Support Plan",
//             "Consent Form",
//             "Risk Assessment",
//             "Training Record",
//             "Other",
//           ],
//           required: true,
//         },
//         title: { type: String },            // moved here
//         dateOfAssessment: { type: Date },   // moved here
//         expiryDate: { type: Date },         // moved here
//         fileName: { type: String, required: true },
//         fileKey: { type: String, required: true },
//         fileUrl: { type: String },
//         uploadedAt: { type: Date, default: Date.now },
//       },
//     ],

//     assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Client", clientSchema);

import mongoose from "mongoose";

const DEFAULT_DOCUMENT_VIEWERS = ["super_admin", "admin", "staff"];

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    pronouns: { type: String, enum: ["He", "She", "They", ""], default: "" },
    sexuality: {
      type: String,
      enum: ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Prefer not to say", "Other", ""],
      default: "",
    },
    bloodType: { type: String },
    height: { type: String },
    address: { type: String },
    religion: { type: String },
    ethnicity: { type: String },
    region: { type: String },
    maritalStatus: { type: String },
    keySafeCode: { type: String },

    // Identity numbers (Personal Information)
    nhsNumber: { type: String, trim: true },
    chiNumber: { type: String, trim: true },
    niNumber: { type: String, trim: true },

    localAuthorityNo: { type: String, trim: true, index: true },

    // Council section
    councilServiceUserId: { type: String, trim: true, index: true },
    councilCareProviderId: { type: String, trim: true, index: true },
    serviceType: { type: String, trim: true },
    serviceLevel: { type: String, trim: true },

    // Used by the client table
    authority: { type: String, trim: true },
    foodAllergy: { type: String, trim: true },

    // Language preference: one or more languages
    languages: [{ type: String, trim: true }],
    communicationPreference: { type: String }, // kept for existing records (first language)

    doctor: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    postCode: { type: String },
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
category: {
  type: String,
  enum: ["keywork", "bedroom", "finance", "feedback", "education", "ipa", null],
  default: null,
},
    // Admission section (fixed fields plus custom "+" fields)
    admission: {
      startDate: Date,
      banding: String,
      authorityCategory: String,
      funeralArrangements: String,
      funeralDirector: String,
      team: String,
      defaultShiftRun: String,
      extraFields: [{ label: String, value: String }],
    },

    // Family & emergency contacts
    emergencyContact: {
      familyMemberName: String,
      relationship: String,
      nextOfKinName: String,
      nextOfKinPhone: String,
      emails: [String],
      addresses: [String],
    },

    // Professionals around the individual (can have several entries)
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
        registeredDate: Date,
      },
    ],

    profilePhoto: { type: String },

    // Medical / health information
    medicalHistory: { type: String },
    allergies: { type: String },
    dnar: {
      type: String,
      enum: ["Resuscitate", "Do not Resuscitate", ""],
      default: "",
    },
    medicalHealth: {
      oxygen: { type: String, enum: ["Yes", "No", ""], default: "" },
      onCatheter: { type: Boolean, default: false },
      teamInvolvement: [{ type: String }],
    },

    medications: [
      {
        name: String,
        dosage: String,
        time: String,
        date: Date,
        instructions: String,
      },
    ],

    favoriteActivities: { type: String }, // now a paragraph

    dailyCare: {
      bedtime: String,
      bathTime: String,
    },

    foodIntake: [
      {
        mealType: {
          type: String,
          enum: ["Breakfast", "Lunch", "Dinner", "Tea", "Supper", "Inter Supper"],
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
        title: { type: String },
        dateOfAssessment: { type: Date }, // the single date for records and documents (no expiry date)
        fileName: { type: String, required: true },
        fileKey: { type: String, required: true },
        fileUrl: { type: String },
        uploadedAt: { type: Date, default: Date.now },

        // Which roles can see this document (item 14)
        visibleTo: {
          type: [{ type: String, enum: ["super_admin", "admin", "staff"] }],
          default: DEFAULT_DOCUMENT_VIEWERS,
        },
      },
    ],

    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);