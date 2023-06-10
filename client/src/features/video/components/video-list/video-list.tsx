import { Grid } from '@mantine/core'
import { useCallback } from 'react'

import { VideoItem } from '@/features/video/components/video-item'
import { Video } from '@/features/video/schemas/video'

export interface VideoListProps {
  videos: Video[]
}
export const VideoList = ({ videos }: VideoListProps) => {
  const renderVideos = useCallback(() => {
    return videos.map(video => (
      <Grid.Col key={video.id} md={2} sm={1} xl={4}>
        <VideoItem video={video} />
      </Grid.Col>
    ))
  }, [videos])
  return <Grid gutter='xl'>{renderVideos()}</Grid>
}
