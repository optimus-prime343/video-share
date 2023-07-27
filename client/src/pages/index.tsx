import { Grid, Stack } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'

import { InfiniteScroll } from '@/core/components/infinite-scroll'
import { useUser } from '@/features/auth/hooks/use-user'
import { useAuthModalOpen } from '@/features/auth/store/use-auth-modal-store'
import { VideoCategoryList } from '@/features/video/components/video-category-list/video-category-list'
import { VideoItem } from '@/features/video/components/video-item'
import { VideosSkeleton } from '@/features/video/components/videos-skeleton'
import { useVideoCategories } from '@/features/video/hooks/use-video-categories'
import { useVideos } from '@/features/video/hooks/use-videos'

const HomePage = () => {
  const { data: user } = useUser()
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
    const showAuth = router.query['show-auth-dialog'] === 'true'
    if (showAuth) openAuthModal()
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
                <VideoItem showMenuOnHover={!!user} video={video} />
              </Grid.Col>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Stack>
  )
}
export default HomePage
