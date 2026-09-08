// import mongoose from "mongoose";

// const reportSchema = new mongoose.Schema(
//   {
//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Client",
//       required: true,
//     },
//     staff: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     reportDate: {
//       type: Date,
//       required: true, // the day this report is FOR (used for filtering by date)
//     },

//     // ---- Medication ----
//     medication: {
//       type: { type: String }, // Tablet/Pill, Cream, Fluid, Injection, Patch-PEG, Inhaler, Liquid, Capsule, Solution, Other
//       typeOtherNote: { type: String }, // free text if "Other" selected
//       completed: { type: String, enum: ["Yes", "No", "Attempted"] },
//       advanced: { type: String, enum: ["Yes", "No"] },
//     },

//     mealGiven: { type: String }, // Breakfast, Lunch, Dinner, Supper + type of food given

//     // ---- Bath / Bedtime ----
//     bathTime: { type: String },
//     bedtime: { type: String },

//     // ---- Temperature entry ----
//     temperatureEntry: {
//       time: String,
//       temperature: String,
//       notes: String,
//       completed: { type: String, enum: ["Yes", "No", "Attempted", "Not required"] },
//     },

//     // ---- Household / general tasks ----
//     cleaningDone: { type: String },
//     bedroomCheck: { type: String },
//     finances: { type: String },
//     keyworkSession: { type: String },
//     caseNote: { type: String },
//     fridgeFreezerTemp: { type: String },

//     // ---- Blood pressure ----
//     bloodPressure: {
//       systolic: String,
//       diastolic: String,
//       completedOrAtRisk: { type: String, enum: ["Yes", "Attempted", "No"] },
//       size: String,
//     },

//     // ---- Incident ----
//     incident: {
//       date: Date,
//       time: String,
//       type: String, // Slip, Fall, Fainted, Heart Attack, Medication Error, Near miss, No apparent injury, Red Mark, Scratch, Abrasion, Skin Tear, Slipped, Stroke, Tripped, Vomited
//       location: String,
//       locationDetailsWhenInjuredFromOrBack: String,
//       serviceUserInjured: { type: String, enum: ["Yes", "No"] },
//       wasResidentAbleToProvideInformation: { type: String, enum: ["Yes", "No", "Not reliable"] },
//       whatWasResidentDoingAtTimeOfIncident: String,
//       howDidIncidentHappen: String,
//       dateWhenIncidentReportedToSeniorStaff: Date,
//       wereEquipmentHardwaresInvolved: { type: String, enum: ["Yes", "No"] },
//       wereRelativesNokInformed: { type: String, enum: ["Yes", "No"] },
//       wasGpAmbulanceCalled: { type: String, enum: ["Yes", "No"] },
//       notes: String,
//     },

//     // ---- Behaviour ----
//     behaviour: {
//       date: Date,
//       time: String,
//       ticksAll: [String], // Aggression, Crying, Self-injurious behaviour, Sexualised behaviour, Shouting/screaming, Sulking/reassurance, Threats, Throwing/breaking things
//       triggerNotes: String,
//       antecedent: String, // what happened before the incident
//       consequence: String, // what happened after the incident
//     },

//     // ---- Comfort check ----
//     comfortCheck: {
//       date: Date,
//       time: String,
//       checks: [String], // Checks, Clothes, Continence, Continence Aid, Environment, Grooming, Incontinence Pad changed, Positioning, Repositioned, Sleep, Status check, Toileted
//       moodFound: { type: String, enum: ["Yes", "No"] },
//       voiceFound: { type: String, enum: ["Yes", "No", "N/A"] },
//       reasonNotFound: String,
//       completed: { type: String, enum: ["Completed", "Attempted", "Not required"] },
//     },

//     // ---- Blood sugar ----
//     bloodSugar: {
//       date: Date,
//       time: String,
//       readingTaken: String, // Before breakfast, After breakfast, Before lunch, etc.
//       bloodGlucoseLevel: String,
//       insulinGivenUnits: String,
//       siteAdministered: { type: String, enum: ["Left arm", "Right arm", "Left upper", "Right upper", "Left thigh", "Right thigh", "Other"] },
//       completed: { type: String, enum: ["Yes", "No"] },
//     },

//     // ---- File upload ----
//     uploadedReportFile: {
//       fileName: String,
//       fileUrl: String,
//     },
//   },
//   { timestamps: true } // createdAt acts as the "Timestamp" shown in screen 11/12
// );

// // Index for fast lookups by client + date
// reportSchema.index({ client: 1, reportDate: 1 });

// export default mongoose.model("Report", reportSchema);


import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "",
    },
    lastedMinutes: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    locationDetails: {
      type: String,
      default: "",
    },
    injured: {
      type: String,
      default: "",
    },
    residentProvidedInfo: {
      type: String,
      default: "",
    },
    whatDoing: {
      type: String,
      default: "",
    },
    howHappened: {
      type: String,
      default: "",
    },
    reportedToSeniorDate: {
      type: String,
      default: "",
    },
    equipmentInvolved: {
      type: String,
      default: "",
    },
    relativesInformed: {
      type: String,
      default: "",
    },
    gpAmbulance: {
      type: String,
      default: "",
    },
    gpAmbulanceDetails: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const reportSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportDate: {
      type: Date,
      required: true,
    },

    medication: {
      type: {
        type: String,
        default: "",
      },
      typeOtherNote: {
        type: String,
        default: "",
      },
      completed: {
        type: String,
        enum: ["Yes", "No", "Attempted", ""],
        default: "",
      },
      advanced: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },
    },

    mealGiven: {
      type: String,
      default: "",
    },

    bathTime: {
      type: String,
      default: "",
    },

    bedtime: {
      type: String,
      default: "",
    },

    temperatureEntry: {
      time: {
        type: String,
        default: "",
      },
      temperature: {
        type: String,
        default: "",
      },
      notes: {
        type: String,
        default: "",
      },
      completed: {
        type: String,
        enum: ["Yes", "No", "Attempted", "Not required", ""],
        default: "",
      },
    },

    cleaningDone: {
      type: String,
      default: "",
    },

    bedroomCheck: {
      type: String,
      default: "",
    },

    finances: {
      type: String,
      default: "",
    },

    keyworkSession: {
      type: String,
      default: "",
    },

    caseNote: {
      type: String,
      default: "",
    },

    fridgeFreezerTemp: {
      type: String,
      default: "",
    },

    bloodPressure: {
      systolic: {
        type: String,
        default: "",
      },
      diastolic: {
        type: String,
        default: "",
      },
      completedOrAtRisk: {
        type: String,
        enum: ["Yes", "Attempted", "No", ""],
        default: "",
      },
      size: {
        type: String,
        default: "",
      },
    },

    incident: {
      type: incidentSchema,
      default: () => ({}),
    },

    behaviour: {
      date: {
        type: Date,
      },
      time: {
        type: String,
        default: "",
      },
      ticksAll: {
        type: [String],
        default: [],
      },
      triggerNotes: {
        type: String,
        default: "",
      },
      antecedent: {
        type: String,
        default: "",
      },
      consequence: {
        type: String,
        default: "",
      },
    },

    comfortCheck: {
      date: {
        type: Date,
      },
      time: {
        type: String,
        default: "",
      },
      checks: {
        type: [String],
        default: [],
      },
      moodFound: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },
      voiceFound: {
        type: String,
        enum: ["Yes", "No", "N/A", ""],
        default: "",
      },
      reasonNotFound: {
        type: String,
        default: "",
      },
      completed: {
        type: String,
        enum: ["Completed", "Attempted", "Not required", ""],
        default: "",
      },
    },

    bloodSugar: {
      date: {
        type: Date,
      },
      time: {
        type: String,
        default: "",
      },
      readingTaken: {
        type: String,
        default: "",
      },
      bloodGlucoseLevel: {
        type: String,
        default: "",
      },
      insulinGivenUnits: {
        type: String,
        default: "",
      },
      siteAdministered: {
        type: String,
        enum: [
          "Left arm",
          "Right arm",
          "Left upper",
          "Right upper",
          "Left thigh",
          "Right thigh",
          "Other",
          "",
        ],
        default: "",
      },
      completed: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },
    },

    uploadedReportFile: {
      fileName: {
        type: String,
        default: "",
      },
      fileUrl: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({
  client: 1,
  reportDate: 1,
});

export default mongoose.model("Report", reportSchema);
