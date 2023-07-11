import { createStyles } from '@mantine/core'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Video } from '../../schemas/video'
import { VideoItemInfo } from '../video-item-info'
import { VideoItemThumbnail } from '../video-item-thumbnail'

export interface ExperimentalVideoItemProps {
  video: Video
  display?: 'row' | 'column'
}
export const VideoItem = ({ video, display = 'column' }: ExperimentalVideoItemProps) => {
  const [showPlayer, setShowPlayer] = useState(false)

  const { classes, cx } = useStyles()
  return (
    <Link
      className={cx(classes.root, classes[display])}
      href={{ pathname: '/watch', query: { id: video.id } }}
      onMouseEnter={() => setShowPlayer(true)}
      onMouseLeave={() => setShowPlayer(false)}
    >
      <VideoItemThumbnail
        showControls={display === 'column'}
        showPlayerOnHover={showPlayer}
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
