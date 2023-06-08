import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { ChannelSchema } from '@/features/channel/schemas/channel'

export const CreateChannelResponseSchema = z.object({
  message: z.string(),
  data: ChannelSchema,
})
export type CreateChannelResponse = z.infer<typeof CreateChannelResponseSchema>

export const useCreateChannel = () => {
  return useMutation<CreateChannelResponse, Error, FormData>({
    mutationFn: data =>
      api
        .POST(CreateChannelResponseSchema, '/channel', { data })
        .catch(parseAndThrowErrorResponse),
  })
}
