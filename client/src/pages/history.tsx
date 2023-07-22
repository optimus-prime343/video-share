import { Box, Stack } from '@mantine/core'
import { useCallback } from 'react'

import { useHistory } from '@/features/history/hooks/use-history'
import { VideoItem } from '@/features/video/components/video-item'

const HistoryPage = () => {
  const { data: pages } = useHistory()

  const renderHistoryList = useCallback(
    () =>
      (pages?.pages.flatMap(page => page.history) ?? []).map(history => (
        <VideoItem
          display='row'
          href={{
            pathname: '/watch',
            query: { id: history.video.id, time: history.timestamp },
          }}
          key={history.id}
          thumbnailMaxHeight={400}
          thumbnailMinWidth={400}
          video={history.video}
        />
      )),
    [pages?.pages]
  )
  return (
    <Box p='md'>
      <Stack spacing='xl'>{renderHistoryList()}</Stack>
    </Box>
  )
}

export default HistoryPage
