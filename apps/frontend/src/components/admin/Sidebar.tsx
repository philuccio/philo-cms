'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Route } from 'next'

const NAV: { href: Route; label: string }[] = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/pages', label: 'Pagine' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/cases', label: 'Case Studies' },
  { href: '/admin/services', label: 'Servizi' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/theme', label: 'Tema' },
  { href: '/admin/settings', label: 'Impostazioni' },
]

interface SidebarProps {
  userName: string
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="border-[--color-text]/10 flex h-screen w-52 flex-shrink-0 flex-col border-r bg-[--color-bg]">
      <div className="border-[--color-text]/10 flex h-14 items-center border-b px-5">
        <span className="text-lg font-[--font-display] font-semibold tracking-widest text-[--color-accent]">
          PHILO
        </span>
        <span className="text-[--color-text]/30 ml-2 text-[10px] tracking-widest">CMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`block px-5 py-2 text-sm transition-colors ${
                active
                  ? 'bg-[--color-accent]/8 border-r-2 border-[--color-accent] text-[--color-accent]'
                  : 'text-[--color-text]/50 hover:bg-[--color-text]/5 hover:text-[--color-text]'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-[--color-text]/10 border-t p-4">
        <p className="text-[--color-text]/30 mb-2 truncate text-[11px]">{userName}</p>
        <button
          onClick={() => {
            void signOut({ callbackUrl: '/admin/login' })
          }}
          className="text-[--color-text]/40 w-full rounded px-3 py-1.5 text-left text-xs transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          Esci
        </button>
      </div>
    </aside>
  )
}
