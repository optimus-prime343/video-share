import { Button, FileInput, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback, useState } from 'react'

import { VideoFormData, VideoFormSchema } from '@/features/video/schemas/video'

export interface VideoFormProps {
  onSubmit: (data: FormData) => void
  isSubmitting?: boolean
}
const VideoForm = ({ onSubmit, isSubmitting }: VideoFormProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const form = useForm<VideoFormData>({
    initialValues: {
      title: '',
      description: '',
      category: '',
    },
    validate: zodResolver(VideoFormSchema),
  })

  const handleSubmit = useCallback(
    (data: VideoFormData) => {
      const { title, description, category } = data
      const formData = new FormData()
      formData.append('title', title)
      if (description) formData.append('description', description)
      formData.append('category', category)
      formData.append('video', videoFile as File)
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile as File)
      onSubmit(formData)
    },
    [onSubmit, thumbnailFile, videoFile]
  )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label='Title'
          placeholder='Enter your video title'
          withAsterisk
          {...form.getInputProps('title')}
        />
        <Textarea
          label='Description'
          placeholder='Enter your video description'
          {...form.getInputProps('description')}
        />
        <TextInput
          label='Category'
          placeholder='Enter your video category'
          withAsterisk
          {...form.getInputProps('category')}
        />
        <FileInput
          clearable
          label='Video'
          onChange={setVideoFile}
          placeholder='Upload your video'
          value={videoFile}
        />
        <FileInput
          clearable
          label='Thumbnail'
          onChange={setThumbnailFile}
          placeholder='Upload your thumbnail'
          value={thumbnailFile}
        />
        <Button disabled={!form.isValid || !videoFile} loading={isSubmitting} type='submit'>
          Upload video
        </Button>
      </Stack>
    </form>
  )
}
export default VideoForm
