import { Box } from '@mantine/core'
import React from 'react'

import { InfiniteScroll } from '@/core/components/infinite-scroll'
import { VideoItem } from '@/features/video/components/video-item'

import { useChannelVideos } from '../../hooks/use-channel-videos'
import type { ChannelDetail } from '../../schemas/channel'

export interface ChannelHomePanelProps {
  channel: ChannelDetail
}
export const ChannelHomePanel = ({ channel }: ChannelHomePanelProps) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useChannelVideos(channel.id)
  return (
    <Box display='flex' py='md'>
      <InfiniteScroll
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      >
        {data?.pages.map(page =>
          page.videos.map(video => <VideoItem key={video.id} video={video} />)
        )}
      </InfiniteScroll>
    </Box>
  )
}
