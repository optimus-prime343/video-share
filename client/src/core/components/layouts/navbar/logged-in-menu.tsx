import { Button, Menu } from '@mantine/core'
import { IconCast, IconList, IconLogout, IconUser } from '@tabler/icons-react'

export const LoggedInMenu = () => {
  return (
    <Menu position='bottom-end' width={200}>
      <Menu.Target>
        <Button>Profile</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Profile</Menu.Label>
        <Menu.Item icon={<IconCast />}>My channel</Menu.Item>
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
