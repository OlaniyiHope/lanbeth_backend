import "dotenv/config";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Same ACL workaround as uploadClientDocument.js
function multerS3NoAcl(options) {
  const storage = multerS3(options);
  const origGetS3Params = storage.getS3Params;

  storage.getS3Params = (file, cb) => {
    origGetS3Params.call(storage, file, (err, params) => {
      if (params?.ACL) delete params.ACL;
      cb(err, params);
    });
  };

  return storage;
}

const uploadReportDocument = multer({
  storage: multerS3NoAcl({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const clientId = req.params.id || "unknown";
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `reports/${clientId}/${Date.now()}-${safeName}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === "application/pdf" || file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Only PDF or image files are allowed"), ok);
  },
});

export default uploadReportDocument;