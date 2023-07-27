import { LoadingOverlay } from '@mantine/core'
import { useRouter } from 'next/router'
import type { ComponentPropsWithoutRef, ComponentType } from 'react'

import { useUser } from '@/features/auth/hooks/use-user'

export const withAuth =
  // eslint-disable-next-line react/display-name
  (Component: ComponentType) => (props: ComponentPropsWithoutRef<typeof Component>) => {
    const { data: user, isLoading: isUserLoading } = useUser()
    const router = useRouter()
    if (isUserLoading) {
      return <LoadingOverlay inset={0} pos='fixed' visible={isUserLoading} />
    }
    if (!user) {
      router.push({
        pathname: '/',
        query: {
          'show-auth-dialog': 'true',
          next: router.asPath,
        },
      })
      return null
    }
    return <Component {...props} />
  }
