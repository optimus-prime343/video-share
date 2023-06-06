import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback } from 'react'

import { AuthData, AuthSchema } from '@/features/auth/schemas/login'

export interface AuthFormProps {
  mode: 'login' | 'sign-up'
  onSubmit: (data: AuthData) => void
  isSubmitting?: boolean
}

export function AuthForm({ onSubmit: onSubmitProp, isSubmitting, mode }: AuthFormProps) {
  const { getInputProps, onSubmit } = useForm<AuthData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(AuthSchema),
  })

  const handleSubmit = useCallback(onSubmitProp, [onSubmitProp])

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label='Email address'
          placeholder='Enter your email address'
          withAsterisk
          {...getInputProps('email')}
        />
        <PasswordInput
          label='Password'
          placeholder='Enter your password'
          withAsterisk
          {...getInputProps('password')}
        />
        <Button loading={isSubmitting} type='submit'>
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </Button>
      </Stack>
    </form>
  )
}
