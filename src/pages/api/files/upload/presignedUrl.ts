import type { NextApiRequest, NextApiResponse } from "next";
import type { ShortFileProp, PresignedUrlProp } from "~/utils/types";
import { createPresignedUrl } from "~/utils/s3-file-management";
import { env } from "~/env";
import { setErrorStatus } from "./smallFiles";
import { nanoid } from "nanoid";

const bucketName = env.S3_BUCKET_NAME;
const expiry = 60 * 60 * 24; // 24 hours

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST requests are allowed" });
    return;
  }
  let status = 200,
    resultBody = { status: "ok", message: "Files were uploaded successfully" };

  const files = JSON.parse(req.body as string) as ShortFileProp[];

  const presignedUrls = [] as PresignedUrlProp[];

  if (files?.length) {
    try {
      await Promise.all(
        files.map(async (file) => {
          const fileName = `${nanoid(5)}-${file?.originalFileName}`;

          // get presigned url using s3 sdk
          const url = await createPresignedUrl({
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
    } catch (e) {
      console.error(e);
      ({ status, resultBody } = setErrorStatus(status, resultBody));
    }
  }

  res.status(200).json(presignedUrls);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
