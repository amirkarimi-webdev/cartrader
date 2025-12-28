// server/api/car/[userId].get.ts

import { prisma } from '~/server/utils/prisma';
import { getRouterParams } from 'h3';
import type { H3Event } from 'h3';

// نوع بازگشتی (اختیاری اما خیلی توصیه می‌شود)
type CarListItem = {
  id: number;
  name: string;
  image: string;
  price: number;
};

export default defineEventHandler(async (event: H3Event): Promise<CarListItem[]> => {
  const { userId } = getRouterParams(event) as { userId: string };

  // اعتبارسنجی ساده برای userId
  if (!userId || typeof userId !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'شناسه کاربر نامعتبر است',
    });
  }

  try {
    const cars = await prisma.car.findMany({
      where: {
        listerId: userId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
      },
      // مرتب‌سازی اختیاری: جدیدترین‌ها اول
      orderBy: {
        id: 'desc',
      },
      // محدودیت تعداد (پیشگیری از بار زیاد)
      take: 50,
    });

    return cars;
  } catch (error) {
    console.error('Error fetching cars for user:', error);
    throw createError({
      statusCode: 500,
      message: 'خطا در دریافت آگهی‌های کاربر',
    });
  }
});