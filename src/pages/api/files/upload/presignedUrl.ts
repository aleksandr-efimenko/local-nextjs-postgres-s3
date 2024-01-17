import type { NextApiRequest, NextApiResponse } from "next";
import type { ShortFileProp, PresignedUrlProp } from "~/utils/types";
import { createPresignedUrlToUpload } from "~/utils/s3-file-management";
import { env } from "~/env";
import { nanoid } from "nanoid";

const bucketName = env.S3_BUCKET_NAME;
const expiry = 60 * 60; // 24 hours

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST requests are allowed" });
    return;
  }
  // get the files from the request body
  const files = req.body as ShortFileProp[];

  if (!files?.length) {
    res.status(400).json({ message: "No files to upload" });
    return;
  }

  const presignedUrls = [] as PresignedUrlProp[];

  if (files?.length) {
    // use Promise.all to get all the presigned urls in parallel
    await Promise.all(
      // loop through the files
      files.map(async (file) => {
        const fileName = `${nanoid(5)}-${file?.originalFileName}`;

        // get presigned url using s3 sdk
        const url = await createPresignedUrlToUpload({
          bucketName,
          fileName,
          expiry,
        });
        // add presigned url to the list
        presignedUrls.push({
          fileNameInBucket: fileName,
          originalFileName: file.originalFileName,
          fileSize: file.fileSize,
          url,
        });
      }),
    );
  }

  res.status(200).json(presignedUrls);
}
