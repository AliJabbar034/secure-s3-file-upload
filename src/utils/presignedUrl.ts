// src/utils/presignedUrl.ts
import { storageConfig } from "../config/storage";

/**
 * Generates a presigned URL for downloading a file from S3.
 * @param key The key (path) of the file in the S3 bucket.
 * @param expiresInSeconds The time in seconds for which the URL is valid.
 * @returns The presigned URL as a string.
 */
export const getPresignedUrl = async (
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> => {
  if (!storageConfig.s3.bucket) {
    throw new Error("S3 bucket is not configured.");
  }

  const params: AWS.S3.GetObjectRequest = {
    Bucket: storageConfig.s3.bucket,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    storageConfig.s3.s3Instance.getSignedUrl(
      "getObject",
      params,

      (err, url) => {
        if (err) return reject(err);
        resolve(url);
      }
    );
  });
};
