import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const AddRemoveVideoFromPlaylistResponseSchema = z.object({
  message: z.string(),
})
export interface AddRemoveVideoFromPlaylistRequest {
  playlistId: string
  videoId: string
}
export const useAddRemoveVideoFromPlaylist = () => {
  return useMutation<string, Error, AddRemoveVideoFromPlaylistRequest>({
    mutationFn: data =>
      api
        .POST(
          AddRemoveVideoFromPlaylistResponseSchema,
          '/playlist/add-remove-video-from-playlist',
          { data }
        )
        .then(res => res.message)
        .catch(parseAndThrowErrorResponse),
  })
}
