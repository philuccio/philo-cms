'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconLayoutDashboard,
  IconFileText,
  IconPhoto,
  IconBriefcase,
  IconStack2,
  IconFolderOpen,
  IconPalette,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { useUIStore } from '@/lib/store'
import type { Route } from 'next'

const NAV: {
  href: Route
  label: string
  Icon: React.ComponentType<{ size?: number; stroke?: number }>
}[] = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: IconLayoutDashboard },
  { href: '/admin/pages', label: 'Pagine', Icon: IconFileText },
  { href: '/admin/gallery', label: 'Gallery', Icon: IconPhoto },
  { href: '/admin/cases', label: 'Case Studies', Icon: IconBriefcase },
  { href: '/admin/services', label: 'Servizi', Icon: IconStack2 },
  { href: '/admin/media', label: 'Media', Icon: IconFolderOpen },
  { href: '/admin/theme', label: 'Tema', Icon: IconPalette },
  { href: '/admin/settings', label: 'Impostazioni', Icon: IconSettings },
]

interface SidebarProps {
  userName: string
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={`border-[--color-text]/10 relative flex h-screen flex-shrink-0 flex-col border-r bg-[--color-sidebar] transition-all duration-200 ${
        sidebarCollapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Brand */}
      <div className="border-[--color-text]/10 flex h-14 items-center border-b px-4">
        <span className="text-lg font-[--font-display] font-semibold tracking-widest text-[--color-accent]">
          {sidebarCollapsed ? 'P' : 'PHILO'}
        </span>
        {!sidebarCollapsed && (
          <span className="text-[--color-text]/30 ml-2 text-[10px] tracking-widest">CMS</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-[--color-accent]/10 border-r-2 border-[--color-accent] text-[--color-accent]'
                  : 'text-[--color-text]/50 hover:bg-[--color-text]/5 hover:text-[--color-text]'
              }`}
            >
              <Icon size={18} stroke={1.5} />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User initials */}
      {!sidebarCollapsed && (
        <div className="border-[--color-text]/10 border-t px-4 py-3">
          <p className="text-[--color-text]/30 truncate text-[11px]">{userName}</p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        title={sidebarCollapsed ? 'Espandi sidebar' : 'Riduci sidebar'}
        className="border-[--color-text]/15 text-[--color-text]/40 absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border bg-[--color-sidebar] transition-colors hover:text-[--color-text]"
      >
        {sidebarCollapsed ? <IconChevronRight size={12} /> : <IconChevronLeft size={12} />}
      </button>
    </aside>
  )
}
