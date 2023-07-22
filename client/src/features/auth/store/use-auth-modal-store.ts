import { create } from 'zustand'

export interface AuthModalStore {
  opened: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useAuthModalStore = create<AuthModalStore>((set, get) => ({
  opened: false,
  open: () => set({ ...get(), opened: true }),
  close: () => set({ ...get(), opened: false }),
  toggle: () => set({ ...get(), opened: !get().opened }),
}))

export const useAuthModalOpened = () => useAuthModalStore(state => state.opened)
export const useAuthModalOpen = () => useAuthModalStore(state => state.open)
export const useAuthModalClose = () => useAuthModalStore(state => state.close)
export const useAuthModalToggle = () => useAuthModalStore(state => state.toggle)
