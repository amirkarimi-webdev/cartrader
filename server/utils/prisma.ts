// server/utils/prisma.ts

import { PrismaClient } from '@prisma/client'


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