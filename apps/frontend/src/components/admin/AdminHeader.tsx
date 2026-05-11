'use client'

import { signOut } from 'next-auth/react'
import { IconSearch, IconBell, IconSun, IconMoon, IconUser, IconLogout } from '@tabler/icons-react'
import { useState } from 'react'
import { useUIStore } from '@/lib/store'

interface AdminHeaderProps {
  userName: string
  userRole: string
}

export function AdminHeader({ userName, userRole }: AdminHeaderProps) {
  const { darkMode, toggleDarkMode } = useUIStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const initials =
    userName
      .split('@')[0]
      ?.split(/[._-]/)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') ?? 'A'

  const muted = 'color-mix(in srgb, var(--color-text) 40%, transparent)'
  const border = 'color-mix(in srgb, var(--color-text) 10%, transparent)'

  return (
    <header
      style={{ backgroundColor: 'var(--color-sidebar)', borderColor: border }}
      className="flex h-14 flex-shrink-0 items-center gap-4 border-b px-6"
    >
      {/* Search */}
      <div
        style={{
          borderColor: border,
          backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
          color: muted,
        }}
        className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
      >
        <IconSearch size={15} stroke={1.5} />
        <input
          type="text"
          placeholder="Cerca contenuti…"
          style={{ color: 'var(--color-text)' }}
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Passa a light mode' : 'Passa a dark mode'}
          style={{ color: muted }}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
        >
          {darkMode ? <IconSun size={17} stroke={1.5} /> : <IconMoon size={17} stroke={1.5} />}
        </button>

        {/* Notifications */}
        <button
          title="Notifiche"
          style={{ color: muted }}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
        >
          <IconBell size={17} stroke={1.5} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent)',
              color: 'var(--color-accent)',
            }}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors"
          >
            {initials}
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div
                style={{ backgroundColor: 'var(--color-sidebar)', borderColor: border }}
                className="absolute right-0 top-10 z-20 w-52 rounded-lg border py-1 shadow-xl"
              >
                <div style={{ borderColor: border }} className="border-b px-4 py-2.5">
                  <p
                    style={{ color: 'var(--color-text)' }}
                    className="truncate text-sm font-medium"
                  >
                    {userName}
                  </p>
                  <p style={{ color: muted }} className="text-xs">
                    {userRole}
                  </p>
                </div>
                <button
                  onClick={() => {
                    void signOut({ callbackUrl: '/admin/login' })
                  }}
                  style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <IconLogout size={15} stroke={1.5} />
                  Esci
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
