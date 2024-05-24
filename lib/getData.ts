import db from "@/lib/db";

export const getAllAuctions = async () => {
  return await db.auction.findMany({
    include: {
      item: true,
      bids: true,
    },
  });
};

export const getDataBySlug = async (slug: string) => {
  return await db.auction.findFirst({
    where: {
      slug,
    },
    include: {
      item: true,
      bids: true,
    },
  });
};
