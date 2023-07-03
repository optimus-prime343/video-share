import { z } from 'zod'

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  channelId: z.string().uuid(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).optional(),
})
