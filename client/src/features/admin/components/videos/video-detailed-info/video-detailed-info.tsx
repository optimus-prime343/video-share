import { AspectRatio, Badge, Divider, Group, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import parse from 'html-react-parser'
import Image from 'next/image'

import { pluralize } from '@/core/utils/pluralize'
import type { Video } from '@/features/video/schemas/video'

export interface VideoDetailedInfoProps {
  video: Video
}
export const VideoDetailedInfo = ({ video }: VideoDetailedInfoProps) => {
  return (
    <div>
      <div>
        <Title order={4}>Title</Title>
        <Text>{video.title}</Text>
      </div>
      <Divider my='sm' />
      <div>
        <Title order={4}>Description</Title>
        <Text>{parse(video.description ?? '')}</Text>
      </div>
      <Divider my='sm' />
      <div>
        <Title mb='md' order={4}>
          Thumbnail
        </Title>
        <AspectRatio ratio={16 / 9}>
          <Image alt={video.title} fill src={video.thumbnail} />
        </AspectRatio>
      </div>
      <Divider my='sm' />
      <div>
        <Title mb='md' order={4}>
          Video
        </Title>
        <AspectRatio ratio={16 / 9}>
          <video controls>
            <source src={video.url} type='video/mp4' />
          </video>
        </AspectRatio>
      </div>
      <Divider my='sm' />
      <div>
        <Title order={4}>Category</Title>
        <Badge>{video.category.name}</Badge>
      </div>
      <Divider my='sm' />
      <div>
        <Title order={4}>Status</Title>
        <Badge>{video.status}</Badge>
      </div>
      <Divider my='sm' />
      <div>
        <Title order={4}>Uploaded By</Title>
        <Text>{video.channel.name}</Text>
      </div>
      <Divider my='sm' />
      <Group>
        <Badge>
          {video.views} {pluralize('View', video.views)}
        </Badge>
        <Badge>
          {video.likes} {pluralize('Like', video.likes)}
        </Badge>
        <Badge>
          {video.dislikes} {pluralize('Dislike', video.dislikes)}
        </Badge>
      </Group>
      <Divider my='sm' />
      <div>
        <Title order={4}>Created At</Title>
        <Text>{dayjs(video.createdAt).format('llll')}</Text>
      </div>
    </div>
  )
}
