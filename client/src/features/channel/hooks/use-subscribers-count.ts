import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const GetSubscribersCountResponseSchema = z.object({
  data: z.object({
    subscribers: z.number().min(0),
  }),
})

export const useSubscribersCount = (channelId: string | undefined) => {
  return useQuery<number, Error>({
    queryKey: ['subscribers-count', channelId],
    queryFn: () =>
      api
        .GET(GetSubscribersCountResponseSchema, `/channel/subscribers/${channelId}`)
        .then(data => data.data.subscribers)
        .catch(parseAndThrowErrorResponse),
    enabled: !!channelId,
  })
}
