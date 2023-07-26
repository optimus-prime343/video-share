import { Button, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback } from 'react'

import { useUser } from '@/features/auth/hooks/use-user'

import { useCreatePlaylist } from '../../hooks/use-create-playlist'
import type { PlaylistFormData } from '../../schemas/playlist'
import { PlaylistFormSchema } from '../../schemas/playlist'

export interface PlaylistFormProps {
  initialValues?: PlaylistFormData
  onSuccess?: (playlist: PlaylistFormData) => void
}

export const PlaylistForm = ({ initialValues, onSuccess }: PlaylistFormProps) => {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const createPlaylist = useCreatePlaylist()
  const form = useForm<PlaylistFormData>({
    initialValues: initialValues ?? {
      name: '',
      description: '',
    },
    validate: zodResolver(PlaylistFormSchema),
  })
  const handleSubmit = useCallback(
    (data: PlaylistFormData) => {
      if (initialValues) return alert('Edit playlist')
      createPlaylist.mutate(data, {
        onSuccess: ({ data, message }) => {
          queryClient.invalidateQueries(['playlist', user?.id]).then(() => {
            showNotification({
              title: 'Success',
              message,
              color: 'green',
            })
            onSuccess?.(data)
          })
        },
        onError: error => {
          showNotification({
            title: 'Error',
            message: error.message,
            color: 'red',
          })
        },
      })
    },
    [createPlaylist, initialValues, onSuccess, queryClient, user?.id]
  )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label='Playlist name'
          placeholder='Enter your playlist name'
          withAsterisk
          {...form.getInputProps('name')}
        />
        <Textarea
          label='Description'
          placeholder='Enter your playlist description'
          {...form.getInputProps('description')}
        />
        <Button disabled={!form.isValid()} loading={createPlaylist.isLoading} type='submit'>
          Create playlist
        </Button>
      </Stack>
    </form>
  )
}
