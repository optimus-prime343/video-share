import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback } from 'react'

import { LoginFormData, LoginSchema } from '@/features/auth/schemas/login'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isSubmitting?: boolean
}

export function LoginForm({ onSubmit: onSubmitProp, isSubmitting }: LoginFormProps) {
  const { getInputProps, onSubmit } = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(LoginSchema),
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
          Login
        </Button>
      </Stack>
    </form>
  )
}
