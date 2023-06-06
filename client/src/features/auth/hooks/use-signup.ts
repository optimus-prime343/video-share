import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { AuthData } from '@/features/auth/schemas/login'

const SignupResponseSchema = z.object({ message: z.string() })

type SignupResponse = z.infer<typeof SignupResponseSchema>

export const useSignup = () => {
  return useMutation<SignupResponse, Error, AuthData>({
    mutationFn: data =>
      api
        .POST(SignupResponseSchema, '/auth/create-account', { data })
        .catch(parseAndThrowErrorResponse),
  })
}
