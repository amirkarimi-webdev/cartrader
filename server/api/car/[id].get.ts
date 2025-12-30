// server/api/car/[id].get.ts
import { prisma } from "~/server/utils/prisma";
import { getRouterParams, H3Event } from "h3";


export default defineEventHandler(
  async (event: H3Event) => {
    const { id } = getRouterParams(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Car ID is required",
      });
    }

    const carId = parseInt(id, 10);

    if (isNaN(carId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid car ID",
      });
    }

    const car = await prisma.car.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!car) {
      throw createError({
        statusCode: 404,
        statusMessage: `Car with ID ${carId} does not exist`,
      });
    }
    return car;
  }
);
