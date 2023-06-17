import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { useUser } from '@/features/auth/hooks/use-user'

export const VideoLikedDislikedResponseSchema = z.object({
  data: z.object({
    isLiked: z.boolean(),
    isDisliked: z.boolean(),
  }),
})
export type VideoLikedDislikedResponse = z.infer<
  typeof VideoLikedDislikedResponseSchema
>['data']

export const useVideoLikedDislikedStatus = (videoId: string | undefined) => {
  const { data: user } = useUser()
  return useQuery<VideoLikedDislikedResponse, Error>({
    queryKey: ['video-liked-disliked-status', videoId, user?.id],
    queryFn: () =>
      api
        .GET(VideoLikedDislikedResponseSchema, '/video/liked-disliked-status', {
          params: { videoId },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!(user && videoId),
  })
}
