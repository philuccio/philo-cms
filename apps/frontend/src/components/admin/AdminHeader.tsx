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

  return (
    <header className="border-[--color-text]/10 flex h-14 flex-shrink-0 items-center gap-4 border-b bg-[--color-bg] px-6">
      {/* Search */}
      <div className="border-[--color-text]/10 bg-[--color-text]/5 text-[--color-text]/40 focus-within:border-[--color-accent]/50 flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus-within:text-[--color-text]">
        <IconSearch size={15} stroke={1.5} />
        <input
          type="text"
          placeholder="Cerca contenuti…"
          className="placeholder:text-[--color-text]/30 flex-1 bg-transparent text-sm text-[--color-text] focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Passa a light mode' : 'Passa a dark mode'}
          className="text-[--color-text]/40 hover:bg-[--color-text]/8 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:text-[--color-text]"
        >
          {darkMode ? <IconSun size={17} stroke={1.5} /> : <IconMoon size={17} stroke={1.5} />}
        </button>

        {/* Notifications */}
        <button
          title="Notifiche"
          className="text-[--color-text]/40 hover:bg-[--color-text]/8 relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:text-[--color-text]"
        >
          <IconBell size={17} stroke={1.5} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="bg-[--color-accent]/20 hover:bg-[--color-accent]/30 ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-[--color-accent] transition-colors"
          >
            {initials}
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="border-[--color-text]/10 absolute right-0 top-10 z-20 w-52 rounded-lg border bg-[--color-bg] py-1 shadow-xl">
                <div className="border-[--color-text]/10 border-b px-4 py-2.5">
                  <p className="truncate text-sm font-medium text-[--color-text]">{userName}</p>
                  <p className="text-[--color-text]/40 text-xs">{userRole}</p>
                </div>
                <button
                  onClick={() => {
                    void signOut({ callbackUrl: '/admin/login' })
                  }}
                  className="text-[--color-text]/60 flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-red-500/10 hover:text-red-400"
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
