import { AspectRatio, Badge, Divider, Stack, Text } from '@mantine/core'
import Image from 'next/image'
import React, { useMemo } from 'react'

import { ONE_MB_IN_BYTES } from '@/core/constants/numbers'
import { IMAGE_FILE_REGEX, VIDEO_FILE_REGEX } from '@/core/constants/regex'

interface FileInfoProps {
  file: File
}
export const FileInfo = ({ file }: FileInfoProps) => {
  const size = useMemo<string>(() => {
    const sizeInMB = file.size / ONE_MB_IN_BYTES
    return `${sizeInMB.toFixed(2)} MB`
  }, [file.size])
  return (
    <div>
      <AspectRatio ratio={16 / 9}>
        {IMAGE_FILE_REGEX.test(file.name) && (
          <Image alt={file.name} fill src={URL.createObjectURL(file)} />
        )}
        {VIDEO_FILE_REGEX.test(file.name) && (
          <video autoPlay controls>
            <source src={URL.createObjectURL(file)} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}
      </AspectRatio>
      <Divider my='md' />
      <Stack align='flex-start' spacing='xs'>
        <Text>{file.name}</Text>
        <Text>{size}</Text>
        <Badge>{file.type}</Badge>
      </Stack>
    </div>
  )
}
