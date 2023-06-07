import {
  ActionIcon,
  Button,
  createStyles,
  Drawer,
  Group,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { closeModal, openModal } from '@mantine/modals'
import { IconMenu2, IconMoon, IconSearch, IconSun, IconUser } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'

import { LoggedInMenu } from '@/core/components/layouts/navbar/logged-in-menu'
import { SideBar } from '@/core/components/layouts/sidebar'
import { AuthModal } from '@/features/auth/components/auth-modal'
import { useUser } from '@/features/auth/hooks/use-user'

export const Navbar = () => {
  const router = useRouter()
  const { classes } = useStyles()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [opened, { open, close }] = useDisclosure()

  const { data: user } = useUser()
  const openAuthModal = useCallback(() => {
    const authModalId = 'auth-modal'
    openModal({
      modalId: authModalId,
      title: 'Get started',
      children: <AuthModal onAuthSuccess={() => closeModal(authModalId)} />,
    })
  }, [])

  const LogoImage = useMemo(
    () => (
      <Image
        alt='Logo'
        height={30}
        src={colorScheme === 'dark' ? '/images/logo_dark.png' : '/images/logo_light.png'}
        width={140}
      />
    ),
    [colorScheme]
  )

  useEffect(() => {
    const onRouteChangeStart = () => close()
    router.events.on('routeChangeStart', onRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [close, router.events])

  return (
    <>
      <Drawer onClose={close} opened={opened} size='xs' title={LogoImage}>
        <SideBar />
      </Drawer>
      <header className={classes.header}>
        <nav className={classes.navbar}>
          <Group>
            <ActionIcon onClick={open}>
              <IconMenu2 />
            </ActionIcon>
            <Link href='/'>{LogoImage}</Link>
          </Group>
          <TextInput
            icon={<IconSearch />}
            miw='600px'
            placeholder='Search videos'
            radius='xl'
            size='md'
          />
          <ul className={classes.navbarItems}>
            {user ? (
              <LoggedInMenu />
            ) : (
              <Button
                leftIcon={<IconUser />}
                onClick={openAuthModal}
                radius='xl'
                size='md'
                variant='outline'
              >
                Log In
              </Button>
            )}
            <ActionIcon onClick={() => toggleColorScheme()}>
              {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
            </ActionIcon>
          </ul>
        </nav>
      </header>
    </>
  )
}

const useStyles = createStyles(theme => ({
  header: {
    paddingInline: theme.spacing.lg,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
  navbar: {
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbarItems: {
    // flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
}))
