import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import type { SignupFormData } from '@/features/auth/schemas/signup'

const SignupResponseSchema = z.object({ message: z.string() })

type SignupResponse = z.infer<typeof SignupResponseSchema>

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupFormData>({
    mutationFn: data =>
      api
        .POST(SignupResponseSchema, '/auth/create-account', { data })
        .catch(parseAndThrowErrorResponse),
  })
}
