import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import type { Video } from '@/features/video/schemas/video'

export const UpdateVideoResponseSchema = z.object({
  message: z.string(),
})
export interface UpdateVideoRequest {
  id: string
  data: Partial<Video>
}
export const useAdminUpdateVideo = () => {
  return useMutation<string, Error, UpdateVideoRequest>({
    mutationFn: ({ id, data }) =>
      api
        .PATCH(UpdateVideoResponseSchema, `/admin/videos/${id}`, { data })
        .then(res => res.message)
        .catch(parseAndThrowErrorResponse),
  })
}
