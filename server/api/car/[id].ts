// server/api/car/[id].ts
import cars from "@/data/cars.json";
import { getRouterParams } from "h3";
import type { Car, Cars } from "~/types/car";

export default defineEventHandler((event) => {
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

  const car = (cars as Car[]).find((c) => c.id === carId);

  if (!car) {
    throw createError({
      statusCode: 404,
      statusMessage: `Car with ID ${carId} does not exist`,
    });
  }
  return car;
});
