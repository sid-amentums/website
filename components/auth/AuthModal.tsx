'use client'

import { useState } from 'react'
import { useAuthModalStore } from '@/lib/auth/authModalStore'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import GuestCheckoutFallback from '@/components/auth/GuestCheckoutFallback'

export default function AuthModal() {
  const isOpen = useAuthModalStore((s) => s.isOpen)
  const intent = useAuthModalStore((s) => s.intent)
  const attempted = useAuthModalStore((s) => s.attempted)
  const close = useAuthModalStore((s) => s.close)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? 'Log in' : 'Sign up'}
        className="relative w-full max-w-sm rounded-2xl bg-w p-7 shadow-2xl"
      >
        <button
          aria-label="Close"
          onClick={close}
          className="absolute right-5 top-5 text-xl leading-none text-mid hover:text-ink"
        >
          &times;
        </button>

        <h2 className="mb-1 font-serif text-2xl text-ink">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mb-5 text-xs text-mid">
          {intent === 'checkout'
            ? 'Log in or sign up to continue to checkout.'
            : 'Log in or sign up to Amentum Sports.'}
        </p>

        {mode === 'login' ? <LoginForm /> : <SignupForm />}

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="mt-4 block w-full text-center text-xs text-mid underline"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>

        {intent === 'checkout' ? (
          attempted ? (
            <GuestCheckoutFallback />
          ) : (
            <p className="mt-4 text-center text-[11px] text-dim">
              Having trouble? Options will appear after you try logging in or signing up.
            </p>
          )
        ) : null}
      </div>
    </div>
  )
}
