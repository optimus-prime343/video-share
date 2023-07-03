import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

import { SubscriptionSchema } from '../schemas/subscription'

export const SubscribeResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    subscription: SubscriptionSchema,
  }),
})
export type SubscribeResponse = z.infer<typeof SubscribeResponseSchema>

export const useSubscribe = () => {
  return useMutation<SubscribeResponse, Error, string>({
    mutationFn: channelId =>
      api
        .POST(SubscribeResponseSchema, `/subscription/subscribe/${channelId}`)
        .catch(parseAndThrowErrorResponse),
  })
}
