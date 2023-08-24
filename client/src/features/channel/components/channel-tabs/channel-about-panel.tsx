import { Box, Text } from '@mantine/core'
import parse from 'html-react-parser'

import { formatCount } from '@/core/utils/count'
import { pluralize } from '@/core/utils/pluralize'

import type { ChannelDetail } from '../../schemas/channel'

export interface ChannelAboutPanelProps {
  channel: ChannelDetail
}
export const ChannelAboutPanel = ({ channel }: ChannelAboutPanelProps) => {
  return (
    <Box>
      <Text>{parse(channel.description ?? '')}</Text>
      <Text>
        {formatCount(channel.totalViews)} {pluralize('View', channel.totalViews)}
      </Text>
    </Box>
  )
}
