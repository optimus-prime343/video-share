import '@vime/core/themes/default.css'

import { Avatar, Button, createStyles, Group, Paper, Stack, Text, Title } from '@mantine/core'
import {
  IconDownload,
  IconShare,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'

import Player from '@/core/components/player/player'
import SuggestedVideoList from '@/features/video/components/suggested-video-list/suggested-video-list'
import { useDislikeVideo } from '@/features/video/hooks/use-dislike-video'
import { useIsVideoDisliked } from '@/features/video/hooks/use-is-video-disliked'
import { useIsVideoLiked } from '@/features/video/hooks/use-is-video-liked'
import { useLikeVideo } from '@/features/video/hooks/use-like-video'
import { useSuggestedVideos } from '@/features/video/hooks/use-suggested-videos'
import { useUpdateViewCount } from '@/features/video/hooks/use-update-view-count'
import { useVideoDetail } from '@/features/video/hooks/use-video-detail'

const WatchPage = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { classes } = useStyles()
  const videoId = router.query?.id as string | undefined

  const { data: videoDetail } = useVideoDetail(videoId)
  const { data: suggestedVideosPages } = useSuggestedVideos(videoId, videoDetail?.category?.id)
  const { data: isVideoLiked } = useIsVideoLiked(videoId)
  const { data: isVideoDisliked } = useIsVideoDisliked(videoId)

  const updateViewCount = useUpdateViewCount()
  const likeVideo = useLikeVideo()
  const dislikeVideo = useDislikeVideo()

  const suggestedVideos = useMemo(
    () => suggestedVideosPages?.pages?.flatMap(page => page.videos) ?? [],
    [suggestedVideosPages?.pages]
  )

  const handleLikeVideo = useCallback(() => {
    if (!videoId) return
    likeVideo.mutate(videoId, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['is-video-disliked', videoId]),
          queryClient.invalidateQueries(['is-video-liked', videoId]),
          queryClient.invalidateQueries(['video', videoId]),
        ])
      },
    })
  }, [likeVideo, queryClient, videoId])

  const handleDislikeVideo = useCallback(() => {
    if (!videoId) return
    dislikeVideo.mutate(videoId, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['is-video-disliked', videoId]),
          queryClient.invalidateQueries(['is-video-liked', videoId]),
          queryClient.invalidateQueries(['video', videoId]),
        ])
      },
    })
  }, [dislikeVideo, queryClient, videoId])

  useEffect(() => {
    if (!videoId) return
    updateViewCount.mutate(videoId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['video', videoId])
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  if (!videoDetail || !videoId) return <p>Video not found</p> //TODO UPDATE UI

  return (
    <div className={classes.container}>
      <div className={classes.videoContainer}>
        <Stack>
          <Player autoPlay poster={videoDetail.thumbnail} videoId={videoId} />
          <Group position='apart'>
            <Title order={3}>{videoDetail.title}</Title>
          </Group>
          <Group position='apart'>
            <Group>
              <Avatar radius='xl' size='lg' src={videoDetail.channel.avatar} />
              <div>
                <Text fw='bold' size='lg'>
                  {videoDetail.channel.name}
                </Text>
                <Text>0 subscribers</Text>
              </div>
              <Button>Subscribe</Button>
            </Group>
            <Group>
              <Button.Group>
                <Button
                  leftIcon={isVideoLiked ? <IconThumbUpFilled /> : <IconThumbUp />}
                  onClick={handleLikeVideo}
                  variant='light'
                >
                  {videoDetail.likes}
                </Button>
                <Button
                  leftIcon={isVideoDisliked ? <IconThumbDownFilled /> : <IconThumbDown />}
                  onClick={handleDislikeVideo}
                  variant='light'
                >
                  {videoDetail.dislikes}
                </Button>
              </Button.Group>
              <Button leftIcon={<IconShare />} variant='light'>
                Share
              </Button>
              <Button leftIcon={<IconDownload />} variant='light'>
                Download
              </Button>
            </Group>
          </Group>
          <Paper className={classes.videoDescription}>
            <Text fw='bold'>
              {videoDetail.views} Views • {dayjs(videoDetail.createdAt).fromNow()}{' '}
            </Text>
            <Text>{videoDetail.description}</Text>
          </Paper>
        </Stack>
        <div>
          <SuggestedVideoList videos={suggestedVideos} />
        </div>
      </div>
    </div>
  )
}

const useStyles = createStyles(theme => ({
  container: {
    padding: theme.spacing.md,
  },
  videoContainer: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridGap: theme.spacing.md,

    [theme.fn.smallerThan('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  video: {},
  videoDescription: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    paddingInline: theme.spacing.md,
    paddingBlock: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
}))

export default WatchPage
