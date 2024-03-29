import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

import type { LoginFormData } from '../schemas/login'

const LoginResponseSchema = z.object({ message: z.string() })

type LoginResponse = z.infer<typeof LoginResponseSchema>

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: data =>
      api.POST(LoginResponseSchema, '/auth/login', { data }).catch(parseAndThrowErrorResponse),
  })
}
