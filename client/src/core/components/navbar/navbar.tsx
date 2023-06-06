import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core'
import { IconMenu2, IconMoon, IconSearch, IconSun, IconUser } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

const isSignedIn = false

export const Navbar = () => {
  const { classes } = useStyles()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  return (
    <header className={classes.header}>
      <nav className={classes.navbar}>
        <Group>
          <ActionIcon>
            <IconMenu2 />
          </ActionIcon>
          <Link href='/'>
            <Image
              alt='Logo'
              height={30}
              src={colorScheme === 'dark' ? '/images/logo_dark.png' : '/images/logo_light.png'}
              width={140}
            />
          </Link>
        </Group>
        <TextInput
          icon={<IconSearch />}
          miw='600px'
          placeholder='Search videos'
          radius='xl'
          size='md'
        />
        <ul className={classes.navbarItems}>
          {isSignedIn ? null : (
            <Button
              component={Link}
              href='/auth/login'
              leftIcon={<IconUser />}
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
