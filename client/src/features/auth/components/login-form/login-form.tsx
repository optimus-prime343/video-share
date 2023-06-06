import { Button, Paper, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useCallback } from 'react'

import { LoginData, LoginSchema } from '@/features/auth/schemas/login'

export function LoginForm() {
  const { getInputProps, onSubmit } = useForm<LoginData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(LoginSchema),
  })

  const handleSubmit = useCallback((data: LoginData) => {
    console.log(data)
  }, [])

  return (
    <Paper p='md' shadow='xs'>
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
          <Button type='submit'>Login</Button>
        </Stack>
      </form>
    </Paper>
  )
}
