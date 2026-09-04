import dotenv from "dotenv";
dotenv.config(); // must run before anything that reads process.env

console.log("CWD:", process.cwd());
console.log("MONGODB_URI loaded:", process.env.MONGODB_URI ? "yes" : "MISSING");
import express from "express";
import cors from "cors";
import { S3 } from "@aws-sdk/client-s3";
import connectDB from "./config/db2.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoute from "./routes/clientRoute.js";
import reportRoute from "./routes/reportRoute.js";
import staffRoute from "./routes/staffRoute.js";
import policyRoute from "./routes/policyRoute.js";
// import clientRoutes from "./routes/clientRoutes.js";
// import staffRoutes from "./routes/staffRoutes.js";
// import policyRoutes from "./routes/policyRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";

connectDB();

const app = express();

// AWS S3 setup
export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// ---- CORS ----
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://app.lanbethresolutions.co.uk",
  "http://localhost:5174",
  // add the real Lanbeth frontend URL(s) here once deployed, e.g.:
  // "https://portal.lanbethresolutions.com",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ---- Body parsers (single source of truth, generous limit for base64 doc uploads) ----
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoute);
app.use("/api/report", reportRoute);
app.use("/api/staff", staffRoute);
app.use("/api/policy", policyRoute);


app.get("/", (req, res) => {
  res.json({ status: "LanbethCare API running" });
});

// ---- 404 handler (after all routes) ----
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---- Central error handler (must be last, 4 args) ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));