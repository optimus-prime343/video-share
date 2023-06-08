import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { useUser } from '@/features/auth/hooks/use-user'
import { Channel, ChannelSchema } from '@/features/channel/schemas/channel'

export const GetUserChannelResponseSchema = z.object({
  message: z.string(),
  data: ChannelSchema.nullable(),
})

export const useUserChannel = () => {
  const { data: user } = useUser()
  return useQuery<Channel | null, Error>({
    queryKey: ['user-channel', user?.id],
    queryFn: () =>
      api
        .GET(GetUserChannelResponseSchema, '/channel/get-user-channel', {
          params: { userId: user?.id },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!user,
  })
}
