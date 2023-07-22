import { Grid, Stack } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'

import { InfiniteScroll } from '@/core/components/infinite-scroll'
import { useAuthModalOpen } from '@/features/auth/store/use-auth-modal-store'
import { VideoCategoryList } from '@/features/video/components/video-category-list/video-category-list'
import { VideoItem } from '@/features/video/components/video-item'
import { VideosSkeleton } from '@/features/video/components/videos-skeleton'
import { useVideoCategories } from '@/features/video/hooks/use-video-categories'
import { useVideos } from '@/features/video/hooks/use-videos'

const HomePage = () => {
  const router = useRouter()
  const category = router.query?.category as string | undefined
  const search = router.query?.search as string | undefined
  const openAuthModal = useAuthModalOpen()

  const {
    data: videoPages,
    hasNextPage: hasNextVideosPage,
    isFetchingNextPage: isFetchingNextVideosPage,
    fetchNextPage: fetchNextVideosPage,
    isLoading: isVideosLoading,
  } = useVideos({ category, search })
  const { data: videoCategories } = useVideoCategories()

  const videos = useMemo(
    () => videoPages?.pages.flatMap(page => page.videos) ?? [],
    [videoPages]
  )

  useEffect(() => {
    const isVerificationSuccess = router.query['verification-success'] === 'true'
    if (isVerificationSuccess) openAuthModal()
  }, [openAuthModal, router.query])

  return (
    <Stack px='md' py='sm'>
      <VideoCategoryList categories={videoCategories ?? []} />
      {isVideosLoading ? (
        <VideosSkeleton />
      ) : (
        <InfiniteScroll
          hasMore={hasNextVideosPage}
          isLoadingMore={isFetchingNextVideosPage}
          onLoadMore={() => fetchNextVideosPage()}
        >
          <Grid>
            {videos.map(video => (
              <Grid.Col key={video.id} span={3}>
                <VideoItem video={video} />
              </Grid.Col>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Stack>
  )
}
export default HomePage
