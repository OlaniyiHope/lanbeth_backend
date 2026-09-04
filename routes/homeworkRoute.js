import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  getHomeworkSubmissions,
  createHomeworkSubmission,
  askHomeworkAssistant,
  updateHomeworkSubmission
} from "../controller/homeworkController.js";

// Matches the pattern already used for commonRoute(s3, ...) and onScreenRoute(s3)
// in index.js, so the shared S3 client gets passed in from there.
export default function homeworkRoute(s3) {
  const router = express.Router();

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "edupros", // same bucket your other uploads use — swap to an env var later if you want
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const fileKey = `homework/${Date.now()}-${file.originalname}`;
        console.log("Generated S3 file key:", fileKey);
        cb(null, fileKey);
      },
    }),
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB
    },
  });

  router.get("/submissions", authenticateUser, getHomeworkSubmissions);

  router.post(
    "/submissions",
    authenticateUser,
    upload.single("attachment"),
    createHomeworkSubmission
  );

  router.post("/assistant", authenticateUser, askHomeworkAssistant);
router.patch("/submissions/:id", authenticateUser, updateHomeworkSubmission);  // ← this route
  return router;
}