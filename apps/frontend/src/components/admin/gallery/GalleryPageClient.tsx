'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconPlus, IconSettings } from '@tabler/icons-react'
import Link from 'next/link'
import type { Route } from 'next'
import { deleteProject, reorderProjects } from '@/app/actions/gallery'
import { SortableProjectList } from './SortableProjectList'
import { NewProjectModal } from './NewProjectModal'

interface ProjectItem {
  id: string
  title: string
  slug: string
  status: string
  depth: string
  category: { name: string; color: string } | null
  media: { media: { url: string; alt: string | null } }[]
}

interface Props {
  projects: ProjectItem[]
}

export function GalleryPageClient({ projects }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showNewModal, setShowNewModal] = useState(false)

  const handleDelete = (id: string) => {
    if (!confirm('Eliminare questo progetto?')) return
    startTransition(async () => {
      try {
        await deleteProject(id)
        router.refresh()
        toast.success('Progetto eliminato')
      } catch {
        toast.error('Errore eliminazione')
      }
    })
  }

  const handleReorder = (ids: string[]) => {
    startTransition(async () => {
      try {
        await reorderProjects(ids)
        router.refresh()
      } catch {
        toast.error('Errore riordinamento')
      }
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[--color-text]">Gallery</h1>
          <p className="text-[--color-text]/40 mt-1 text-sm">{projects.length} progetti</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={'/admin/gallery/config' as Route}
            className="border-[--color-text]/15 text-[--color-text]/60 flex items-center gap-2 rounded border px-3 py-2 text-sm hover:text-[--color-text]"
          >
            <IconSettings size={15} /> Layout
          </Link>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-primary]"
          >
            <IconPlus size={16} /> Nuovo progetto
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[--color-text]/30 text-sm">Nessun progetto. Creane uno.</p>
        </div>
      ) : (
        <SortableProjectList
          projects={projects}
          isPending={isPending}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}

      {showNewModal && <NewProjectModal onClose={() => setShowNewModal(false)} />}
    </div>
  )
}
