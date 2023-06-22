import { useCallback } from 'react'

import { useUser } from '@/features/auth/hooks/use-user'
import { useAuthModalOpen } from '@/features/auth/store/use-auth-modal-store'

export const useRequiresLogin = <T extends (...args: unknown[]) => unknown>() => {
  const { data: user } = useUser()
  const openAuthModal = useAuthModalOpen()

  return useCallback(
    (fn: T) => {
      return user ? fn : openAuthModal
    },
    [openAuthModal, user]
  )
}
