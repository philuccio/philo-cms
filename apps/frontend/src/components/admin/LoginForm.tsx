'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'

interface LoginFormProps {
  callbackUrl: string
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o password non corretti.')
      return
    }

    router.push(callbackUrl as Route)
    router.refresh()
  }

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e)
      }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[--color-text]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border-[--color-text]/20 bg-[--color-text]/5 placeholder:text-[--color-text]/30 rounded border px-3 py-2.5 text-sm text-[--color-text] focus:border-[--color-accent] focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
          placeholder="admin@philo.local"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[--color-text]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border-[--color-text]/20 bg-[--color-text]/5 placeholder:text-[--color-text]/30 rounded border px-3 py-2.5 text-sm text-[--color-text] focus:border-[--color-accent] focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex items-center justify-center gap-2 rounded bg-[--color-accent] px-4 py-2.5 text-sm font-medium text-[--color-bg] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : null}
        {loading ? 'Accesso in corso…' : 'Accedi'}
      </button>
    </form>
  )
}
