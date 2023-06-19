import '@vime/core/themes/default.css'

import {
  Avatar,
  Button,
  createStyles,
  Group,
  Paper,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core'
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
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { InfiniteScroll } from '@/core/components/infinite-scroll'
import { Player } from '@/core/components/player'
import { formatCount } from '@/core/utils/count'
import { pluralize } from '@/core/utils/pluralize'
import { CommentForm } from '@/features/comment/components/comment-form/comment-form'
import { CommentItem } from '@/features/comment/components/comment-item'
import { useComments } from '@/features/comment/hooks/use-comments'
import { SuggestedVideoItem } from '@/features/video/components/suggested-video-item'
import { useDislikeVideo } from '@/features/video/hooks/use-dislike-video'
import { useLikeVideo } from '@/features/video/hooks/use-like-video'
import { useSuggestedVideos } from '@/features/video/hooks/use-suggested-videos'
import { useUpdateViewCount } from '@/features/video/hooks/use-update-view-count'
import { useVideoDetail } from '@/features/video/hooks/use-video-detail'
import { useVideoLikedDislikedStatus } from '@/features/video/hooks/use-video-liked-disliked-status'

const WatchPage = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { classes } = useStyles()

  const playerRef = useRef<HTMLVmPlayerElement | null>(null)
  const videoId = useMemo(() => router.query?.id as string | undefined, [router.query?.id])

  const { data: videoDetail } = useVideoDetail(videoId)
  const {
    data: suggestedVideosPages,
    hasNextPage: hasSuggestedVideosNextPage,
    isFetchingNextPage: isFetchingSuggestedVideosNextPage,
    fetchNextPage: fetchNextSuggestedVideosPage,
  } = useSuggestedVideos(videoId, videoDetail?.category?.id)

  const {
    data: commentsPages,
    hasNextPage: hasCommentsNextPage,
    isFetchingNextPage: isFetchingCommentsNextPage,
    fetchNextPage: fetchNextCommentsPage,
  } = useComments(videoId)

  const { data: videoLikedDislikedStatus } = useVideoLikedDislikedStatus(videoId)

  const updateViewCount = useUpdateViewCount()
  const likeVideo = useLikeVideo()
  const dislikeVideo = useDislikeVideo()

  const suggestedVideos = useMemo(
    () => suggestedVideosPages?.pages?.flatMap(page => page.videos) ?? [],
    [suggestedVideosPages?.pages]
  )

  const comments = useMemo(
    () => commentsPages?.pages?.flatMap(page => page.comments) ?? [],
    [commentsPages?.pages]
  )

  const sharedTimeStamp = useMemo<number>(() => {
    const timeString = router.query?.time as string | undefined
    if (!timeString) return 0
    if (isNaN(+timeString)) return 0
    return +timeString
  }, [router.query?.time])

  const handleLikeVideo = useCallback(() => {
    if (!videoId) return
    likeVideo.mutate(videoId, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['video-liked-disliked-status', videoId]),
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
          queryClient.invalidateQueries(['video-liked-disliked-status', videoId]),
          queryClient.invalidateQueries(['video', videoId]),
        ])
      },
    })
  }, [dislikeVideo, queryClient, videoId])

  const handleDownloadVideo = useCallback(() => {
    if (!videoDetail) return
    fetch(videoDetail.url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', videoDetail.title)
        link.click()
        URL.revokeObjectURL(url)
      })
  }, [videoDetail])

  const handleShareVideo = useCallback(() => {
    if (!videoDetail) return
    if (!playerRef.current) return

    const currentTime = playerRef.current.currentTime
    const url = new URL(window.location.href)
    url.searchParams.set('id', videoDetail.id)
    if (currentTime > 0) url.searchParams.set('time', currentTime.toFixed(0))
    const shareData: ShareData = {
      title: videoDetail.title,
      text: videoDetail.description,
      url: url.toString(),
    }

    if (!navigator.canShare(shareData)) return alert('Your browser does not support sharing')
    navigator.share(shareData).catch(error => console.error('Error sharing', error))
  }, [videoDetail])

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
          <Player
            currentTime={sharedTimeStamp}
            poster={videoDetail.thumbnail}
            ref={playerRef}
            videoId={videoId}
          />
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
                  leftIcon={
                    videoLikedDislikedStatus?.isLiked ? <IconThumbUpFilled /> : <IconThumbUp />
                  }
                  onClick={handleLikeVideo}
                  variant='light'
                >
                  {formatCount(videoDetail.likes)}
                </Button>
                <Button
                  leftIcon={
                    videoLikedDislikedStatus?.isDisliked ? (
                      <IconThumbDownFilled />
                    ) : (
                      <IconThumbDown />
                    )
                  }
                  onClick={handleDislikeVideo}
                  variant='light'
                >
                  {formatCount(videoDetail.dislikes)}
                </Button>
              </Button.Group>
              <Button leftIcon={<IconShare />} onClick={handleShareVideo} variant='light'>
                Share
              </Button>
              <Button
                leftIcon={<IconDownload />}
                onClick={handleDownloadVideo}
                variant='light'
              >
                Download
              </Button>
            </Group>
          </Group>
          <Paper className={classes.videoDescription}>
            <Text fw='bold'>
              {formatCount(videoDetail.views)} {pluralize('View', videoDetail.views)} •{' '}
              {dayjs(videoDetail.createdAt).fromNow()}{' '}
            </Text>
            {videoDetail.description ? (
              <Spoiler hideLabel='Show less' maxHeight={80} showLabel='Show more'>
                <Text>{parse(videoDetail.description)}</Text>{' '}
              </Spoiler>
            ) : null}
          </Paper>
          {videoId ? <CommentForm videoId={videoId} /> : null}
          <Title order={4}>
            {formatCount(commentsPages?.pages.at(0)?.count ?? 0)}{' '}
            {pluralize('Comment', commentsPages?.pages.at(0)?.count ?? 0)}
          </Title>
          <InfiniteScroll
            as={Stack}
            fetchNextPage={fetchNextCommentsPage}
            hasNextPage={hasCommentsNextPage}
            isFetchingNextPage={isFetchingCommentsNextPage}
            items={comments}
            renderItem={comment => <CommentItem comment={comment} />}
            spacing='xl'
          />
        </Stack>
        <InfiniteScroll
          as={Stack}
          fetchNextPage={fetchNextSuggestedVideosPage}
          hasNextPage={hasSuggestedVideosNextPage}
          isFetchingNextPage={isFetchingSuggestedVideosNextPage}
          items={suggestedVideos}
          renderItem={video => <SuggestedVideoItem video={video} />}
        />
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
