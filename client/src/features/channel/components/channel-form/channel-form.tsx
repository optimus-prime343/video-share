import { Button, FileInput, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback, useState } from 'react'

import { PreviewImage } from '@/core/components/preview-image'
import { ChannelFormData, ChannelFormSchema } from '@/features/channel/schemas/channel'

interface ChannelFormProps {
  mode: 'create' | 'edit'
  isSubmitting?: boolean
  onSubmit: (data: FormData) => void
}
export const ChannelForm = ({ mode, isSubmitting, onSubmit }: ChannelFormProps) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)

  const form = useForm<ChannelFormData>({
    initialValues: {
      name: '',
      description: '',
    },
    validate: zodResolver(ChannelFormSchema),
  })
  const handleSubmit = useCallback(
    (data: ChannelFormData) => {
      const { name, description } = data
      const formData = new FormData()
      formData.append('name', name)
      if (description) formData.append('description', description)
      if (thumbnail) formData.append('thumbnail', thumbnail)
      if (avatar) formData.append('avatar', avatar)
      onSubmit(formData)
    },
    [avatar, onSubmit, thumbnail]
  )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label='Name'
          placeholder='Enter your channel name'
          withAsterisk
          {...form.getInputProps('name')}
        />
        <Textarea
          label='Description'
          placeholder='Enter your channel description'
          {...form.getInputProps('description')}
        />
        <FileInput
          accept='image/*'
          label='Thumbnail'
          onChange={setThumbnail}
          placeholder='Select thumbnail'
          value={thumbnail}
        />
        <PreviewImage alt='Thumbnail preview image' file={thumbnail} />
        <FileInput
          accept={'image/*'}
          label='Avatar'
          onChange={setAvatar}
          placeholder='Select avatar'
          value={avatar}
        />
        <PreviewImage alt='Avatar preview image' file={avatar} />
        <Button loading={isSubmitting} maw='fit-content' type='submit'>
          {mode === 'create' ? 'Create Channel' : 'Update Channel'}
        </Button>
      </Stack>
    </form>
  )
}
