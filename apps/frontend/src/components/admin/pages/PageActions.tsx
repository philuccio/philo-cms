'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconTrash, IconEdit } from '@tabler/icons-react'
import { deletePage } from '@/app/actions/pages'
import Link from 'next/link'
import type { Route } from 'next'

interface Props {
  pageId: string
}

export function PageActions({ pageId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Eliminare questa pagina e tutti i suoi blocchi?')) return
    startTransition(async () => {
      try {
        await deletePage(pageId)
        router.refresh()
        toast.success('Pagina eliminata')
      } catch {
        toast.error('Errore eliminazione pagina')
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/pages/${pageId}` as Route}
        className="text-[--color-text]/30 hover:text-[--color-text]/70 rounded p-1.5"
        aria-label="Modifica"
      >
        <IconEdit size={15} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-[--color-text]/30 rounded p-1.5 hover:text-red-400 disabled:opacity-40"
        aria-label="Elimina"
      >
        <IconTrash size={15} />
      </button>
    </div>
  )
}
