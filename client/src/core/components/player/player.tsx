import type { PlayerProps as VimePlayerProps } from '@vime/react'
import { DefaultUi, Player as VimePlayer, Video } from '@vime/react'
import type { ReactNode } from 'react'
import { forwardRef, memo } from 'react'

export interface PlayerProps extends Partial<VimePlayerProps> {
  src: string
  poster?: string
  children?: ReactNode
}
const Player_ = forwardRef<HTMLVmPlayerElement, PlayerProps>((props, ref) => {
  const { src, poster, children, ...rest } = props

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
