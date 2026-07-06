import { create } from 'zustand'

type AuthIntent = 'checkout' | 'manual'

type AuthModalStore = {
  isOpen: boolean
  intent: AuthIntent
  attempted: boolean
  open: (intent?: AuthIntent) => void
  close: () => void
  markAttempted: () => void
}

// Controls the login/signup MODAL OVERLAY — never a route. `attempted`
// gates the "Continue as guest" fallback so it only appears after a
// login/signup attempt or explicit dismiss, not as the first-screen default.
export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  intent: 'manual',
  attempted: false,

  open: (intent = 'manual') => set({ isOpen: true, intent, attempted: false }),
  close: () => set({ isOpen: false }),
  markAttempted: () => set({ attempted: true }),
}))
