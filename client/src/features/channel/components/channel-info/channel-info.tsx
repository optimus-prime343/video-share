import { createStyles, Group, Text } from '@mantine/core'
import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'

import { formatCount } from '@/core/utils/count'
import { pluralize } from '@/core/utils/pluralize'

import type { ChannelDetail } from '../../schemas/channel'

export interface ChannelInfoProps {
  channel: ChannelDetail
}
export const ChannelInfo = ({ channel }: ChannelInfoProps) => {
  const { classes } = useStyles()
  return (
    <div className={classes.root}>
      <Group>
        <Image
          alt={channel.name}
          height={120}
          src={channel.avatar}
          style={{ objectFit: 'cover', borderRadius: '50%' }}
          width={120}
        />
        <div>
          <Text fw='bold' size='lg'>
            {channel.name}
          </Text>
          <Text>
            {formatCount(channel.totalSubscribers)}{' '}
            {pluralize('Subscriber', channel.totalSubscribers)}
          </Text>
          <Text>Joined on {dayjs(channel.createdAt).format('ll')}</Text>
        </div>
      </Group>
    </div>
  )
}
const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
    borderRadius: theme.radius.md,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))
