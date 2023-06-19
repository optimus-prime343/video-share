import {
  DefaultUi,
  Player as VimePlayer,
  PlayerProps as VimePlayerProps,
  Video,
} from '@vime/react'
import assert from 'assert'
import { forwardRef, memo, ReactNode, useMemo } from 'react'

export interface PlayerProps extends Partial<VimePlayerProps> {
  videoId: string
  poster?: string
  children?: ReactNode
}
const Player_ = forwardRef<HTMLVmPlayerElement, PlayerProps>((props, ref) => {
  const { videoId, poster, children, ...rest } = props
  const apiUrl = process.env.NEXT_PUBLIC_API_REQUEST_URL
  assert(apiUrl, 'NEXT_PUBLIC_API_REQUEST_URL is not defined')
  const src = useMemo(() => `${apiUrl}/video/watch/${videoId}`, [apiUrl, videoId])

  return (
    // @ts-expect-error Types of property '"audioTracks"' are incompatible. Only a typescript master can solve this error
    <VimePlayer ref={ref} {...rest}>
      <Video crossOrigin='' poster={poster}>
        <source data-src={src} type='video/mp4' />
        <track default kind='subtitles' label='English' src={src} srcLang='en' />
      </Video>
      <DefaultUi>{children}</DefaultUi>
    </VimePlayer>
  )
})
Player_.displayName = 'Player'

export const Player = memo(Player_)
