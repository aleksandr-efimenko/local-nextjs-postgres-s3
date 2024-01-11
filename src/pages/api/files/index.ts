import type { NextApiRequest, NextApiResponse } from "next";
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

  return res.status(200).json(files);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
