import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin — PHILO CMS',
    template: '%s | Admin PHILO',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[--color-bg]">
      {children}
    </div>
  )
}
