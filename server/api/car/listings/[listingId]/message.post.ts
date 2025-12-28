import { prisma } from "~/server/utils/prisma";
import { getRouterParams } from "h3";
import { H3Event } from "h3";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "نام الزامی است",
    "string.min": "نام حداقل ۲ کاراکتر باشد",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ir"] } })
    .required()
    .messages({ "string.email": "ایمیل معتبر نیست" }),
  phone: Joi.string()
    .pattern(/^09[0-9]{9}$/)
    .required()
    .messages({
      "string.pattern.base": "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقمی باشد",
    }),
  message: Joi.string().trim().min(10).max(1000).required().messages({
    "string.min": "پیام حداقل ۱۰ کاراکتر باشد",
    "any.required": "متن پیام الزامی است",
  }),
}).options({ abortEarly: false, stripUnknown: true });

export default defineEventHandler(async (event: H3Event) => {
  const { listingId } = getRouterParams(event) as { listingId: string };

  const id = Number(listingId);

  const body = await readBody(event);
  const { error, value } = schema.validate(body);
  if (error) {
    throw createError({
      statusCode: 400,
      data: { errors: error.details.map((e) => e.message) },
    });
  }

  const { name, email, phone, message: msgText } = value;

  try {
    const carExists = await prisma.car.count({
      where: { id },
    });

    if (carExists === 0) {
      throw createError({
        statusCode: 404,
        message: "آگهی مورد نظر پیدا نشد",
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        message: msgText, // ← اینجا از value.message استفاده شده
        listingID: id,
      },
    });
    return {
      success: true,
      message: "پیام با موفقیت ارسال شد",
      data: { id: newMessage.id, message: newMessage.message },
    };
  } catch (err: any) {
    console.error("خطا در ارسال پیام:", err);

    if (err.code === "P2025") {
      throw createError({ statusCode: 404, message: "آگهی پیدا نشد" });
    }

    throw createError({
      statusCode: 500,
      message: "خطا در ارسال پیام",
    });
  }
});
