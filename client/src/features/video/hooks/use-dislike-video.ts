import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'

export const DislikeVideoResponseSchema = z.object({
  message: z.string(),
})

export const useDislikeVideo = () => {
  return useMutation<string, Error, string>({
    mutationFn: videoId =>
      api
        .POST(DislikeVideoResponseSchema, `/video/dislike-video`, { params: { videoId } })
        .then(res => res.message),
  })
}
