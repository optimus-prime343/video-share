import { Select } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { useAdminUpdateVideo } from '@/features/admin/hooks/use-admin-update-video'
import type { Video, VideoStatus } from '@/features/video/schemas/video'

export interface VideoStatusSelectProps {
  video: Video
}
export const VideoStatusSelect = ({ video }: VideoStatusSelectProps) => {
  const adminUpdateVideo = useAdminUpdateVideo()
  const queryClient = useQueryClient()

  const videoStatus = ['APPROVED', 'PENDING', 'REJECTED'] satisfies VideoStatus[]
  const [value, setValue] = useState<VideoStatus>(() => video.status)

  const handleChange = useCallback(
    (newValue: VideoStatus) => {
      adminUpdateVideo.mutate(
        { id: video.id, data: { status: newValue } },
        {
          onSuccess: message => {
            queryClient.invalidateQueries(['admin-videos']).then(() =>
              showNotification({
                title: 'Success',
                message,
              })
            )
          },
          onError: error =>
            showNotification({
              title: 'Error',
              message: error.message,
              color: 'red',
            }),
        }
      )
      setValue(newValue)
    },
    [adminUpdateVideo, queryClient, video.id]
  )

  return (
    <Select
      data={videoStatus}
      onChange={newValue => handleChange((newValue as VideoStatus) ?? video.status)}
      value={value}
    />
  )
}
