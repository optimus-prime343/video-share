import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { useUser } from '@/features/auth/hooks/use-user'

import type { Playlist } from '../schemas/playlist'
import { PlaylistSchema } from '../schemas/playlist'

export const GetPlaylistResponseSchema = z.object({
  data: z.array(PlaylistSchema),
})

export const usePlaylist = () => {
  const { data: user } = useUser()
  return useQuery<Playlist[], Error>({
    queryKey: ['playlist', user?.id],
    queryFn: () =>
      api
        .GET(GetPlaylistResponseSchema, '/playlist')
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!user,
  })
}
