import { createStyles } from '@mantine/core'
import { Text } from '@mantine/core'
import {
  IconCategory,
  IconDashboard,
  IconMessage,
  IconUser,
  IconVideo,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import React, { useCallback } from 'react'

export interface AdminSideBarProps {
  children: ReactNode
}
export const AdminSideBar = ({ children }: AdminSideBarProps) => {
  const { classes, cx } = useStyles()
  const router = useRouter()

  const isActive = useCallback((href: string) => router.asPath === href, [router.asPath])

  const renderSideBarItems = useCallback(
    () =>
      ADMIN_SIDE_BAR_ITEMS.map(item => (
        <li key={item.href}>
          <Link
            className={cx(
              classes.sideBarItem,
              isActive(item.href) && classes.sideBarItemActive
            )}
            href={item.href}
          >
            {item.icon}
            <Text>{item.title}</Text>
          </Link>
        </li>
      )),
    [classes.sideBarItem, classes.sideBarItemActive, cx, isActive]
  )

  return (
    <div className={classes.container}>
      <ul className={classes.sideBarItems}>{renderSideBarItems()}</ul>
      <div>{children}</div>
    </div>
  )
}
const useStyles = createStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sideBarItems: {
    padding: 0,
    margin: 0,
    listStyleType: 'none',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    minWidth: '12rem',
  },
  sideBarItem: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    gap: theme.spacing.md,
    paddingInline: theme.spacing.md,
    paddingBlock: theme.spacing.sm,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },
  sideBarItemActive: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    color: theme.black,

    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][5],
    },
  },
}))

const ADMIN_SIDE_BAR_ITEMS = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <IconDashboard />,
  },
  {
    title: 'Users',
    href: '/admin/dashboard/users',
    icon: <IconUser />,
  },
  {
    title: 'Videos',
    href: '/admin/dashboard/videos',
    icon: <IconVideo />,
  },
  {
    title: 'Categories',
    href: '/admin/dashboard/categories',
    icon: <IconCategory />,
  },
  {
    title: 'Comments',
    href: '/admin/dashboard/comments',
    icon: <IconMessage />,
  },
] satisfies Array<{
  title: string
  href: string
  icon: ReactNode
}>
