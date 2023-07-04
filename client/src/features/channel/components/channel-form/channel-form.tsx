import { Button, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback, useState } from 'react'

import { CustomRichTextEditor } from '@/core/components/custom-rich-text-editor'
import { UploadFileInput } from '@/core/components/upload-file-input'
import type { Channel, ChannelFormData } from '@/features/channel/schemas/channel'
import { ChannelFormSchema } from '@/features/channel/schemas/channel'

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
        <CustomRichTextEditor
          content={form.values.description ?? ''}
          onContentChange={content => form.setFieldValue('description', content)}
          placeholder='Enter your channel description'
        />
        <UploadFileInput
          accept='image/*'
          label='Upload channel thumbnail'
          onChange={setThumbnail}
          withAsterick
        />
        <UploadFileInput
          accept='image/*'
          label='Upload channel avatar'
          onChange={setAvatar}
          withAsterick
        />
        <Button loading={isSubmitting} maw='fit-content' type='submit'>
          {mode === 'create' ? 'Create Channel' : 'Edit Channel'}
        </Button>
      </Stack>
    </form>
  )
}
