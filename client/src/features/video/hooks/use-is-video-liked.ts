import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { useUser } from '@/features/auth/hooks/use-user'

export const IsVideoLikedResponseSchema = z.object({
  data: z.object({
    isLiked: z.boolean(),
  }),
})

export const useIsVideoLiked = (videoId: string | undefined) => {
  const { data: user } = useUser()
  return useQuery<boolean, Error>({
    queryKey: ['is-video-liked', videoId, user?.id],
    queryFn: () =>
      api
        .GET(IsVideoLikedResponseSchema, '/video/is-video-liked', { params: { videoId } })
        .then(res => res.data.isLiked),
    enabled: !!(videoId && user),
  })
}
