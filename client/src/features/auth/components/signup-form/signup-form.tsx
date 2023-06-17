import { Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { SignupFormData, SignupSchema } from '@/features/auth/schemas/signup'

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void
  isSubmitting?: boolean
}
export const SignupForm = ({ onSubmit, isSubmitting }: SignupFormProps) => {
  const form = useForm<SignupFormData>({
    initialValues: {
      useranme: '',
      email: '',
      password: '',
    },
    validate: zodResolver(SignupSchema),
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label='Username'
        placeholder='Enter your username'
        withAsterisk
        {...form.getInputProps('useranme')}
      />
      <TextInput
        label='Email Address'
        placeholder='Enter your email'
        withAsterisk
        {...form.getInputProps('email')}
      />
      <TextInput
        label='Password'
        placeholder='Enter your password'
        withAsterisk
        {...form.getInputProps('password')}
      />
      <Button disabled={!form.isValid()} loading={isSubmitting} type='submit'>
        Sign up
      </Button>
    </form>
  )
}
