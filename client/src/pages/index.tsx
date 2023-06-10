import { Box } from '@mantine/core'
import { useMemo } from 'react'

import { VideoList } from '@/features/video/components/video-list'
import { useVideos } from '@/features/video/hooks/use-videos'

const HomePage = () => {
  const { data: videoPages } = useVideos()
  const videos = useMemo(
    () => videoPages?.pages.flatMap(page => page.videos) ?? [],
    [videoPages]
  )
  return (
    <Box p='md'>
      <VideoList videos={videos} />
    </Box>
  )
}
export default HomePage
