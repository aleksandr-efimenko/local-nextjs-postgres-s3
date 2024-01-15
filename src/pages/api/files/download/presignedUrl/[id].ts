import type { NextApiRequest, NextApiResponse } from "next";
import { createPresignedUrlToDownload } from "~/utils/s3-file-management";
import { db } from "~/server/db";
import { env } from "~/env";

/**
 * This route is used to get presigned url for downloading file from S3
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Only GET requests are allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Missing or invalid id" });
  }

  // Get the file name in bucket from the database
  const fileObject = await db.file.findUnique({
    where: {
      id,
    },
    select: {
      fileName: true,
    },
  });

  if (!fileObject) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Get presigned url from s3 storage
  const presignedUrl = await createPresignedUrlToDownload({
    bucketName: env.S3_BUCKET_NAME,
    fileName: fileObject?.fileName,
  });

  res.status(200).json(presignedUrl);
}
