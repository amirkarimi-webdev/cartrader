import { prisma } from "~/server/utils/prisma";
import { getRouterParams } from "h3";
import { H3Event } from "h3";

type messageItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default defineEventHandler(
  async (event: H3Event): Promise<messageItem[]> => {
    const { listingId } = getRouterParams(event) as { listingId: string };

    if (!listingId || isNaN(Number(listingId)) || Number(listingId) <= 0) {
      throw createError({
        statusCode: 400,
        message: "شناسه آگهی نامعتبر است  (باید عدد مثبت باشد)",
      });
    }
    const id = Number(listingId);

    try {
      const message = await prisma.message.findMany({
        where: {
          listingID: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
        },
        orderBy: {
          id: "desc",
        },
        take: 50,
      });

      return message;
    } catch (error: any) {
      console.log("خطا در دیافت پیام ها", error);

      if (error.code === "P2025") {
        throw createError({
          statusCode: 404,
          message: "آگهی یا پیام‌ها پیدا نشدند",
        });
      }

      throw createError({
        statusCode: 500,
        message: "خطا در دریافت پیام‌ها",
      });
    }
  }
);
