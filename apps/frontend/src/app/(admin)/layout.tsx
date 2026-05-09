import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: {
    default: 'Admin — PHILO CMS',
    template: '%s | Admin PHILO',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-[--color-bg]">{children}</div>
    </SessionProvider>
  )
}
