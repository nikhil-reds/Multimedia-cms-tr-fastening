import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
  prisma?: InstanceType<typeof PrismaClient>
  prismaSchemaVersion?: string
}

const PRISMA_SCHEMA_VERSION = '20261001120000_add_auth'

if (
  globalForPrisma.prisma &&
  globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
) {
  // Force a fresh client after schema changes during Next.js dev hot reload.
  delete (globalForPrisma as any).prisma
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION
}
