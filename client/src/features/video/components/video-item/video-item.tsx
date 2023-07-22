import { createStyles } from '@mantine/core'
import type { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Video } from '../../schemas/video'
import { VideoItemInfo } from '../video-item-info'
import { VideoItemThumbnail } from '../video-item-thumbnail'

export interface VideoItemProps {
  video: Video
  display?: 'row' | 'column'
  thumbnailMinWidth?: number
  thumbnailMaxHeight?: number
  href?: Url
}
export const VideoItem = ({
  video,
  href,
  display = 'column',
  thumbnailMinWidth = 150,
  thumbnailMaxHeight = 300,
}: VideoItemProps) => {
  const [hovered, setHovered] = useState(false)

  const { classes, cx } = useStyles()
  return (
    <Link
      className={cx(classes.root, classes[display])}
      href={href ?? { pathname: '/watch', query: { id: video.id } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <VideoItemThumbnail
        controls={display === 'column'}
        showPlayerOnHover={hovered}
        thumbnailMaxHeight={thumbnailMaxHeight}
        thumbnailMinWidth={thumbnailMinWidth}
        video={video}
      />
      <VideoItemInfo showAvatar={display === 'column'} video={video} />
    </Link>
  )
}
const useStyles = createStyles(theme => ({
  root: {
    textDecoration: 'none',
    color: 'inherit',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  row: {
    display: 'flex',
    gap: theme.spacing.sm,
  },
}))
