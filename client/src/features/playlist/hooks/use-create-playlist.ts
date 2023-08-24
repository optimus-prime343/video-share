import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

import type { PlaylistFormData } from '../schemas/playlist'
import { PlaylistSchema } from '../schemas/playlist'

export const CreatePlaylistResponseSchema = z.object({
  message: z.string(),
  data: PlaylistSchema,
})

export interface CreatePlaylistResponse extends z.infer<typeof CreatePlaylistResponseSchema> {}

export const useCreatePlaylist = () => {
  return useMutation<CreatePlaylistResponse, Error, PlaylistFormData>({
    mutationFn: data =>
      api
        .POST(CreatePlaylistResponseSchema, '/playlist', { data })
        .catch(parseAndThrowErrorResponse),
  })
}
