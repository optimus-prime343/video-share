import { Tabs } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconUser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { AuthForm } from '@/features/auth/components/login-form'
import { useLogin } from '@/features/auth/hooks/use-login'
import { useSignup } from '@/features/auth/hooks/use-signup'
import { USER_QUERY_KEY } from '@/features/auth/hooks/use-user'
import { AuthData } from '@/features/auth/schemas/login'

const LOGIN_TAB_VALUE = 'login'
const SIGN_UP_TAB_VALUE = 'sign-up'

export interface AuthModalProps {
  onAuthSuccess: (message: string) => void
}

export const AuthModal = ({ onAuthSuccess }: AuthModalProps) => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<string | null>(LOGIN_TAB_VALUE)

  const login = useLogin()
  const signUp = useSignup()

  const onLoginFormSubmit = useCallback(
    (data: AuthData) => {
      login.mutate(data, {
        onSuccess: async ({ message }) => {
          await queryClient.invalidateQueries(USER_QUERY_KEY)
          onAuthSuccess(message)
        },
        onError: error => {
          showNotification({
            title: 'Login failed',
            message: error.message,
            color: 'red',
          })
        },
      })
    },
    [login, onAuthSuccess, queryClient]
  )
  const onSignUpFormSubmit = useCallback(
    (data: AuthData) => {
      signUp.mutate(data, {
        onSuccess: ({ message }) => {
          showNotification({
            title: 'Sign up success',
            message,
            color: 'green',
          })
          onAuthSuccess(message)
        },
        onError: error => {
          showNotification({
            title: 'Sign up failed',
            message: error.message,
            color: 'red',
          })
        },
      })
    },
    [onAuthSuccess, signUp]
  )

  return (
    <Tabs onTabChange={setActiveTab} value={activeTab}>
      <Tabs.List grow>
        <Tabs.Tab icon={<IconUser />} value={LOGIN_TAB_VALUE}>
          Log In
        </Tabs.Tab>
        <Tabs.Tab value={SIGN_UP_TAB_VALUE}>Sign Up</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel mt='md' value={LOGIN_TAB_VALUE}>
        <AuthForm isSubmitting={login.isLoading} mode='login' onSubmit={onLoginFormSubmit} />
      </Tabs.Panel>
      <Tabs.Panel mt='md' value={SIGN_UP_TAB_VALUE}>
        <AuthForm
          isSubmitting={signUp.isLoading}
          mode='sign-up'
          onSubmit={onSignUpFormSubmit}
        />
      </Tabs.Panel>
    </Tabs>
  )
}
