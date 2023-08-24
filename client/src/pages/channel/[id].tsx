import { AspectRatio, Stack } from '@mantine/core'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { ChannelInfo } from '@/features/channel/components/channel-info'
import { ChannelTabs } from '@/features/channel/components/channel-tabs'
import { useChannelDetail } from '@/features/channel/hooks/use-channel-detail'

const ChannelDetailsPage = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { data: channel } = useChannelDetail(id)
  if (!channel) return <div>Channel not found</div>
  return (
    <>
      <AspectRatio mah={250} ratio={16 / 9}>
        <Image
          alt={channel.name}
          fill
          src={channel.thumbnail}
          style={{ objectFit: 'cover' }}
        />
      </AspectRatio>
      <Stack p='md'>
        <ChannelInfo channel={channel} />
        <ChannelTabs channel={channel} />
      </Stack>
    </>
  )
}
export default ChannelDetailsPage
