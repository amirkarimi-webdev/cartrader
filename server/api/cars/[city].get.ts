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
// server/api/car/[city].get.ts

// server/api/cars.get.ts
import { prisma } from '~/server/utils/prisma';
import { getRouterParams, getQuery } from 'h3';
import type { H3Event } from 'h3';

// نوع بازگشتی برای خوانایی و تایپینگ بهتر
type CarListItem = {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  miles: number;
  price: number;
  image: string;
  city: string;
  // اگر فیلدهای بیشتری select کردی، اینجا اضافه کن
};

export default defineEventHandler(async (event: H3Event): Promise<CarListItem[]> => {
  // ۱. گرفتن شهر از path parameter (اجباری)
  const { city } = getRouterParams(event) as { city: string };

  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    throw createError({
      statusCode: 400,
      message: 'نام شهر نامعتبر است (حداقل ۲ کاراکتر)',
    });
  }

  const normalizedCity = city.toLowerCase().trim();

  // ۲. گرفتن فیلترهای اختیاری از query string
  const query = getQuery(event);

  const make = typeof query.make === 'string' ? query.make.toLowerCase().trim() : undefined;
  const minPriceStr = typeof query.minPrice === 'string' ? query.minPrice.trim() : undefined;
  const maxPriceStr = typeof query.maxPrice === 'string' ? query.maxPrice.trim() : undefined;

  const minPrice = minPriceStr ? Number(minPriceStr) : undefined;
  const maxPrice = maxPriceStr ? Number(maxPriceStr) : undefined;

  // ۳. اعتبارسنجی قیمت‌ها
  if ((minPriceStr && isNaN(minPrice!)) || (maxPriceStr && isNaN(maxPrice!))) {
    throw createError({
      statusCode: 400,
      message: 'مقادیر minPrice و maxPrice باید عدد معتبر باشند',
    });
  }

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw createError({
      statusCode: 400,
      message: 'حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد',
    });
  }

  try {
    const cars = await prisma.car.findMany({
      where: {
        city: normalizedCity, // شهر اجباری از path
        ...(make ? { make } : {}),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined ? { gte: minPrice } : {}),
                ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        make: true,
        model: true,
        year: true,
        miles: true,
        price: true,
        image: true,
        city: true,
      },
      orderBy: {
        id: 'desc', // جدیدترین آگهی‌ها اول
      },
      take: 50, // محدودیت برای عملکرد (می‌تونی بعداً pagination اضافه کنی)
    });

    // اگر هیچ آگهی‌ای نبود، 404 برگردون (کاربرپسند)
    if (cars.length === 0) {
      throw createError({
        statusCode: 404,
        message: `هیچ آگهی‌ای در شهر ${normalizedCity} با این فیلترها پیدا نشد`,
      });
    }

    return cars;
  } catch (error: any) {
    console.error('خطا در دریافت آگهی‌ها:', error);

    if (error.code === 'P1001') {
      throw createError({
        statusCode: 503,
        message: 'اتصال به دیتابیس برقرار نشد',
      });
    }

    throw createError({
      statusCode: 500,
      message: 'خطا در دریافت آگهی‌ها',
    });
  }
});