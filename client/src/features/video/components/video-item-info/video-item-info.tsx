import { Avatar, createStyles, Group, Text, Title, UnstyledButton } from '@mantine/core'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import type { MouseEvent } from 'react'
import React, { useCallback } from 'react'

import { DOT } from '@/core/constants/strings'
import { formatCount } from '@/core/utils/count'
import { pluralize } from '@/core/utils/pluralize'

import type { Video } from '../../schemas/video'

export interface VideoItemInfoProps {
  video: Video
  showAvatar?: boolean
}
export const VideoItemInfo = ({ video, showAvatar = true }: VideoItemInfoProps) => {
  const { classes } = useStyles()
  const router = useRouter()

  const navigateToChannelPage = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      router.push(`/channel/${video.channel.id}`)
    },
    [router, video.channel.id]
  )
  return (
    <Group align='flex-start' noWrap>
      {showAvatar ? (
        <UnstyledButton onClick={navigateToChannelPage}>
          <Avatar alt={video.channel.name} radius='xl' src={video.channel.avatar} />
        </UnstyledButton>
      ) : null}
      <div>
        <Title className={classes.title} order={5} title={video.title}>
          {video.title}
        </Title>
        <UnstyledButton onClick={navigateToChannelPage}>
          <Text my={4}>{video.channel.name}</Text>
        </UnstyledButton>
        <Text color='dimmed' size='sm'>
          {formatCount(video.views)} {pluralize('View', video.views)} {DOT}{' '}
          {dayjs(video.createdAt).fromNow()}{' '}
        </Text>
      </div>
    </Group>
  )
}
const useStyles = createStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  title: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
}))
