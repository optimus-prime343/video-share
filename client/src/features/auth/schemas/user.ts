import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().nonempty(),
  email: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})

export type User = z.infer<typeof UserSchema>
