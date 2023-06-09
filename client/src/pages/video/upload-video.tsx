import { Box } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useCallback } from 'react'

import VideoForm from '@/features/video/components/video-form/video-form'
import { useUploadVideo } from '@/features/video/hooks/use-upload-video'

const UploadVideoPage = () => {
  const uploadVideo = useUploadVideo()

  const handleUploadVideoFormSubmit = useCallback(
    (data: FormData) => {
      uploadVideo.mutate(data, {
        onSuccess: video => {
          console.log(video)
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
    [uploadVideo]
  )

  return (
    <Box p='md'>
      <VideoForm isSubmitting={uploadVideo.isLoading} onSubmit={handleUploadVideoFormSubmit} />
    </Box>
  )
}
export default UploadVideoPage
