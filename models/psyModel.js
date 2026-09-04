// import mongoose from "mongoose";

// const PsySchema = new mongoose.Schema(
//   {
//     examId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Exam",
//       required: true,
//     },
//     marks: [
//       {
//         studentId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         instruction: { type: Number },
//         independently: { type: Number },
//         punctuality: { type: Number },
//         talking: { type: Number },
//         eyecontact: { type: Number },
//         remarks: { type: String },
//         premarks: { type: String },
//       },
//     ],
//     session: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Session", // Reference to the Session model
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// export default mongoose.model("Psy", PsySchema);


import mongoose from "mongoose";

const PsySchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    marks: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        // ── Affective Traits ──
        attentiveness: { type: Number },
        attitudeToWork: { type: Number },
        cooperation: { type: Number },
        emotionStability: { type: Number },
        leadership: { type: Number },
        attendance: { type: Number },
        neatness: { type: Number },
        perseverance: { type: Number },
        politeness: { type: Number },
        punctuality: { type: Number },
        speakingWriting: { type: Number },
        organisationAbility: { type: Number },
        relationshipWithOthers: { type: Number },

        // ── Psychomotor Skills ──
        handlingOfTools: { type: Number },
        handwriting: { type: Number },
        verbalFluency: { type: Number },
        processingSpeed: { type: Number },
        retentiveness: { type: Number },

        // ── Legacy fields (kept so old records/reports still resolve) ──
        instruction: { type: Number },
        independently: { type: Number },
        talking: { type: Number },
        eyecontact: { type: Number },

        remarks: { type: String },
        premarks: { type: String },
      },
    ],
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Psy", PsySchema);