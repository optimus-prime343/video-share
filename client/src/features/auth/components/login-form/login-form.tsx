import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback } from 'react'

import { LoginFormData, LoginSchema } from '@/features/auth/schemas/login'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isSubmitting?: boolean
}

export function LoginForm({ onSubmit: onSubmitProp, isSubmitting }: LoginFormProps) {
  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(LoginSchema),
  })

  const handleSubmit = useCallback(onSubmitProp, [onSubmitProp])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label='Email address'
          placeholder='Enter your email address'
          withAsterisk
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label='Password'
          placeholder='Enter your password'
          withAsterisk
          {...form.getInputProps('password')}
        />
        <Button disabled={!form.isValid()} loading={isSubmitting} type='submit'>
          Login
        </Button>
      </Stack>
    </form>
  )
}
