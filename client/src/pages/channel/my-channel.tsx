import { Box, Button, Stack, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useCallback, useMemo, useState } from 'react'

import { ChannelForm } from '@/features/channel/components/channel-form'
import { useCreateChannel } from '@/features/channel/hooks/use-create-channel'

const hasUserCreatedChannel = false
const MyChannelPage = () => {
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false)
  const createChannel = useCreateChannel()

  const ChannelNotCreated = useMemo(
    () => (
      <Stack align='center' justify='center' mih='70vh'>
        <Title>My Channel</Title>
        <Text>You have not created a channel yet.</Text>
        <Button maw='fit-content' onClick={() => setShowCreateChannelForm(true)}>
          Create Channel
        </Button>
      </Stack>
    ),
    []
  )

  const handleChannelFormSubmit = useCallback(
    (data: FormData) => {
      createChannel.mutate(data, {
        onSuccess: ({ message, data }) => {
          console.log(message, data)
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
    [createChannel]
  )

  return (
    <Box p='md'>
      {!hasUserCreatedChannel && !showCreateChannelForm ? (
        ChannelNotCreated
      ) : (
        <ChannelForm
          isSubmitting={createChannel.isLoading}
          mode='create'
          onSubmit={handleChannelFormSubmit}
        />
      )}
    </Box>
  )
}
export default MyChannelPage
