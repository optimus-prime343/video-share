import type { ComponentProps } from 'react'
import React from 'react'

interface VideoPlayerHoverProps extends ComponentProps<'video'> {
  src: string
}
export const VideoPlayerHover = ({ src, ...rest }: VideoPlayerHoverProps) => {
  return (
    <video autoPlay controls height={300} muted {...rest}>
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  )
}
