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
      style={{
        backgroundColor: 'var(--color-sidebar)',
        borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)',
      }}
      className={`relative flex h-screen flex-shrink-0 flex-col border-r transition-all duration-200 ${
        sidebarCollapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Brand */}
      <div
        style={{ borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
        className="flex h-14 items-center border-b px-4"
      >
        <span
          style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
          className="text-lg font-semibold tracking-widest"
        >
          {sidebarCollapsed ? 'P' : 'PHILO'}
        </span>
        {!sidebarCollapsed && (
          <span
            style={{ color: 'color-mix(in srgb, var(--color-text) 30%, transparent)' }}
            className="ml-2 text-[10px] tracking-widest"
          >
            CMS
          </span>
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
              style={
                active
                  ? {
                      color: 'var(--color-accent)',
                      backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                      borderRightColor: 'var(--color-accent)',
                    }
                  : { color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }
              }
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active ? 'border-r-2' : 'hover:opacity-100'
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
        <div
          style={{ borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
          className="border-t px-4 py-3"
        >
          <p
            style={{ color: 'color-mix(in srgb, var(--color-text) 40%, transparent)' }}
            className="truncate text-[11px]"
          >
            {userName}
          </p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        title={sidebarCollapsed ? 'Espandi sidebar' : 'Riduci sidebar'}
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'color-mix(in srgb, var(--color-text) 15%, transparent)',
          color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
        }}
        className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border transition-colors"
      >
        {sidebarCollapsed ? <IconChevronRight size={12} /> : <IconChevronLeft size={12} />}
      </button>
    </aside>
  )
}
