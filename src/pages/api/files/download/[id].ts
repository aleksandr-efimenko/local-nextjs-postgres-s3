import { type NextApiRequest, type NextApiResponse } from "next";
import { getFileFromBucket } from "~/utils/s3-file-management";
import { env } from "~/env";
import { db } from "~/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string")
    return res.status(400).json({ message: "Invalid request" });

  const fileObject = await db.file.findUnique({
    where: {
      id,
    },
    select: {
      fileName: true,
      originalName: true,
    },
  });
  if (!fileObject) {
    return res.status(404).json({ message: "Item not found" });
  }

  const data = await getFileFromBucket({
    bucketName: env.S3_BUCKET_NAME,
    fileName: fileObject?.fileName,
  });

  if (!data) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.setHeader(
    "content-disposition",
    `attachment; filename="${fileObject?.originalName}"`,
  );

  // pipe the data to the res object
  data.pipe(res);
}

export default handler;
