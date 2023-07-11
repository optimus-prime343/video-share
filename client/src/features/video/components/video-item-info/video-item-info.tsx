import { Avatar, createStyles, Group, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

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
  return (
    <Group align='flex-start' noWrap>
      {showAvatar ? (
        <Link href={`/channel/${video.channel.id}`}>
          <Avatar alt={video.channel.name} radius='xl' src={video.channel.avatar} />
        </Link>
      ) : null}
      <div>
        <Title className={classes.title} order={5} title={video.title}>
          {video.title}
        </Title>
        <Link className={classes.link} href={`/channel/${video.channel.id}`}>
          <Text my={4} title={video.channel.name}>
            {video.channel.name}
          </Text>
        </Link>
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
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2',
  },
}))
