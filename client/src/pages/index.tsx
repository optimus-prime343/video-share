import { Grid, Stack } from '@mantine/core'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { InfiniteScroll } from '@/core/components/infinite-scroll'
import { VideoCategoryList } from '@/features/video/components/video-category-list/video-category-list'
import { VideoItem } from '@/features/video/components/video-item'
import { useVideoCategories } from '@/features/video/hooks/use-video-categories'
import { useVideos } from '@/features/video/hooks/use-videos'

const HomePage = () => {
  const router = useRouter()
  const category = router.query?.category as string | undefined
  const search = router.query?.search as string | undefined

  const {
    data: videoPages,
    hasNextPage: hasNextVideosPage,
    isFetchingNextPage: isFetchingNextVideosPage,
    fetchNextPage: fetchNextVideosPage,
  } = useVideos({ category, search })
  const { data: videoCategories } = useVideoCategories()

  const videos = useMemo(
    () => videoPages?.pages.flatMap(page => page.videos) ?? [],
    [videoPages]
  )
  return (
    <Stack px='md' py='sm'>
      <VideoCategoryList categories={videoCategories ?? []} />
      <InfiniteScroll
        align='flex-start'
        as={Grid}
        fetchNextPage={fetchNextVideosPage}
        gutter='lg'
        hasNextPage={hasNextVideosPage}
        isFetchingNextPage={isFetchingNextVideosPage}
        items={videos}
        renderItem={video => (
          <Grid.Col span='content'>
            <VideoItem video={video} />
          </Grid.Col>
        )}
      />
    </Stack>
  )
}
export default HomePage
