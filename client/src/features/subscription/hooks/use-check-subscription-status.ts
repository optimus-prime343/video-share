import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const CheckSubscriptionsStatusResponseSchema = z.object({
  data: z.object({
    status: z.enum(['subscribed', 'not-subscribed']),
  }),
})
export type CheckSubscriptionsStatusResponse = z.infer<
  typeof CheckSubscriptionsStatusResponseSchema
>['data']

export const useCheckSubscriptionStatus = (channelId: string | undefined) => {
  return useQuery<CheckSubscriptionsStatusResponse, Error>({
    queryKey: ['subscription', 'status', channelId],
    queryFn: () =>
      api
        .GET(CheckSubscriptionsStatusResponseSchema, `/subscription/status/${channelId}`)
        .then(data => data.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!channelId,
  })
}
