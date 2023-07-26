import { ActionIcon, Menu } from '@mantine/core'
import { openModal } from '@mantine/modals'
import {
  IconClock,
  IconDotsVertical,
  IconHeartBroken,
  IconPlaylistAdd,
  IconReport,
} from '@tabler/icons-react'
import type { MouseEvent } from 'react'
import React, { useCallback } from 'react'

import { AddVideoToPlaylist } from '@/features/playlist/components/add-video-to-playlist'

export interface VideoItemMenuProps {
  id: string
  title: string
}
export const VideoItemMenu = ({ id, title }: VideoItemMenuProps) => {
  const handleSaveToPlaylist = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      openModal({
        modalId: 'save-to-playlist',
        title: `Save "${title}" to playlist`,
        children: <AddVideoToPlaylist videoId={id} />,
      })
    },
    [id, title]
  )

  return (
    <Menu position='bottom-end'>
      <Menu.Target>
        <ActionIcon onClick={e => e.preventDefault()}>
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconClock />}>Save to Watch Later</Menu.Item>
        <Menu.Item icon={<IconPlaylistAdd />} onClick={handleSaveToPlaylist}>
          Save to Playlist
        </Menu.Item>
        <Menu.Item icon={<IconHeartBroken />}>Not Interested</Menu.Item>
        <Menu.Divider />
        <Menu.Item color='red' icon={<IconReport />}>
          Report
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
