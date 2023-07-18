import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { useUser } from '@/features/auth/hooks/use-user'

export const CheckSubscriptionsStatusResponseSchema = z.object({
  data: z.object({
    status: z.enum(['subscribed', 'not-subscribed']),
  }),
})
export type CheckSubscriptionsStatusResponse = z.infer<
  typeof CheckSubscriptionsStatusResponseSchema
>['data']

export const useCheckSubscriptionStatus = (channelId: string | undefined) => {
  const { data: user } = useUser()
  return useQuery<CheckSubscriptionsStatusResponse, Error>({
    queryKey: ['subscription', 'status', channelId, user?.id],
    queryFn: () =>
      api
        .GET(CheckSubscriptionsStatusResponseSchema, `/subscription/status/${channelId}`)
        .then(data => data.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!(channelId && user?.id),
  })
}
