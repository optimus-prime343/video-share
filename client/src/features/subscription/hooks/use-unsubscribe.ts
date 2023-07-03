import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'

export const UnsubscribeResponseSchema = z.object({
  message: z.string(),
})
export type UnsubscribeResponse = z.infer<typeof UnsubscribeResponseSchema>

export const useUnsubscribe = () => {
  return useMutation<UnsubscribeResponse, Error, string>({
    mutationFn: channelId =>
      api.DELETE(UnsubscribeResponseSchema, `/subscription/unsubscribe/${channelId}`),
  })
}
