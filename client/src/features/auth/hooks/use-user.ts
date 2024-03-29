import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import type { User} from '@/features/auth/schemas/user';
import { UserSchema } from '@/features/auth/schemas/user'

export const USER_QUERY_KEY = ['user']

const UserResponseSchema = z.object({
  data: z.object({
    user: UserSchema.nullable(),
  }),
})

export const useUser = () => {
  return useQuery<User | null, Error>({
    queryKey: USER_QUERY_KEY,
    queryFn: () =>
      api
        .GET(UserResponseSchema, '/auth/profile')
        .then(data => data.data.user)
        .catch(parseAndThrowErrorResponse),
  })
}
