import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { useUser } from '@/features/auth/hooks/use-user'

export const IsVideoDislikedResponseSchema = z.object({
  data: z.object({
    isDisliked: z.boolean(),
  }),
})

export const useIsVideoDisliked = (videoId: string | undefined) => {
  const { data: user } = useUser()
  return useQuery<boolean, Error>({
    queryKey: ['is-video-disliked', videoId, user?.id],
    queryFn: () =>
      api
        .GET(IsVideoDislikedResponseSchema, '/video/is-video-disliked', {
          params: { videoId },
        })
        .then(res => res.data.isDisliked),
    enabled: !!(videoId && user),
  })
}
