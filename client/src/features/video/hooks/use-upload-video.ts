import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { Video, VideoSchema } from '@/features/video/schemas/video'

export const UploadVideoResponseSchema = z.object({
  message: z.string(),
  data: VideoSchema,
})
export type UploadVideoResponse = z.infer<typeof UploadVideoResponseSchema>

export const useUploadVideo = () => {
  return useMutation<Video, Error, FormData>({
    mutationFn: data =>
      api
        .POST(UploadVideoResponseSchema, '/video', { data })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
  })
}
