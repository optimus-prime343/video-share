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
      <Grid.Col key={video.id} span='content'>
        <VideoItem video={video} />
      </Grid.Col>
    ))
  }, [videos])
  return (
    <Grid align='flex-start' gutter='lg'>
      {renderVideos()}
    </Grid>
  )
}
