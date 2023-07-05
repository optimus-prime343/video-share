import { Badge, Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback, useState } from 'react'

import { CustomRichTextEditor } from '@/core/components/custom-rich-text-editor'
import { UploadFileInput } from '@/core/components/upload-file-input'
import type { VideoFormData } from '@/features/video/schemas/video'
import { VideoFormSchema } from '@/features/video/schemas/video'

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
  const renderPopularCategories = useCallback(
    () =>
      POPULAR_CATEGORIES.map(category => (
        <Badge
          component={Button}
          key={category}
          // @ts-expect-error Some issue with Mantine polymorphic types
          onClick={() => form.setFieldValue('category', category)}
          size='lg'
          variant='dot'
        >
          {category}
        </Badge>
      )),
    [form]
  )

  const handleSubmit = useCallback(
    (data: VideoFormData) => {
      const { title, description, category } = data
      const formData = new FormData()
      formData.append('title', title)
      if (description) formData.append('description', description)
      formData.append('category', category)
      formData.append('video', videoFile as File)
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
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
        <TextInput
          label='Category'
          placeholder='Enter your video category'
          withAsterisk
          {...form.getInputProps('category')}
        />
        <Group>{renderPopularCategories()}</Group>
        <UploadFileInput
          accept='video/*'
          label='Upload your video'
          onChange={setVideoFile}
          withAsterick
        />
        <CustomRichTextEditor
          content={form.values.description ?? ''}
          onContentChange={content => form.setFieldValue('description', content)}
          placeholder='Enter your video description'
        />
        <UploadFileInput
          accept='image/*'
          label='Upload your video thumbnail'
          onChange={setThumbnailFile}
        />
        <Button
          disabled={!form.isValid() || !videoFile || !thumbnailFile}
          loading={isSubmitting}
          type='submit'
        >
          Upload video
        </Button>
      </Stack>
    </form>
  )
}
const POPULAR_CATEGORIES = [
  //TODO: STORE AND GET FROM DB INSTEAD
  'Music',
  'Comedy',
  'Gaming',
  'Education',
  'Entertainment',
  'Sports',
  'News',
  'Animation',
  'Film & Animation',
  'How-to & DIY',
  'Science & Technology',
  'Food & Cooking',
  'Travel',
  'Fashion & Beauty',
  'Fitness',
  'Health & Wellness',
  'Documentary',
  'Vlogs',
  'Pets & Animals',
  'Kids',
  'Art & Design',
  'Business',
  'Home & Garden',
  'Automotive',
  'Technology Reviews',
  'Politics',
  'History',
  'Nature & Wildlife',
  'Motivation & Self-Improvement',
  'Parenting',
  'Photography',
]

export default VideoForm
