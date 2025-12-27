// server/api/car/index.post.js  (یا هر نامی که داری)

import Joi from "joi";

// import default برای حل ارور named export در Prisma ۵+ و ۷
import { prisma } from "~/server/utils/prisma";

// validation schema (بهبودیافته + پیام‌های فارسی)
const schema = Joi.object({
  make: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "برند خودرو الزامی است",
    "string.min": "برند باید حداقل ۲ کاراکتر باشد",
  }),
  model: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "مدل خودرو الزامی است",
  }),
  year: Joi.number()
    .integer()
    .min(1886)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      "any.required": "سال ساخت الزامی است",
    }),
  miles: Joi.number().integer().min(0).required().messages({
    "any.required": "کیلومتر الزامی است",
  }),
  city: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "شهر الزامی است",
  }),
  numberOfSeats: Joi.number().integer().min(1).max(100).required().messages({
    "any.required": "تعداد صندلی الزامی است",
  }),
  features: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required()
    .messages({
      "array.min": "حداقل یک ویژگی باید وارد شود",
      "any.required": "ویژگی‌ها الزامی است",
    }),
  description: Joi.string().trim().min(10).max(2000).required().messages({
    "any.required": "توضیحات الزامی است",
  }),
  image: Joi.string().uri().required().messages({
    "any.required": "آدرس تصویر الزامی است",
    "string.uri": "آدرس تصویر معتبر نیست",
  }),
  listerId: Joi.string().trim().required().messages({
    "any.required": "شناسه فروشنده الزامی است",
  }),
  price: Joi.number().min(0).precision(2).required().messages({
    "any.required": "قیمت الزامی است",
  }),
  name: Joi.string().trim().min(3).max(100).required().messages({
    "any.required": "نام آگهی الزامی است",
  }),
}).options({ abortEarly: false }); // همه خطاها رو نشون بده

export default defineEventHandler(async (event) => {
  // اختیاری: چک لاگین (اگر می‌خوای فقط کاربر لاگین‌شده آگهی بذاره)
  // const user = event.context.user || useSupabaseUser(event)
  // if (!user) throw createError({ statusCode: 401, message: 'لطفاً وارد شوید' })

  const body = await readBody(event);

  // validation
  const { error, value } = schema.validate(body);
  if (error) {
    const errors = error.details.map((err) => err.message);
    throw createError({
      statusCode: 400,
      statusMessage: "داده‌های ورودی نامعتبر",
      data: { errors },
    });
  }

  try {
    const car = await prisma.car.create({
      data: {
        make: value.make,
        model: value.model,
        year: value.year,
        miles: value.miles,
        city: value.city.toLowerCase().trim(),
        numberOfSeats: value.numberOfSeats,
        features: value.features,
        description: value.description,
        image: value.image,
        listerId: value.listerId,
        price: value.price,
        name: value.name,
      },
    });

    return { success: true, car };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "خطا در ذخیره آگهی",
    });
  }
});
