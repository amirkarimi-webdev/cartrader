// server/utils/prisma.ts

import { PrismaClient } from '@prisma/client'

/**
 * Singleton PrismaClient برای جلوگیری از چندین instance در hot-reload (dev)
 * و مدیریت بهتر connectionها در production
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  })
}

type PrismaSingleton = ReturnType<typeof prismaClientSingleton>
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }