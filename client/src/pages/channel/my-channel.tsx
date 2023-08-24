import { Box } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useCallback } from 'react'

import { withAuth } from '@/core/hoc/withAuth'
import { ChannelForm } from '@/features/channel/components/channel-form'
import { useCreateChannel } from '@/features/channel/hooks/use-create-channel'
import { useUpdateChannel } from '@/features/channel/hooks/use-update-channel'
import { useUserChannel } from '@/features/channel/hooks/use-user-channel'

const MyChannelPage = () => {
  const { data: channel, refetch: refetchUserChannel } = useUserChannel()
  const createChannel = useCreateChannel()
  const updateChannel = useUpdateChannel()

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

  const handleUpdateChannelFormSubmit = useCallback(
    (data: FormData) => {
      if (!channel) return
      updateChannel.mutate(
        {
          id: channel.id,
          formData: data,
        },
        {
          onSuccess: message => {
            refetchUserChannel().then(() => {
              showNotification({
                title: 'Channel updated',
                message,
                color: 'green',
              })
            })
          },
          onError: error => {
            showNotification({
              title: 'Failed to update channel',
              message: error.message,
              color: 'red',
            })
          },
        }
      )
    },
    [channel, refetchUserChannel, updateChannel]
  )

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
