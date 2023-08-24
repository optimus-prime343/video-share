import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const GetPlaylistIdsByVideoResponse = z.object({
  data: z.array(z.string()),
})
export const usePlaylistIdsByVideo = (videoId: string) => {
  return useQuery<string[], Error>({
    queryKey: ['playlist', 'by-video', videoId],
    queryFn: async () =>
      api
        .GET(GetPlaylistIdsByVideoResponse, `/playlist/by-video/${videoId}`)
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    initialData: [],
  })
}
