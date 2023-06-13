import { Stack } from '@mantine/core'
import { useCallback } from 'react'

import { CommentItem } from '@/features/comment/components/comment-item'
import { Comment } from '@/features/comment/schemas/comment'

export interface CommentListProps {
  comments: Comment[]
}
const CommentList = ({ comments }: CommentListProps) => {
  const renderComments = useCallback(
    () => comments.map(comment => <CommentItem comment={comment} key={comment.id} />),
    [comments]
  )
  return <Stack>{renderComments()}</Stack>
}
export default CommentList
