import type { NextApiRequest, NextApiResponse } from "next";
import { deleteFileFromBucket } from "~/utils/s3-file-management";
import { db } from "~/server/db";
import { env } from "~/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

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

    await deleteFileFromBucket({
      bucketName: env.S3_BUCKET_NAME,
      fileName: fileObject?.fileName,
    });

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
  } else {
    res.status(405).json({ message: "Only DELETE requests are allowed" });
  }
}
