import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { Video, VideoSchema } from '@/features/video/schemas/video'

export const GetVideoDetailsResponseSchema = z.object({
  message: z.string(),
  data: VideoSchema,
})
export const useVideoDetail = (videoId: string | undefined) => {
  return useQuery<Video, Error>({
    queryKey: ['video', videoId],
    queryFn: () =>
      api
        .GET(GetVideoDetailsResponseSchema, `/video/${videoId}`)
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!videoId,
  })
}
