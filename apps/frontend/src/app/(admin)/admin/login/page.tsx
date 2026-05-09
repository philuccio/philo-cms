import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = { title: 'Accedi' }

interface Props {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-bg]">
      <div className="w-full max-w-sm px-6">
        <div className="mb-10 text-center">
          <h1
            className="text-4xl font-[--font-display] font-semibold tracking-tight text-[--color-text]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            PHILO
          </h1>
          <p className="text-[--color-text]/50 mt-1 text-sm">Pannello di amministrazione</p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mb-6 rounded border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error === 'CredentialsSignin'
              ? 'Email o password non corretti.'
              : 'Errore di accesso. Riprova.'}
          </div>
        ) : null}

        <LoginForm callbackUrl={callbackUrl ?? '/admin/dashboard'} />
      </div>
    </div>
  )
}
