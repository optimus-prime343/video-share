import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const LikeVideoResponseSchema = z.object({
  message: z.string(),
})
export const useLikeVideo = () => {
  return useMutation<string, Error, string>({
    mutationFn: videoId =>
      api
        .POST(LikeVideoResponseSchema, `/video/like-video`, { params: { videoId } })
        .then(res => res.message)
        .catch(parseAndThrowErrorResponse),
  })
}
