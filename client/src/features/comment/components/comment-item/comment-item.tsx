import { Avatar, createStyles, Flex, Spoiler, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { memo } from 'react'

import { DOT } from '@/core/constants/strings'
import type { Comment } from '@/features/comment/schemas/comment'

export interface CommentItemProps {
  comment: Comment
}
const CommentItem_ = ({ comment }: CommentItemProps) => {
  const { classes } = useStyles()
  return (
    <Flex align='flex-start' gap='sm'>
      <Avatar radius='xl' src={comment.user.image} />
      <div className={classes.commentContent}>
        <Text color='dimmed' mb={4} size='sm'>
          {comment.user.username} {DOT} {dayjs(comment.createdAt).fromNow()}
        </Text>
        <Spoiler hideLabel='Read less' maxHeight={75} showLabel='Read more'>
          {comment.text}
        </Spoiler>
      </div>
    </Flex>
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
