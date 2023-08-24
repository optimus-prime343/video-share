import { z } from 'zod'

export const CreatePlaylistRequestSchema = z.object({
  body: z.object({
    name: z.string().nonempty().max(255),
    description: z.string().max(255).optional(),
  }),
})
export const AddRemoveVideoFromPlaylistRequestSchema = z.object({
  body: z.object({
    playlistId: z.string().nonempty(),
    videoId: z.string().nonempty(),
  }),
})
export const GetPlaylistIdsByVideoRequestSchema = z.object({
  params: z.object({
    videoId: z.string().nonempty(),
  }),
})
export type CreatePlaylistRequest = z.infer<typeof CreatePlaylistRequestSchema>
export type AddRemoveVideoFromPlaylistRequest = z.infer<
  typeof AddRemoveVideoFromPlaylistRequestSchema
>
export type GetPlaylistIdsByVideoRequest = z.infer<typeof GetPlaylistIdsByVideoRequestSchema>
