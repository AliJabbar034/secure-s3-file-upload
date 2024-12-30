import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const storageConfig = {
  local: {
    destination: "./uploads",
  },
  s3: {
    bucket: process.env.AWS_BUCKET_NAME || "",
    s3Instance: s3,
  },
};
