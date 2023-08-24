import { Button, Checkbox, Divider, Group, Stack } from '@mantine/core'
import { closeModal, openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconPlaylist } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback } from 'react'

import { useAddRemoveVideoFromPlaylist } from '../../hooks/use-add-remove-video-from-playlist'
import { usePlaylist } from '../../hooks/use-playlist'
import { usePlaylistIdsByVideo } from '../../hooks/use-playlist-ids-by-video'
import { PlaylistForm } from '../playlist-form'

export interface AddVideoToPlaylistProps {
  videoId: string
}

const CREATE_NEW_PLAYLIST_MODAL_ID = 'create-new-playlist'

export const AddVideoToPlaylist = ({ videoId }: AddVideoToPlaylistProps) => {
  const queryClient = useQueryClient()
  const { data: playlists } = usePlaylist()
  const { data: playlistIdsByVideo } = usePlaylistIdsByVideo(videoId)
  const addRemoveVideoFromPlaylist = useAddRemoveVideoFromPlaylist()

  const handleCreateNewPlaylist = useCallback(() => {
    openModal({
      modalId: CREATE_NEW_PLAYLIST_MODAL_ID,
      title: 'Create new playlist',
      children: <PlaylistForm onSuccess={() => closeModal(CREATE_NEW_PLAYLIST_MODAL_ID)} />,
    })
  }, [])

  const handleAddRemoveVideoFromPlaylist = useCallback(
    (playlistId: string) => {
      addRemoveVideoFromPlaylist.mutate(
        { videoId, playlistId },
        {
          onSuccess: message => {
            queryClient.invalidateQueries(['playlist', 'by-video', videoId]).then(() => {
              showNotification({
                title: 'Success',
                message,
                color: 'green',
              })
            })
          },
          onError: error => {
            showNotification({
              title: 'Error',
              message: error.message,
              color: 'red',
            })
          },
        }
      )
    },
    [addRemoveVideoFromPlaylist, queryClient, videoId]
  )

  const renderPlaylists = useCallback(
    () =>
      (playlists ?? []).map(playlist => (
        <Group key={playlist.id}>
          <label htmlFor={playlist.name} style={{ flex: 1 }}>
            {playlist.name}
          </label>
          <Checkbox
            checked={playlistIdsByVideo.includes(playlist.id)}
            id={playlist.name}
            onChange={() => handleAddRemoveVideoFromPlaylist(playlist.id)}
          />
        </Group>
      )),
    [handleAddRemoveVideoFromPlaylist, playlistIdsByVideo, playlists]
  )

  return (
    <Stack>
      <Button leftIcon={<IconPlaylist />} onClick={handleCreateNewPlaylist}>
        Create new playlist
      </Button>
      <Divider />
      {renderPlaylists()}
    </Stack>
  )
}
