import { createPresignedUrl } from "~/utils/s3-file-management";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";
import { IncomingForm, type File } from "formidable";
import { setErrorStatus } from "./smallFiles";
import { nanoid } from "nanoid";

type ProcessedFiles = Array<[string, File]>;
export type PresignedUrlProp = {
  url: string;
  originalFileName: string;
  fileNameInBucket: string;
  fileSize: number;
};

const bucketName = env.S3_BUCKET_NAME;
const expiry = 60 * 60 * 24; // 24 hours

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = 200,
    resultBody = { status: "ok", message: "Files were uploaded successfully" };

  const presignedUrls = [] as PresignedUrlProp[];

  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new IncomingForm();
      const files: ProcessedFiles = [];
      form.on("file", function (field, file) {
        files.push([field, file]);
      });
      form.on("end", () => resolve(files));
      form.on("error", (err) => reject(err));
      form.parse(req, () => {
        //
      });
    },
  ).catch(() => {
    ({ status, resultBody } = setErrorStatus(status, resultBody));
    return undefined;
  });

  if (files?.length) {
    try {
      await Promise.all(
        files.map(async ([_, fileObject]) => {
          const fileName = `${nanoid(5)}-${fileObject?.originalFilename}`;

          const url = await createPresignedUrl({
            bucketName,
            fileName,
            expiry,
          });
          presignedUrls.push({
            fileNameInBucket: fileName,
            originalFileName: fileObject?.originalFilename ?? fileName,
            fileSize: fileObject?.size ?? 0,
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
