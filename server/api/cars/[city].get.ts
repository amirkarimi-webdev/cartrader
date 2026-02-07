
// server/api/cars.get.ts
import { prisma } from '~/server/utils/prisma';
import { getRouterParams, getQuery } from 'h3';
import type { H3Event } from 'h3';

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
};

export default defineEventHandler(async (event: H3Event): Promise<CarListItem[]> => {
  const { city } = getRouterParams(event) as { city: string };

  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    throw createError({
      statusCode: 400,
      message: 'نام شهر نامعتبر است (حداقل ۲ کاراکتر)',
    });
  }

  const normalizedCity = city.toLowerCase().trim();

  const query = getQuery(event);

  const make = typeof query.make === 'string' ? query.make.toLowerCase().trim() : undefined;
  const minPriceStr = typeof query.minPrice === 'string' ? query.minPrice.trim() : undefined;
  const maxPriceStr = typeof query.maxPrice === 'string' ? query.maxPrice.trim() : undefined;

  const minPrice = minPriceStr ? Number(minPriceStr) : undefined;
  const maxPrice = maxPriceStr ? Number(maxPriceStr) : undefined;

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
      take: 50, 
    });


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