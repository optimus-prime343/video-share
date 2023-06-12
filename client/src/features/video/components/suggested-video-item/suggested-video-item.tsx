import { createStyles, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { forwardRef } from 'react'

import { Video } from '@/features/video/schemas/video'

export interface SuggestedVideoItemProps {
  video: Video
}
const SuggestedVideoItem = forwardRef<HTMLAnchorElement, SuggestedVideoItemProps>(
  (props, ref) => {
    const { video } = props
    const { classes } = useStyles()
    return (
      <Link
        className={classes.suggestedVideoItem}
        href={{ pathname: '/watch', query: { id: video.id } }}
        ref={ref}
        title={video.title}
      >
        <Image
          alt={video.title}
          height={100}
          src={video.thumbnail ?? ''}
          style={{ objectFit: 'cover', borderRadius: '6px' }}
          width={200}
        />
        <div>
          <Title order={6} title={video.title}>
            {video.title}
          </Title>
          <Text fw='bold' mb={2} mt={6} size='xs' title={video.channel.name}>
            {video.channel.name}
          </Text>
          <Text className={classes.truncate} size='xs'>
            {video.views} views • {dayjs(video.createdAt).fromNow()}
          </Text>
        </div>
      </Link>
    )
  }
)

SuggestedVideoItem.displayName = 'SuggestedVideoItem'

const useStyles = createStyles(theme => ({
  suggestedVideoItem: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    gap: theme.spacing.md,
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '150px',
  },
}))
export { SuggestedVideoItem }
