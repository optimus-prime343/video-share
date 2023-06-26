import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import type { VideoCategory} from '@/features/video/schemas/video';
import { VideoCategorySchema } from '@/features/video/schemas/video'

export const GetVideoCategoriesResponseSchema = z.object({
  data: z.array(VideoCategorySchema),
})

export const useVideoCategories = () => {
  return useQuery<VideoCategory[], Error>({
    queryKey: ['video', 'categories'],
    queryFn: () =>
      api
        .GET(GetVideoCategoriesResponseSchema, '/video/categories')
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
  })
}
