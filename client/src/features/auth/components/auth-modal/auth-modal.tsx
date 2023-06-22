import { Modal, Tabs } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconUser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { LoginForm } from '@/features/auth/components/login-form'
import { SignupForm } from '@/features/auth/components/signup-form'
import { useLogin } from '@/features/auth/hooks/use-login'
import { useSignup } from '@/features/auth/hooks/use-signup'
import { USER_QUERY_KEY } from '@/features/auth/hooks/use-user'
import { LoginFormData } from '@/features/auth/schemas/login'
import { SignupFormData } from '@/features/auth/schemas/signup'
import {
  useAuthModalClose,
  useAuthModalOpened,
} from '@/features/auth/store/use-auth-modal-store'

const LOGIN_TAB_VALUE = 'login'
const SIGN_UP_TAB_VALUE = 'sign-up'

export const AuthModal = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<string | null>(LOGIN_TAB_VALUE)

  const authModalOpened = useAuthModalOpened()
  const closeAuthModal = useAuthModalClose()
  const login = useLogin()
  const signUp = useSignup()

  const onLoginFormSubmit = useCallback(
    (data: LoginFormData) => {
      login.mutate(data, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(USER_QUERY_KEY)
          closeAuthModal()
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
    [closeAuthModal, login, queryClient]
  )
  const onSignUpFormSubmit = useCallback(
    (data: SignupFormData) => {
      signUp.mutate(data, {
        onSuccess: ({ message }) => {
          showNotification({
            title: 'Sign up success',
            message,
            color: 'green',
          })
          closeAuthModal()
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
    [closeAuthModal, signUp]
  )

  return (
    <Modal
      centered
      closeOnClickOutside={false}
      onClose={closeAuthModal}
      opened={authModalOpened}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
      title='Welcome to Video Platform'
    >
      <Tabs onTabChange={setActiveTab} value={activeTab}>
        <Tabs.List grow>
          <Tabs.Tab icon={<IconUser />} value={LOGIN_TAB_VALUE}>
            Log In
          </Tabs.Tab>
          <Tabs.Tab value={SIGN_UP_TAB_VALUE}>Sign Up</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel mt='md' value={LOGIN_TAB_VALUE}>
          <LoginForm isSubmitting={login.isLoading} onSubmit={onLoginFormSubmit} />
        </Tabs.Panel>
        <Tabs.Panel mt='md' value={SIGN_UP_TAB_VALUE}>
          <SignupForm isSubmitting={signUp.isLoading} onSubmit={onSignUpFormSubmit} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )
}
