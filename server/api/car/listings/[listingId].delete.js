import { prisma } from "~/server/utils/prisma";
import { getRouterParams } from "h3";

export default defineEventHandler(async (event) => {
  const { listingId } = getRouterParams(event);

  return prisma.car.delete({
    where: {
      id: parseInt(listingId),
    },
  });
});
