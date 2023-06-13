import { createStyles, Stack, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { forwardRef } from 'react'

import { useCalculateVideoDuration } from '@/core/hooks/use-calculate-video-duration'
import { formatCount } from '@/core/utils/count'
import { Video } from '@/features/video/schemas/video'

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
            height={200}
            src={video.thumbnail}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            width={400}
          />
          <Text className={classes.videoLength}>{duration}</Text>
        </div>
      ) : null}
      <div className={classes.videoItemInfoContainer}>
        {video.channel.thumbnail ? (
          <Link href={channelHref} title={video.channel.name}>
            <Image
              alt={`${video.channel.name} profile image`}
              height={50}
              src={video.channel.thumbnail}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              width={50}
            />
          </Link>
        ) : null}
        <Stack spacing={4}>
          <Title order={4} title={video.title}>
            {video.title}
          </Title>
          <Link
            className={classes.videoChannelLink}
            href={channelHref}
            title={video.channel.name}
          >
            <Text>{video.channel.name}</Text>
          </Link>
          <Text>
            {formatCount(video.views)} views • {dayjs(video.createdAt).fromNow()}
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
    maxWidth: '400px',

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
    marginTop: theme.spacing.md,
    display: 'flex',
    gap: theme.spacing.md,
  },
  videoChannelLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))

export { VideoItem }
