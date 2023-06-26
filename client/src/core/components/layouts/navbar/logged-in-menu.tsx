import { Avatar, Menu } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { IconCast, IconList, IconLogout, IconUpload, IconUser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useCallback } from 'react'

import { useLogout } from '@/features/auth/hooks/use-logout'
import { USER_QUERY_KEY, useUser } from '@/features/auth/hooks/use-user'
import { useUserChannel } from '@/features/channel/hooks/use-user-channel'

export const LoggedInMenu = () => {
  const queryClient = useQueryClient()
  const { data: userChannel } = useUserChannel()
  const { data: user } = useUser()

  const logout = useLogout()

  const openConfirmLogoutModal = useCallback(() => {
    openConfirmModal({
      title: 'Log out',
      children: 'Are you sure you want to log out?',
      labels: {
        confirm: 'Log out',
        cancel: 'Cancel',
      },
      confirmProps: {
        loading: logout.isLoading,
      },
      onConfirm: () => {
        logout.mutate(undefined, {
          onSuccess: async () => {
            await queryClient.invalidateQueries(USER_QUERY_KEY)
          },
        })
      },
    })
  }, [logout, queryClient])

  if (!user) return null
  return (
    <Menu position='bottom-end' width={200}>
      <Menu.Target>
        <Avatar alt={`${user.username} profile`} radius='xl' src={user.image} />
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
        <Menu.Item color='red' icon={<IconLogout />} onClick={openConfirmLogoutModal}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
