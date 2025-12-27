// import cars from "@/data/cars.json";
// import type { Cars, Car } from "~/types/car";

// export default defineEventHandler((event) => {
//   const { city } = getRouterParams(event);

//   const query = getQuery(event);
//   const make = typeof query.make === "string" ? query.make : undefined;
//   const minPriceStr =
//     typeof query.minPrice === "string" ? query.minPrice : undefined;
//   const maxPriceStr =
//     typeof query.maxPrice === "string" ? query.maxPrice : undefined;

//   const minPrice = minPriceStr ? parseInt(minPriceStr, 10) : undefined;
//   const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;

//   if ((minPriceStr && isNaN(minPrice!)) || (maxPriceStr && isNaN(maxPrice!))) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: "minPrice and maxPrice must be valid numbers",
//     });
//   }

//   const typedCars: Cars = cars as Cars;

//   let filteredCars = typedCars.filter(
//     (car) => car.city.toLowerCase() === city.toLowerCase()
//   );

//   if (make) {
//     filteredCars = typedCars.filter(
//       (car) => car.make.toLowerCase() === make.toLowerCase()
//     );
//   }

//   if (minPrice !== undefined) {
//     filteredCars = typedCars.filter((car) => car.price >= minPrice);
//   }

//   if (maxPrice !== undefined) {
//     filteredCars = typedCars.filter((car) => car.price <= maxPrice);
//   }
//   if (filteredCars.length === 0) {
//     throw createError({
//       statusCode: 404,
//       statusMessage: `No cars found in ${city}`,
//     });
//   }

//   return filteredCars;
// });


// server/api/cars/[city]/car.ts  (یا هر نامی که روت درست بشه)
import cars from "@/data/cars.json";
import { getRouterParams, getQuery } from 'h3';
import type { Car, Cars } from "~/types/car";

export default defineEventHandler((event) => {
  // گرفتن city از روت
  const { city } = getRouterParams(event);

  if (!city) {
    throw createError({
      statusCode: 400,
      statusMessage: "City parameter is required",
    });
  }

  // گرفتن query params
  const query = getQuery(event);

  const make = typeof query.make === "string" ? query.make.toLowerCase() : undefined;
  const minPriceStr = typeof query.minPrice === "string" ? query.minPrice : undefined;
  const maxPriceStr = typeof query.maxPrice === "string" ? query.maxPrice : undefined;

  const minPrice = minPriceStr ? parseInt(minPriceStr, 10) : undefined;
  const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;

  // چک اعتبار عدد
  if ((minPriceStr && isNaN(minPrice!)) || (maxPriceStr && isNaN(maxPrice!))) {
    throw createError({
      statusCode: 400,
      statusMessage: "minPrice and maxPrice must be valid numbers",
    });
  }

  const typedCars: Cars = cars as Cars;

  // فیلتر زنجیره‌ای درست (chain filtering)
  let filteredCars = typedCars.filter((car) =>
    car.city.toLowerCase() === city.toLowerCase()
  );

  // فیلتر make — روی نتیجه قبلی
  if (make) {
    filteredCars = filteredCars.filter((car) =>
      car.make.toLowerCase() === make
    );
  }

  // فیلتر قیمت — روی نتیجه قبلی
  if (minPrice !== undefined) {
    filteredCars = filteredCars.filter((car) => car.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filteredCars = filteredCars.filter((car) => car.price <= maxPrice);
  }

  // اگه هیچی پیدا نشد
  if (filteredCars.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `No cars found matching the criteria in ${city}`,
    });
  }

  return filteredCars;
});