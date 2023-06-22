import { Button, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconMessage } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { memo, useCallback } from 'react'

import { useUser } from '@/features/auth/hooks/use-user'
import { useCreateComment } from '@/features/comment/hooks/use-create-comment'
import {
  CreateCommentFormData,
  CreateCommentFormSchema,
} from '@/features/comment/schemas/comment'

interface CommentFormProps {
  videoId: string
}
const CommentForm_ = ({ videoId }: CommentFormProps) => {
  const queryClient = useQueryClient()

  const { data: user } = useUser()
  const createComment = useCreateComment()

  const form = useForm<CreateCommentFormData>({
    initialValues: {
      text: '',
      videoId,
    },
    validate: zodResolver(CreateCommentFormSchema),
  })

  const handleSubmit = useCallback(
    (data: CreateCommentFormData) => {
      createComment.mutate(data, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['comments', 'video', videoId])
          form.reset()
        },
      })
    },
    [createComment, form, queryClient, videoId]
  )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack align='flex-end' spacing='xs'>
        <TextInput
          disabled={!user}
          icon={<IconMessage />}
          placeholder={user ? 'Write a comment' : 'Login to comment'}
          w='100%'
          {...form.getInputProps('text')}
        />
        <Button
          disabled={!form.isValid() || !user}
          loading={createComment.isLoading}
          type='submit'
        >
          Comment
        </Button>
      </Stack>
    </form>
  )
}
export const CommentForm = memo(CommentForm_)
