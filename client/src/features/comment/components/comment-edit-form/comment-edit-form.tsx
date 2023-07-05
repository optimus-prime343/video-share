import { Button, Stack, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { useUpdateComment } from '../../hooks/use-update-comment'
import type { Comment } from '../../schemas/comment'

export interface CommentEditFormProps {
  comment: Comment
  onSuccess?: () => void
}
export const CommentEditForm = ({ comment, onSuccess }: CommentEditFormProps) => {
  const [text, setText] = useState(() => comment.text)
  const isButtonDisabled = useMemo(() => comment.text === text, [comment.text, text])

  const queryClient = useQueryClient()
  const updateComment = useUpdateComment()

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      updateComment.mutate(
        { commentId: comment.id, text },
        {
          onSuccess: message => {
            showNotification({
              title: 'Comment updated',
              message,
            })
            queryClient.invalidateQueries(['comments', 'video', comment.videoId]).then(() => {
              onSuccess?.()
            })
          },
        }
      )
    },
    [comment.id, comment.videoId, onSuccess, queryClient, text, updateComment]
  )
  return (
    <form onSubmit={handleFormSubmit}>
      <Stack>
        <TextInput onChange={event => setText(event.currentTarget.value)} value={text} />
        <Button disabled={isButtonDisabled} loading={updateComment.isLoading} type='submit'>
          Confirm Edit
        </Button>
      </Stack>
    </form>
  )
}
