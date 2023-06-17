import type { User } from '@prisma/client'
import type { Request } from 'express'

import { ACCESS_TOKEN_NAME } from '../constants/strings.js'
import { verifyJwt } from '../lib/jsonwebtoken.js'
import { db } from '../lib/prisma.js'

export const getMaybeUser = async (req: Request): Promise<User | undefined> => {
  try {
    const accessToken = req.cookies?.[ACCESS_TOKEN_NAME] as string | undefined
    if (!accessToken) return undefined
    const { id } = await verifyJwt<{ id: string }>(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    )
    const user = await db.user.findUnique({
      where: {
        id,
      },
    })
    return user ?? undefined
  } catch (error) {
    return undefined
  }
}
