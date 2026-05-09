import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardStats } from '@/app/actions/dashboard'
import {
  IconFileText,
  IconPhoto,
  IconBriefcase,
  IconStack2,
  IconFolderOpen,
  IconPlus,
} from '@tabler/icons-react'
import type { Route } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

const STATS_CONFIG = [
  { key: 'pages' as const, label: 'Pagine', Icon: IconFileText, href: '/admin/pages' as Route },
  { key: 'projects' as const, label: 'Progetti', Icon: IconPhoto, href: '/admin/gallery' as Route },
  {
    key: 'cases' as const,
    label: 'Case Studies',
    Icon: IconBriefcase,
    href: '/admin/cases' as Route,
  },
  {
    key: 'services' as const,
    label: 'Servizi',
    Icon: IconStack2,
    href: '/admin/services' as Route,
  },
  { key: 'media' as const, label: 'Media', Icon: IconFolderOpen, href: '/admin/media' as Route },
]

const QUICK_ACTIONS: {
  label: string
  href: Route
  Icon: React.ComponentType<{ size?: number; stroke?: number }>
}[] = [
  { label: 'Nuovo progetto', href: '/admin/gallery', Icon: IconPhoto },
  { label: 'Carica media', href: '/admin/media', Icon: IconFolderOpen },
  { label: 'Modifica tema', href: '/admin/theme', Icon: IconStack2 },
]

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DashboardPage() {
  let stats = {
    pages: 0,
    projects: 0,
    cases: 0,
    services: 0,
    media: 0,
    recentMedia: [] as Awaited<ReturnType<typeof getDashboardStats>>['recentMedia'],
  }

  try {
    stats = await getDashboardStats()
  } catch {
    // empty during build
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[--color-text]">Dashboard</h1>
        <p className="text-[--color-text]/40 mt-1 text-sm">Panoramica del sito</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS_CONFIG.map(({ key, label, Icon, href }) => (
          <Link
            key={key}
            href={href}
            className="border-[--color-text]/8 bg-[--color-text]/3 hover:border-[--color-accent]/30 hover:bg-[--color-accent]/5 group rounded-xl border p-5 transition-colors"
          >
            <div className="mb-3 flex items-center justify-between">
              <Icon
                size={18}
                stroke={1.5}
                className="text-[--color-text]/30 transition-colors group-hover:text-[--color-accent]"
              />
            </div>
            <p className="text-2xl font-semibold tabular-nums text-[--color-text]">{stats[key]}</p>
            <p className="text-[--color-text]/40 mt-1 text-xs">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick actions */}
        <div>
          <h2 className="text-[--color-text]/30 mb-4 text-xs font-medium uppercase tracking-widest">
            Azioni rapide
          </h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(({ label, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className="border-[--color-text]/8 text-[--color-text]/60 hover:border-[--color-accent]/30 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors hover:text-[--color-text]"
              >
                <span className="bg-[--color-accent]/10 flex h-7 w-7 items-center justify-center rounded-md text-[--color-accent]">
                  <IconPlus size={14} stroke={2} />
                </span>
                <Icon size={15} stroke={1.5} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent media */}
        <div className="lg:col-span-2">
          <h2 className="text-[--color-text]/30 mb-4 text-xs font-medium uppercase tracking-widest">
            Media recenti
          </h2>
          {stats.recentMedia.length === 0 ? (
            <p className="text-[--color-text]/25 text-sm">Nessun file caricato</p>
          ) : (
            <div className="space-y-2">
              {stats.recentMedia.map((m) => (
                <div
                  key={m.id}
                  className="border-[--color-text]/8 flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  <div className="bg-[--color-text]/5 text-[--color-text]/30 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md">
                    <IconFolderOpen size={15} stroke={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[--color-text]/80 truncate text-sm">{m.filename}</p>
                    <p className="text-[--color-text]/30 text-xs">
                      {m.type} · {formatBytes(m.size)}
                    </p>
                  </div>
                  <time className="text-[--color-text]/25 flex-shrink-0 text-xs">
                    {new Date(m.createdAt).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
