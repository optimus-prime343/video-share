import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined
}

const db = global.db ?? new PrismaClient()

if (process.env.NODE_ENV === 'development') global.db = db

export { db }
