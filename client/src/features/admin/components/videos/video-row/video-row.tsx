import { ActionIcon, Badge, Group, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import { useCallback } from 'react'

import { type Video } from '@/features/video/schemas/video'

import { VideoDetailedInfo } from '../video-detailed-info'
import { VideoStatusSelect } from '../video-status-select'

export interface VideoRowProps {
  video: Video
}
export const VideoRow = ({ video }: VideoRowProps) => {
  const theme = useMantineTheme()

  const openVideoDetailedInfoModal = useCallback(() => {
    openModal({
      title: 'Video Info',
      children: <VideoDetailedInfo video={video} />,
    })
  }, [video])

  return (
    <tr key={video.id}>
      <td>{video.channel.name}</td>
      <td>{video.title}</td>
      <td>{video.views}</td>
      <td>{video.likes}</td>
      <td>{video.dislikes}</td>
      <td>
        <Badge>{video.category.name}</Badge>
      </td>
      <td>
        <VideoStatusSelect video={video} />
      </td>
      <td>
        <Group>
          <ActionIcon onClick={openVideoDetailedInfoModal}>
            <IconEye color={theme.colors.green[6]} />
          </ActionIcon>
          <ActionIcon>
            <IconPencil color={theme.colors[theme.primaryColor][6]} />
          </ActionIcon>
          <ActionIcon>
            <IconTrash color='red' />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  )
}
