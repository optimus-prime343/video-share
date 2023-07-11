import { AspectRatio, createStyles, Text } from '@mantine/core'
import Image from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

import { useCalculateVideoDuration } from '@/core/hooks/use-calculate-video-duration'

import type { Video } from '../../schemas/video'

export interface VideoItemThumbnailProps extends ComponentPropsWithoutRef<'video'> {
  video: Video
  showPlayerOnHover?: boolean
  showControls?: boolean
}
export const VideoItemThumbnail = ({
  video,
  showPlayerOnHover,
  ...rest
}: VideoItemThumbnailProps) => {
  const duration = useCalculateVideoDuration(video.url)
  const { classes } = useStyles()

  return (
    <AspectRatio className={classes.thumbnail} mah={200} miw={150} ratio={16 / 9}>
      {showPlayerOnHover ? (
        <video autoPlay controls height={300} muted {...rest}>
          <source src={video.url} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className={classes.imageContainer}>
          <Image alt={video.title} fill src={video.thumbnail} style={{ objectFit: 'cover' }} />
          <Text className={classes.duration}>{duration}</Text>
        </div>
      )}
    </AspectRatio>
  )
}
const useStyles = createStyles(theme => ({
  thumbnail: {
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  duration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
    padding: '2px 4px',
  },
}))
