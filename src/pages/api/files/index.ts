import type { NextApiRequest, NextApiResponse } from "next";
import type { FileProps } from "~/utils/types";
import { db } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = await db.file.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalName: true,
      size: true,
    },
  });

  const filesWithProps: FileProps[] = files.map((file) => ({
    id: file.id,
    originalFileName: file.originalName,
    fileSize: file.size,
  }));

  return res.status(200).json(filesWithProps);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
