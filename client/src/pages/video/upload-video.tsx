import { Box } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { withAuth } from '@/core/hoc/withAuth'
import VideoForm from '@/features/video/components/video-form/video-form'
import { useUploadVideo } from '@/features/video/hooks/use-upload-video'

const UploadVideoPage = () => {
  const router = useRouter()
  const uploadVideo = useUploadVideo()

  const handleUploadVideoFormSubmit = useCallback(
    (data: FormData) => {
      uploadVideo.mutate(data, {
        onSuccess: async video => {
          await router.push('/')
          showNotification({
            title: 'Video uploaded',
            message: `Your video ${video.title} has been uploaded successfully.Once it is approved, it will be available to watch.`,
            color: 'green',
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
    [router, uploadVideo]
  )

  return (
    <Box p='md'>
      <VideoForm isSubmitting={uploadVideo.isLoading} onSubmit={handleUploadVideoFormSubmit} />
    </Box>
  )
}
export default withAuth(UploadVideoPage)
