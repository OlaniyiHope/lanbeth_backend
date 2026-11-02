import "dotenv/config";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(null, true);
  }

  cb(new Error("Unsupported file type. Allowed: PDF, JPG, PNG, WEBP, DOC, DOCX"), false);
};
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function multerS3NoAcl(options) {
  const storage = multerS3(options);

  const origGetS3Params = storage.getS3Params;

  storage.getS3Params = (file, cb) => {
    origGetS3Params.call(storage, file, (err, params) => {
      if (params?.ACL) {
        delete params.ACL;
      }

      cb(err, params);
    });
  };

  return storage;
}

// const uploadStaffDocumentFile = multer({
//   storage: multerS3NoAcl({
//     s3,
//     bucket: "edupros",

//     contentType: multerS3.AUTO_CONTENT_TYPE,

//     key: (req, file, cb) => {
//       const cleanName = file.originalname
//         .replace(/\s+/g, "-")
//         .replace(/[^a-zA-Z0-9.-]/g, "");

//       const fileKey =
//         `staff-documents/${req.user._id}/${Date.now()}-${cleanName}`;

//       cb(null, fileKey);
//     },
//   }),

//   limits: {
//     fileSize: 10 * 1024 * 1024,
//   },

//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype !== "application/pdf" &&
//       !file.originalname.toLowerCase().endsWith(".pdf")
//     ) {
//       return cb(new Error("Only PDF documents are allowed"));
//     }

//     cb(null, true);
//   },
// });

const uploadStaffDocumentFile = multer({
  storage: multerS3NoAcl({
    s3,
    bucket: "edupros",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const cleanName = file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      const fileKey = `staff-documents/${req.user._id}/${Date.now()}-${cleanName}`;

      cb(null, fileKey);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter, // the allowlist defined above
});

export default uploadStaffDocumentFile;
