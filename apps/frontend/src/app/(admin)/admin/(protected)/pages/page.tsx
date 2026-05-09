import type { Metadata } from 'next'
import Link from 'next/link'
import { getPages } from '@/app/actions/pages'
import { PageActions } from '@/components/admin/pages/PageActions'
import { IconPlus, IconFile } from '@tabler/icons-react'
import type { Route } from 'next'

export const metadata: Metadata = { title: 'Pagine' }

export default async function AdminPagesPage() {
  let pages: Awaited<ReturnType<typeof getPages>> = []
  try {
    pages = await getPages()
  } catch {
    // empty during build
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[--color-text]">Pagine</h1>
          <p className="text-[--color-text]/40 mt-1 text-sm">{pages.length} pagine</p>
        </div>
        <Link
          href={'/admin/pages/new' as Route}
          className="flex items-center gap-2 rounded bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-primary]"
        >
          <IconPlus size={16} /> Nuova pagina
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="py-20 text-center">
          <IconFile size={40} className="text-[--color-text]/15 mx-auto mb-4" />
          <p className="text-[--color-text]/30 text-sm">Nessuna pagina. Creane una.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="border-[--color-text]/8 hover:border-[--color-text]/15 flex items-center justify-between rounded-lg border bg-[--color-bg] px-4 py-3 transition-colors"
            >
              <Link href={`/admin/pages/${page.id}` as Route} className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[--color-text]">{page.title}</p>
                <p className="text-[--color-text]/35 mt-0.5 text-xs">/{page.slug}</p>
              </Link>
              <div className="ml-4 flex shrink-0 items-center gap-4">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    page.status === 'PUBLISHED'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : page.status === 'REVIEW'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-[--color-text]/10 text-[--color-text]/40'
                  }`}
                >
                  {page.status === 'PUBLISHED'
                    ? 'Pubblicata'
                    : page.status === 'REVIEW'
                      ? 'In revisione'
                      : 'Bozza'}
                </span>
                <span className="text-[--color-text]/25 text-xs">
                  {new Date(page.updatedAt).toLocaleDateString('it-IT')}
                </span>
                <PageActions pageId={page.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
