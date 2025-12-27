// prisma.config.ts (در ریشه پروژه)
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DIRECT_URL'),  // CLI از این استفاده می‌کنه (اتصال مستقیم)
  },
})