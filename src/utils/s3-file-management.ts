import * as Minio from "minio";
import type internal from "stream";
import { env } from "~/env.js";

export const s3Client = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: env.S3_PORT ? Number(env.S3_PORT) : undefined,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  useSSL: env.S3_USE_SSL === "true",
});

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await s3Client.bucketExists(bucketName);
  if (!bucketExists) {
    await s3Client.makeBucket(bucketName);
  }
}

export async function saveFileInBucket({
  bucketName,
  fileName,
  file,
}: {
  bucketName: string;
  fileName: string;
  file: Buffer | internal.Readable;
}) {
  // Create bucket if it doesn't exist
  await createBucketIfNotExists(bucketName);

  // check if file exists
  const fileExists = await checkFileExistsInBucket({
    bucketName,
    fileName,
  });

  if (fileExists) {
    throw new Error("File already exists");
  }

  // Upload image to S3 bucket
  await s3Client.putObject(bucketName, fileName, file);
}

export async function checkFileExistsInBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3Client.statObject(bucketName, fileName);
  } catch (error) {
    return false;
  }
  return true;
}

export async function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3Client.statObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
    return null;
  }
  return await s3Client.getObject(bucketName, fileName);
}

export async function deleteFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3Client.removeObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function createPresignedUrlToUpload({
  bucketName,
  fileName,
  expiry = 60 * 60, // 1 hour
}: {
  bucketName: string;
  fileName: string;
  expiry?: number;
}) {
  // Create bucket if it doesn't exist
  await createBucketIfNotExists(bucketName);

  return await s3Client.presignedPutObject(bucketName, fileName, expiry);
}

export async function createPresignedUrlToDownload({
  bucketName,
  fileName,
  expiry = 60 * 60, // 1 hour
}: {
  bucketName: string;
  fileName: string;
  expiry?: number;
}) {
  return await s3Client.presignedGetObject(bucketName, fileName, expiry);
}
