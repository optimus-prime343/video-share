import { DefaultUi, Player as VimePlayer, Video } from '@vime/react'
import assert from 'assert'
import { forwardRef, ReactNode, useMemo } from 'react'

export interface PlayerProps {
  videoId: string
  poster?: string
  autoPlay?: boolean
  controls?: boolean
  muted?: boolean
  children?: ReactNode
}
const Player = forwardRef<HTMLVmPlayerElement, PlayerProps>((props, ref) => {
  const { videoId, poster, children, ...rest } = props
  const apiUrl = process.env.NEXT_PUBLIC_API_REQUEST_URL
  assert(apiUrl, 'NEXT_PUBLIC_API_REQUEST_URL is not defined')
  const src = useMemo(() => `${apiUrl}/video/watch/${videoId}`, [apiUrl, videoId])

  return (
    <VimePlayer ref={ref} {...rest}>
      <Video crossOrigin='' poster={poster}>
        <source data-src={src} type='video/mp4' />
        <track default kind='subtitles' label='English' src={src} srcLang='en' />
      </Video>
      <DefaultUi>{children}</DefaultUi>
    </VimePlayer>
  )
})
Player.displayName = 'Player'

export default Player
