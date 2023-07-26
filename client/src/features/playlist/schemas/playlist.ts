import { z } from 'zod'

export const PlaylistSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).optional(),
})

export const PlaylistFormSchema = PlaylistSchema.pick({
  name: true,
  description: true,
}).extend({
  name: z.string().nonempty(),
})

export interface Playlist extends z.infer<typeof PlaylistSchema> {}
export interface PlaylistFormData extends z.infer<typeof PlaylistFormSchema> {}
