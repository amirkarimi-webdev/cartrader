import { prisma } from "~/server/utils/prisma";
import { getRouterParams } from "h3";

export default defineEventHandler(async (event) => {
  const { userId } = getRouterParams(event);

  return prisma.car.findMany({
    where: {
      listerId: userId,
    },
    select: {
      image: true,
      id: true,
      name: true,
      price: true,
    },
  });
});
