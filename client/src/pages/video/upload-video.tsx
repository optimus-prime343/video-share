import { Box } from '@mantine/core'
import { hideNotification, showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { withAuth } from '@/core/hoc/withAuth'
import VideoForm from '@/features/video/components/video-form/video-form'
import { useUploadVideo } from '@/features/video/hooks/use-upload-video'

const UPLOAD_VIDEO_ERROR_NOTIFICATION_ID = 'upload-video-error'

const UploadVideoPage = () => {
  const router = useRouter()
  const uploadVideo = useUploadVideo()

  const handleUploadVideoFormSubmit = useCallback(
    (data: FormData) => {
      uploadVideo.mutate(data, {
        onSuccess: async video => {
          await router.push('/')
          hideNotification(UPLOAD_VIDEO_ERROR_NOTIFICATION_ID)
          showNotification({
            title: 'Video uploaded',
            message: `Your video ${video.title} has been uploaded successfully.Once it is approved, it will be available to watch.`,
            color: 'green',
          })
        },
        onError: error => {
          showNotification({
            id: UPLOAD_VIDEO_ERROR_NOTIFICATION_ID,
            title: 'Error',
            message: error.message,
            color: 'red',
            autoClose: false,
          })
        },
      })
    },
    [router, uploadVideo]
  )

  return (
    <Box p='md'>
      <VideoForm isSubmitting={uploadVideo.isLoading} onSubmit={handleUploadVideoFormSubmit} />
    </Box>
  )
}
export default withAuth(UploadVideoPage)
