import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const UpdateChannelResponseSchema = z.object({
  message: z.string(),
})
export interface UpdateChannelRequest {
  id: string
  formData: FormData
}
export const useUpdateChannel = () => {
  return useMutation<string, Error, UpdateChannelRequest>({
    mutationFn: ({ id, formData }) =>
      api
        .PATCH(UpdateChannelResponseSchema, `/channel/${id}`, { data: formData })
        .then(res => res.message)
        .catch(parseAndThrowErrorResponse),
  })
}
