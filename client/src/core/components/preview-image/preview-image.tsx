import Image, { ImageProps } from 'next/image'
import { useMemo } from 'react'

export interface PreviewImageProps extends Omit<ImageProps, 'width' | 'height' | 'src'> {
  src?: string
  file?: File | null
  width?: number
  height?: number
}
export const PreviewImage = ({
  src,
  file,
  width = 600,
  height = 300,
  alt,
  style,
  ...rest
}: PreviewImageProps) => {
  const previewImageUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : src ?? null),
    [file, src]
  )
  return previewImageUrl ? (
    <Image
      {...rest}
      alt={alt}
      height={height}
      src={previewImageUrl}
      style={{ objectFit: 'cover', borderRadius: '8px', ...style }}
      width={width}
    />
  ) : null
}
