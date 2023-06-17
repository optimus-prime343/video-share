import { Avatar, Group, Text } from '@mantine/core'
import dayjs from 'dayjs'

import { DOT } from '@/core/constants/strings'
import { Comment } from '@/features/comment/schemas/comment'

export interface CommentItemProps {
  comment: Comment
}
export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Group align='flex-start'>
      <Avatar radius='xl'></Avatar>
      <div>
        <Text color='dimmed' mb={4}>
          {comment.user.username} {DOT} {dayjs(comment.createdAt).fromNow()}
        </Text>
        <Text>{comment.text}</Text>
      </div>
    </Group>
  )
}
