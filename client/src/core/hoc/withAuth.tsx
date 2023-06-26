import { LoadingOverlay } from '@mantine/core'
import { useRouter } from 'next/router'
import type { ComponentPropsWithoutRef, ComponentType } from 'react'

import { useUser } from '@/features/auth/hooks/use-user'

export const withAuth =
  // eslint-disable-next-line react/display-name
  (Component: ComponentType) => (props: ComponentPropsWithoutRef<typeof Component>) => {
    const user = useUser()
    const router = useRouter()
    if (user.isLoading) {
      return <LoadingOverlay inset={0} pos='fixed' visible={user.isLoading} />
    }
    if (!user.data) {
      router.push({
        pathname: '/',
        query: {
          next: router.asPath,
        },
      })
      return null
    }
    return <Component {...props} />
  }
