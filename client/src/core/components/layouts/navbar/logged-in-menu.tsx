import { Button, Menu } from '@mantine/core'
import { IconCast, IconList, IconLogout, IconUpload, IconUser } from '@tabler/icons-react'
import Link from 'next/link'

import { useUserChannel } from '@/features/channel/hooks/use-user-channel'

export const LoggedInMenu = () => {
  const { data: userChannel } = useUserChannel()
  return (
    <Menu position='bottom-end' width={200}>
      <Menu.Target>
        <Button>Profile</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Profile</Menu.Label>
        <Menu.Item component={Link} href='/channel/my-channel' icon={<IconCast />}>
          My channel
        </Menu.Item>
        {userChannel ? (
          <Menu.Item component={Link} href='/video/upload-video' icon={<IconUpload />}>
            Upload video
          </Menu.Item>
        ) : null}
        <Menu.Item icon={<IconList />}>Subscriptions</Menu.Item>
        <Menu.Item icon={<IconUser />}>Profile</Menu.Item>
        <Menu.Divider />
        <Menu.Item color='red' icon={<IconLogout />}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
