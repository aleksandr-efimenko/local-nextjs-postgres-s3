import { db } from "~/server/db";

const handler = async (req, res) => {
  const files = await db.file.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalName: true,
      size: true,
    },
  });

  res.status(200).json(files);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
