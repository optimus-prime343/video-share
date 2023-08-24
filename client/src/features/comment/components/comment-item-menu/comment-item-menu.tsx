import { ActionIcon, Menu } from '@mantine/core'
import { closeModal, openConfirmModal, openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { memo, useCallback } from 'react'

import { useUser } from '@/features/auth/hooks/use-user'

import { useDeleteComment } from '../../hooks/use-delete-comment'
import type { Comment } from '../../schemas/comment'
import { CommentEditForm } from '../comment-edit-form'

export interface CommentItemMenuProps {
  comment: Comment
}
const CommentItemMenu_ = ({ comment }: CommentItemMenuProps) => {
  const { data: user } = useUser()
  const deleteComment = useDeleteComment()
  const queryClient = useQueryClient()

  const handleOpenEditForm = useCallback(() => {
    if (!user) return
    const modalId = 'comment-edit-form'
    openModal({
      modalId,
      title: 'Edit comment',
      children: <CommentEditForm comment={comment} onSuccess={() => closeModal(modalId)} />,
    })
  }, [comment, user])

  const handleDeleteComment = useCallback(() => {
    openConfirmModal({
      title: 'Delete comment',
      children: 'Are you sure that you want to delete this comment?',
      labels: {
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      onConfirm: () => {
        deleteComment.mutate(comment.id, {
          onSuccess: async message => {
            queryClient.invalidateQueries(['comments', 'video', comment.videoId]).then(() => {
              showNotification({
                title: 'Comment deleted',
                message,
              })
            })
          },
        })
      },
    })
  }, [comment.id, comment.videoId, deleteComment, queryClient])

  if (user?.id !== comment.user.id) return null

  return (
    <Menu position='bottom-start' width={150}>
      <Menu.Target>
        <ActionIcon size='xs'>
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconPencil />} onClick={handleOpenEditForm}>
          Edit
        </Menu.Item>
        <Menu.Item color='red' icon={<IconTrash />} onClick={handleDeleteComment}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
export const CommentItemMenu = memo(CommentItemMenu_)
