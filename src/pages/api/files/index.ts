import type { NextApiRequest, NextApiResponse } from "next";
import type { FileProps } from "~/utils/types";
import { db } from "~/server/db";

const LIMIT_FILES = 10;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get 10 latest files from the database
  // For simplicity, we are not using pagination
  // If you want to implement pagination, you can use skip and take
  // https://www.prisma.io/docs/concepts/components/prisma-client/pagination#skip-and-take

  const files = await db.file.findMany({
    take: LIMIT_FILES,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalName: true,
      size: true,
    },
  });
  // The database type is a bit different from the frontend type
  // Make the array of files compatible with the frontend type FileProps
  const filesWithProps: FileProps[] = files.map((file) => ({
    id: file.id,
    originalFileName: file.originalName,
    fileSize: file.size,
  }));

  return res.status(200).json(filesWithProps);
};

export default handler;
