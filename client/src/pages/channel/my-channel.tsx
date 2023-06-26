import { Box } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useCallback } from 'react'

import { withAuth } from '@/core/hoc/withAuth'
import { ChannelForm } from '@/features/channel/components/channel-form'
import { useCreateChannel } from '@/features/channel/hooks/use-create-channel'
import { useUserChannel } from '@/features/channel/hooks/use-user-channel'

const MyChannelPage = () => {
  const { data: channel, refetch: refetchUserChannel } = useUserChannel()
  const createChannel = useCreateChannel()

  const handleCreateChannelFormSubmit = useCallback(
    (data: FormData) => {
      createChannel.mutate(data, {
        onSuccess: ({ message }) => {
          refetchUserChannel().then(() => {
            showNotification({
              title: 'Channel created',
              message,
              color: 'green',
            })
          })
        },
        onError: error => {
          showNotification({
            title: 'Failed to create channel',
            message: error.message,
            color: 'red',
          })
        },
      })
    },
    [createChannel, refetchUserChannel]
  )

  const handleUpdateChannelFormSubmit = useCallback((data: FormData) => {
    console.log(data)
  }, [])

  return (
    <Box p='md'>
      {channel ? (
        <ChannelForm
          channel={channel}
          isSubmitting={createChannel.isLoading}
          key={channel.id}
          mode='edit'
          onSubmit={handleUpdateChannelFormSubmit}
        />
      ) : (
        <ChannelForm
          isSubmitting={createChannel.isLoading}
          mode='create'
          onSubmit={handleCreateChannelFormSubmit}
        />
      )}
    </Box>
  )
}
export default withAuth(MyChannelPage)
