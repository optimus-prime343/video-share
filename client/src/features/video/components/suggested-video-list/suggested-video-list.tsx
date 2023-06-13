import { Stack } from '@mantine/core'
import { useCallback } from 'react'

import { SuggestedVideoItem } from '@/features/video/components/suggested-video-item'
import { Video } from '@/features/video/schemas/video'

export interface SuggestedVideoListProps {
  videos: Video[]
}
const SuggestedVideoList = ({ videos }: SuggestedVideoListProps) => {
  const renderSuggestedVideos = useCallback(
    () => videos.map(video => <SuggestedVideoItem key={video.id} video={video} />),
    [videos]
  )
  return <Stack>{renderSuggestedVideos()}</Stack>
}
export default SuggestedVideoList
