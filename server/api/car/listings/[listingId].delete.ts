// server/api/car/[userId].delete.ts

import { prisma } from "~/server/utils/prisma";
import { getRouterParams } from "h3";
import type { H3Event } from "h3";

type DeleteResponse = {
  success: boolean;
  deleteId: number;
};

export default defineEventHandler(
  async (event: H3Event): Promise<DeleteResponse> => {
    const { listingId } = getRouterParams(event) as { listingId: string };

    if (!listingId || isNaN(Number(listingId))) {
      throw createError({
        statusCode: 400,
        message: "شناسه آگهی نامعتبر است",
      });
    }

    const id = Number(listingId);

    try {
      const deleteCar = await prisma.car.delete({
        where: {
          id,
        },
      });
      return {
        success: true,
        deleteId: deleteCar.id,
      };
    } catch (error: any) {
      console.error("خطا در حذف آگهی:", error);

      // مدیریت خطاهای رایج Prisma
      if (error.code === "P2025") {
        throw createError({
          statusCode: 404,
          message: "آگهی پیدا نشد",
        });
      }

      throw createError({
        statusCode: 500,
        message: "خطا در حذف آگهی",
      });
    }
  }
);
