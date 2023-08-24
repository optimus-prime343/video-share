import { Tabs } from '@mantine/core'
import { IconHome, IconInfoCircle } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React from 'react'

import type { ChannelDetail } from '../../schemas/channel'
import { ChannelAboutPanel } from './channel-about-panel'
import { ChannelHomePanel } from './channel-home-panel'

export interface ChannelTabsProps {
  channel: ChannelDetail
}
export const ChannelTabs = ({ channel }: ChannelTabsProps) => {
  const router = useRouter()
  return (
    <Tabs
      onTabChange={value =>
        router.push({ pathname: `/channel/${channel.id}`, query: { activeTab: value } })
      }
      value={(router.query.activeTab as string) ?? 'home'}
    >
      <Tabs.List>
        <Tabs.Tab icon={<IconHome />} value='home'>
          Home
        </Tabs.Tab>
        <Tabs.Tab icon={<IconInfoCircle />} value='about'>
          About
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='home'>
        <ChannelHomePanel channel={channel} />
      </Tabs.Panel>
      <Tabs.Panel value='about'>
        <ChannelAboutPanel channel={channel} />
      </Tabs.Panel>
    </Tabs>
  )
}
