import { Box, Stack } from '@mantine/core'
import { useCallback } from 'react'

import { HistoryItem } from '@/features/history/components/history-item'
import { useHistory } from '@/features/history/hooks/use-history'

const HistoryPage = () => {
  const { data: pages } = useHistory()
  const renderHistoryList = useCallback(
    () =>
      (pages?.pages.flatMap(page => page.history) ?? []).map(history => (
        <HistoryItem history={history} key={history.id} />
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
