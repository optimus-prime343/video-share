import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'

export const LogoutResponseSchema = z.object({
  message: z.string(),
})
export const useLogout = () => {
  return useMutation<string, Error, undefined>({
    mutationFn: () => api.GET(LogoutResponseSchema, '/auth/logout').then(res => res.message),
  })
}
