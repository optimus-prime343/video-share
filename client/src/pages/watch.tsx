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
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
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
import { useRequiresLogin } from '@/core/hooks/use-requires-login'
import { formatCount } from '@/core/utils/count'
import { pluralize } from '@/core/utils/pluralize'
import { useUser } from '@/features/auth/hooks/use-user'
import { useSubscribersCount } from '@/features/channel/hooks/use-subscribers-count'
import { CommentForm } from '@/features/comment/components/comment-form/comment-form'
import { CommentItem } from '@/features/comment/components/comment-item'
import { useComments } from '@/features/comment/hooks/use-comments'
import { useCreateHistory } from '@/features/history/hooks/use-create-history'
import { useCheckSubscriptionStatus } from '@/features/subscription/hooks/use-check-subscription-status'
import { useSubscribe } from '@/features/subscription/hooks/use-subscribe'
import { useUnsubscribe } from '@/features/subscription/hooks/use-unsubscribe'
import { VideoDetailSkeleton } from '@/features/video/components/video-detail-skeleton'
import { VideoItem } from '@/features/video/components/video-item'
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

  const { data: videoDetail, isLoading: isVideoDetailLoading } = useVideoDetail(videoId)
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

  const { data: user } = useUser()
  const { data: videoLikedDislikedStatus } = useVideoLikedDislikedStatus(videoId)
  const { data: subscriptionStatus } = useCheckSubscriptionStatus(videoDetail?.channel?.id)
  const { data: subscribersCount } = useSubscribersCount(videoDetail?.channel?.id)

  const requiresLogin = useRequiresLogin()
  const updateViewCount = useUpdateViewCount()
  const likeVideo = useLikeVideo()
  const dislikeVideo = useDislikeVideo()
  const subscribe = useSubscribe()
  const unsubscribe = useUnsubscribe()
  const createHistory = useCreateHistory()

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

  const handleUnsubscribe = useCallback(() => {
    if (!videoDetail) return
    openConfirmModal({
      title: 'Unsubscribe',
      children: `Are you sure you want to unsubscribe from ${videoDetail.channel.name}?`,
      labels: {
        cancel: 'Cancel',
        confirm: 'Unsubscribe',
      },
      onConfirm: () => {
        unsubscribe.mutate(videoDetail.channel.id, {
          onSuccess: async () => {
            await Promise.all([
              queryClient.invalidateQueries([
                'subscription',
                'status',
                videoDetail.channel.id,
                user?.id,
              ]),
              queryClient.invalidateQueries(['subscribers-count', videoDetail.channel.id]),
            ])
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
    })
  }, [queryClient, unsubscribe, user?.id, videoDetail])

  const handleSubscribe = useCallback(() => {
    if (!videoDetail) return
    if (subscriptionStatus?.status === 'subscribed') return handleUnsubscribe()
    subscribe.mutate(videoDetail.channel.id, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([
            'subscription',
            'status',
            videoDetail.channel.id,
            user?.id,
          ]),
          queryClient.invalidateQueries(['subscribers-count', videoDetail.channel.id]),
        ])
      },
      onError: error => {
        showNotification({
          title: 'Error',
          message: error.message,
          color: 'red',
        })
      },
    })
  }, [
    handleUnsubscribe,
    queryClient,
    subscribe,
    subscriptionStatus?.status,
    user?.id,
    videoDetail,
  ])

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

  useEffect(() => {
    if (!videoId) return
    if (!user) return
    const onRouteChangeStart = () =>
      createHistory.mutate(
        { videoId, timestamp: playerRef.current?.currentTime ?? 0 },
        {
          onSuccess: ({ data }) => {
            console.log('History created', data)
          },
        }
      )

    router.events.on('routeChangeStart', onRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [createHistory, router.events, videoId])

  if (isVideoDetailLoading) return <VideoDetailSkeleton />
  if (!videoDetail) return <p>Video not found</p> //TODO UPDATE UI

  return (
    <div className={classes.container}>
      <div className={classes.videoContainer}>
        <Stack>
          <Player
            currentTime={sharedTimeStamp}
            poster={videoDetail.thumbnail}
            ref={playerRef}
            src={videoDetail.url}
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
                <Text>
                  {formatCount(subscribersCount ?? 0)}{' '}
                  {pluralize('Subscriber', subscribersCount ?? 0)}
                </Text>
              </div>
              {videoDetail.channel.userId !== user?.id ? (
                <Button
                  loading={subscribe.isLoading}
                  onClick={requiresLogin(handleSubscribe)}
                  variant={subscriptionStatus?.status === 'subscribed' ? 'outline' : 'filled'}
                >
                  {subscriptionStatus?.status === 'subscribed' ? 'Subscribed' : 'Subscribe'}
                </Button>
              ) : null}
            </Group>
            <Group>
              <Button.Group>
                <Button
                  leftIcon={
                    videoLikedDislikedStatus?.isLiked ? <IconThumbUpFilled /> : <IconThumbUp />
                  }
                  onClick={requiresLogin(handleLikeVideo)}
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
                  onClick={requiresLogin(handleDislikeVideo)}
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
            hasMore={hasCommentsNextPage}
            isLoadingMore={isFetchingCommentsNextPage}
            onLoadMore={() => fetchNextCommentsPage()}
          >
            <Stack spacing='lg'>
              {comments.map(comment => (
                <CommentItem comment={comment} key={comment.id} />
              ))}
            </Stack>
          </InfiniteScroll>
        </Stack>
        <InfiniteScroll
          hasMore={hasSuggestedVideosNextPage}
          isLoadingMore={isFetchingSuggestedVideosNextPage}
          onLoadMore={() => fetchNextSuggestedVideosPage()}
        >
          <Stack spacing='lg'>
            {suggestedVideos.map(suggestedVideo => (
              <VideoItem display='row' key={suggestedVideo.id} video={suggestedVideo} />
            ))}
          </Stack>
        </InfiniteScroll>
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
