import { Avatar, createStyles, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { forwardRef } from 'react'

import { IMAGE_BLUR_DATA_URL } from '@/core/constants/strings'
import { useCalculateVideoDuration } from '@/core/hooks/use-calculate-video-duration'
import { formatCount } from '@/core/utils/count'
import { pluralize } from '@/core/utils/pluralize'
import type { Video } from '@/features/video/schemas/video'

export interface VideoItemProps {
  video: Video
}
const VideoItem = forwardRef<HTMLAnchorElement, VideoItemProps>((props, ref) => {
  const { video } = props
  const { classes } = useStyles()

  const duration = useCalculateVideoDuration(video.url)

  const channelHref = `/channel/${video.channel.id}`

  return (
    <Link
      className={classes.videoItem}
      href={{ pathname: '/watch', query: { id: video.id } }}
      ref={ref}
    >
      {video.thumbnail ? (
        <div className={classes.videoThumbnailContainer}>
          <Image
            alt={`${video.title} thumbnail`}
            blurDataURL={IMAGE_BLUR_DATA_URL}
            height={200}
            placeholder='blur'
            src={video.thumbnail}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            width={350}
          />
          <Text className={classes.videoLength}>{duration}</Text>
        </div>
      ) : null}
      <div className={classes.videoItemInfoContainer}>
        <Link href={channelHref} title={video.channel.name}>
          <Avatar
            alt={`${video.channel.name} avatar`}
            radius='xl'
            src={video.channel.avatar}
          />
        </Link>
        <Stack spacing={4}>
          <Text fw='bold' title={video.title}>
            {video.title}
          </Text>
          <Link
            className={classes.videoChannelLink}
            href={channelHref}
            title={video.channel.name}
          >
            <Text color='dimmed' size='sm'>
              {video.channel.name}
            </Text>
          </Link>
          <Text color='dimmed' size='sm'>
            {formatCount(video.views)} {pluralize('View', video.views)} •{' '}
            {dayjs(video.createdAt).fromNow()}
          </Text>
        </Stack>
      </div>
    </Link>
  )
})

VideoItem.displayName = 'VideoItem'

const useStyles = createStyles(theme => ({
  videoItem: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'inline-block',
    maxWidth: '350px',

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
    },
  },
  videoThumbnailContainer: {
    position: 'relative',
    width: 'fit-content',
  },
  videoLength: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
    padding: '2px 4px',
    borderRadius: '4px',
  },
  videoItemInfoContainer: {
    marginTop: theme.spacing.sm,
    display: 'flex',
    gap: theme.spacing.sm,
  },
  videoChannelLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))

export { VideoItem }
