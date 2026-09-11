import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    type: { type: String, default: "" },
    lastedMinutes: { type: String, default: "" },
    location: { type: String, default: "" },
    locationDetails: { type: String, default: "" },
    injured: { type: String, default: "" },
    residentProvidedInfo: { type: String, default: "" },
    whatDoing: { type: String, default: "" },
    howHappened: { type: String, default: "" },
    reportedToSeniorDate: { type: String, default: "" },
    equipmentInvolved: { type: String, default: "" },
    relativesInformed: { type: String, default: "" },
    gpAmbulance: { type: String, default: "" },
    gpAmbulanceDetails: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { _id: false }
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

    // ---- MEDICATION ----
    // Frontend sends: { name, type, completed, notes }
    medication: {
      name: { type: String, default: "" },
      type: { type: String, default: "" },
      completed: {
        type: String,
        enum: ["Yes", "No", "Not Attempted", ""],
        default: "",
      },
      notes: { type: String, default: "" },
    },

    // ---- MEAL ----
    // Frontend sends: { type, foodGiven, completed, notes }
    meal: {
      type: { type: String, default: "" },
      foodGiven: { type: String, default: "" },
      completed: {
        type: String,
        enum: ["Yes", "No", "Not Attempted", ""],
        default: "",
      },
      notes: { type: String, default: "" },
    },

    bathTime: { type: String, default: "" },
    bedtime: { type: String, default: "" },

    // ---- TEMPERATURE ----
    // Frontend sends: { date, time, completed, value, notRequired, notes }
    temperature: {
      date: { type: Date },
      time: { type: String, default: "" },
      value: { type: String, default: "" },
      notRequired: { type: Boolean, default: false },
      completed: {
        type: String,
        enum: ["Yes", "No", "Not Attempted", ""],
        default: "",
      },
      notes: { type: String, default: "" },
    },

    cleaningDone: { type: String, default: "" },
    bedroomCheck: { type: String, default: "" },
    finances: { type: String, default: "" },
    keyworkSession: { type: String, default: "" },
    caseNote: { type: String, default: "" },
    fridgeFreezerTemp: { type: String, default: "" },

    // ---- BLOOD PRESSURE ----
    // Frontend sends: { date, time, completed, systolic, diastolic, pulse, notes }
    bloodPressure: {
      date: { type: Date },
      time: { type: String, default: "" },
      systolic: { type: String, default: "" },
      diastolic: { type: String, default: "" },
      pulse: { type: String, default: "" },
      completed: {
        type: String,
        enum: ["Yes", "No", "Not Attempted", ""],
        default: "",
      },
      notes: { type: String, default: "" },
    },

    incident: {
      type: incidentSchema,
      default: () => ({}),
    },

    // ---- BEHAVIOUR ----
    // Frontend sends: { date, time, selected, communicationReason,
    //                    antecedents, consequences, notes }
    behaviour: {
      date: { type: Date },
      time: { type: String, default: "" },
      selected: { type: [String], default: [] },
      communicationReason: { type: String, default: "" },
      antecedents: { type: String, default: "" },
      consequences: { type: String, default: "" },
      notes: { type: String, default: "" },
    },

    // ---- COMFORT CHECK ----
    // Frontend sends: { time, cheeks, skin, pain, positioning, generalComfort, notes }
    comfort: {
      time: { type: String, default: "" },
      cheeks: { type: String, default: "" },
      skin: { type: String, default: "" },
      pain: { type: String, default: "" },
      positioning: { type: String, default: "" },
      generalComfort: { type: String, default: "" },
      notes: { type: String, default: "" },
    },

    // ---- BLOOD TEST ----
    // Frontend sends: { date, time, completed, type, result, notes }
    bloodTest: {
      date: { type: Date },
      time: { type: String, default: "" },
      type: { type: String, default: "" },
      result: { type: String, default: "" },
      completed: {
        type: String,
        enum: ["Yes", "No", "Not Attempted", ""],
        default: "",
      },
      notes: { type: String, default: "" },
    },

    generalNotes: { type: String, default: "" },

    uploadedReportFile: {
      fileName: { type: String, default: "" },
      fileUrl: { type: String, default: "" },
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