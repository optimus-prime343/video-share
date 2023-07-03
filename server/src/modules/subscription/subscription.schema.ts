import { z } from 'zod'

export const GetSubscriptionsRequestSchema = z.object({
  query: z.object({
    page: z.number().int().positive().optional().default(1),
    perPage: z.number().int().positive().optional().default(10),
  }),
})
export const CheckSubscriptionStatusRequestSchema = z.object({
  params: z.object({
    channelId: z.string().uuid(),
  }),
})

export const SubscribeUnsubscribeRequestSchema = z.object({
  params: z.object({
    channelId: z.string().uuid(),
  }),
})

export type GetSubscriptionsRequest = z.infer<typeof GetSubscriptionsRequestSchema>
export type CheckSubscriptionStatusRequest = z.infer<
  typeof CheckSubscriptionStatusRequestSchema
>
export type SubscribeUnsubscribeRequest = z.infer<typeof SubscribeUnsubscribeRequestSchema>
