import { Avatar, createStyles, Group, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { memo } from 'react'

import { DOT } from '@/core/constants/strings'
import { Comment } from '@/features/comment/schemas/comment'

export interface CommentItemProps {
  comment: Comment
}
const CommentItem_ = ({ comment }: CommentItemProps) => {
  const { classes } = useStyles()
  return (
    <Group align='flex-start'>
      <Avatar radius='xl'></Avatar>
      <div className={classes.commentContent}>
        <Text color='dimmed' mb={4} size='sm'>
          {comment.user.username} {DOT} {dayjs(comment.createdAt).fromNow()}
        </Text>
        <Text>{comment.text}</Text>
      </div>
    </Group>
  )
}

const useStyles = createStyles(theme => ({
  commentContent: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
    paddingBlock: theme.spacing.xs,
    paddingInline: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
}))

export const CommentItem = memo(CommentItem_)
