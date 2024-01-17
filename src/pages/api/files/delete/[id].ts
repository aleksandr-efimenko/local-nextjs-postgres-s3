import type { NextApiRequest, NextApiResponse } from "next";
import { deleteFileFromBucket } from "~/utils/s3-file-management";
import { db } from "~/server/db";
import { env } from "~/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Only DELETE requests are allowed" });
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
  // Delete the file from the bucket
  await deleteFileFromBucket({
    bucketName: env.S3_BUCKET_NAME,
    fileName: fileObject?.fileName,
  });
  // Delete the file from the database
  const deletedItem = await db.file.delete({
    where: {
      id,
    },
  });

  if (deletedItem) {
    res.status(200).json({ message: "Item deleted successfully" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
}
