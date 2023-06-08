import { Button, FileInput, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback, useState } from 'react'

import { PreviewImage } from '@/core/components/preview-image'
import {
  Channel,
  ChannelFormData,
  ChannelFormSchema,
} from '@/features/channel/schemas/channel'

interface CommonChannelFormProps {
  isSubmitting?: boolean
  onSubmit: (data: FormData) => void
}
interface UpdateChannelFormProps extends CommonChannelFormProps {
  mode: 'edit'
  channel: Channel
}
interface CreateChannelFormProps extends CommonChannelFormProps {
  mode: 'create'
}

type ChannelFormProps = UpdateChannelFormProps | CreateChannelFormProps

export const ChannelForm = (props: ChannelFormProps) => {
  const { mode, isSubmitting, onSubmit } = props
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)

  const form = useForm<ChannelFormData>({
    initialValues: {
      name: props.mode === 'edit' ? props.channel.name : '',
      description: props.mode === 'edit' ? props.channel.description : '',
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
        <PreviewImage
          alt='Thumbnail preview image'
          file={thumbnail}
          src={props.mode === 'edit' ? props.channel.thumbnail : undefined}
        />
        <FileInput
          accept={'image/*'}
          label='Avatar'
          onChange={setAvatar}
          placeholder='Select avatar'
          value={avatar}
        />
        <PreviewImage
          alt='Avatar preview image'
          file={avatar}
          src={props.mode === 'edit' ? props.channel.avatar : undefined}
        />
        <Button loading={isSubmitting} maw='fit-content' type='submit'>
          {mode === 'create' ? 'Create Channel' : 'Edit Channel'}
        </Button>
      </Stack>
    </form>
  )
}
