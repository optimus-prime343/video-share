import { Stack } from '@mantine/core'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { VideoCategoryList } from '@/features/video/components/video-category-list/video-category-list'
import { VideoList } from '@/features/video/components/video-list'
import { useVideoCategories } from '@/features/video/hooks/use-video-categories'
import { useVideos } from '@/features/video/hooks/use-videos'

const HomePage = () => {
  const router = useRouter()
  const category = router.query?.category as string | undefined
  const { data: videoPages } = useVideos(category)
  const { data: videoCategories } = useVideoCategories()

  const videos = useMemo(
    () => videoPages?.pages.flatMap(page => page.videos) ?? [],
    [videoPages]
  )
  return (
    <Stack px='md' py='sm'>
      <VideoCategoryList categories={videoCategories ?? []} />
      <VideoList videos={videos} />
    </Stack>
  )
}
export default HomePage
