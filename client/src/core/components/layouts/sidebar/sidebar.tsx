import { createStyles, Divider, Text } from '@mantine/core'
import {
  IconBooks,
  IconBroadcast,
  IconClock,
  IconHistory,
  IconHome,
  IconSettings,
  IconThumbUp,
  IconVideo,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useCallback } from 'react'

interface SideBarItem {
  title: string
  icon: React.ReactNode
  href: string
}

const sidebarItems: Record<number, SideBarItem[]> = {
  1: [
    {
      title: 'Home',
      icon: <IconHome />,
      href: '/',
    },
    {
      title: 'Live Videos',
      icon: <IconBroadcast color='red' />,
      href: '/live-videos',
    },
  ],
  2: [
    {
      title: 'Library',
      icon: <IconBooks />,
      href: '/library',
    },
    {
      title: 'History',
      icon: <IconHistory />,
      href: '/history',
    },
    {
      title: 'Your videos',
      icon: <IconVideo />,
      href: '/your-videos',
    },
    {
      title: 'Watch later',
      icon: <IconClock />,
      href: '/watch-later',
    },
    {
      title: 'Liked videos',
      icon: <IconThumbUp />,
      href: '/liked-videos',
    },
  ],
  3: [
    {
      title: 'Settings',
      icon: <IconSettings />,
      href: '/settings',
    },
  ],
}

export const SideBar = () => {
  const { classes } = useStyles()
  const renderSideBarItems = useCallback(() => {
    const renderedItems = Object.entries(sidebarItems).map(([key, items], index) => {
      const showDivider = Object.keys(sidebarItems).length - 1 !== index
      return (
        <ul className={classes.sideBarItems} key={key}>
          {items.map((item, index) => {
            return (
              <li className={classes.listItem} key={index}>
                <Link className={classes.sideBarItem} href={item.href}>
                  {item.icon}
                  <Text>{item.title}</Text>
                </Link>
              </li>
            )
          })}
          {showDivider ? (
            <li className={classes.listItem}>
              <Divider my='md' />
            </li>
          ) : null}
        </ul>
      )
    })
    return (
      <>
        <ul className={classes.sideBarItems}>{renderedItems}</ul>
      </>
    )
  }, [classes.listItem, classes.sideBarItem, classes.sideBarItems])
  return <ul className={classes.sideBarItems}>{renderSideBarItems()}</ul>
}

const useStyles = createStyles(theme => ({
  listItem: {
    listStyleType: 'none',
  },
  sideBarItems: {
    padding: 0,
  },
  sideBarItem: {
    display: 'flex',
    gap: theme.spacing.md,
    width: '100%',
    listStyle: 'none',
    paddingInline: theme.spacing.md,
    paddingBlock: theme.spacing.md,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}))
