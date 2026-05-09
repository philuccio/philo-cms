'use client'

import { useUIStore } from '@/lib/store'
import { Sidebar } from './Sidebar'
import { AdminHeader } from './AdminHeader'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'

interface AdminShellProps {
  children: React.ReactNode
  userName: string
  userRole: string
}

export function AdminShell({ children, userName, userRole }: AdminShellProps) {
  const { darkMode } = useUIStore()
  const [mounted, setMounted] = useState(false)

  // Evita flash di contenuto durante hydration
  useEffect(() => setMounted(true), [])

  return (
    <div
      data-theme={mounted ? (darkMode ? 'dark' : 'light') : 'dark'}
      className="flex h-screen overflow-hidden bg-[--color-bg]"
    >
      <Sidebar userName={userName} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)',
          },
        }}
      />
    </div>
  )
}
