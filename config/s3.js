// import { S3Client } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export default s3;
import "dotenv/config";

import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/*
|--------------------------------------------------------------------------
| Delete file from S3
|--------------------------------------------------------------------------
*/
export const deleteFromS3 = async (key) => {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: "edupros",
    Key: key,
  });

  await s3.send(command);
};

/*
|--------------------------------------------------------------------------
| Generate private signed URL
|--------------------------------------------------------------------------
*/
export const getS3SignedUrl = async (key) => {
  if (!key) return null;

  const command = new GetObjectCommand({
    Bucket: "edupros",
    Key: key,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 60 * 15,
  });
};

export default s3;
