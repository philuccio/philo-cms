'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconPlus, IconLayoutList } from '@tabler/icons-react'
import {
  createCaseStudy,
  deleteCaseStudy,
  reorderCaseStudies,
  getCaseStudies,
} from '@/app/actions/cases'
import { SortableCaseList } from './SortableCaseList'

type CaseItem = Awaited<ReturnType<typeof getCaseStudies>>[number]

interface CasesClientProps {
  initialItems: CaseItem[]
}

export function CasesClient({ initialItems }: CasesClientProps) {
  const router = useRouter()
  const [items, setItems] = useState<CaseItem[]>(initialItems)
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    startTransition(async () => {
      try {
        const cs = await createCaseStudy({ title: 'Nuovo Case Study', slug: '' })
        router.push(`/admin/cases/${cs.id}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore nella creazione')
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Eliminare questo case study?')) return
    startTransition(async () => {
      try {
        await deleteCaseStudy(id)
        setItems((prev) => prev.filter((i) => i.id !== id))
        toast.success('Eliminato')
      } catch {
        toast.error("Errore durante l'eliminazione")
      }
    })
  }

  function handleReorder(orderedIds: string[]) {
    const reordered = orderedIds
      .map((id) => items.find((i) => i.id === id))
      .filter(Boolean) as CaseItem[]
    setItems(reordered)
    startTransition(async () => {
      try {
        await reorderCaseStudies(orderedIds)
      } catch {
        toast.error('Errore nel salvataggio ordine')
      }
    })
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[--color-text]">Case History</h1>
          <p className="text-[--color-text]/40 mt-0.5 text-sm">
            {items.length} case stud{items.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
        <button onClick={handleCreate} disabled={isPending} className="btn-primary">
          <IconPlus size={16} />
          Nuovo case study
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <IconLayoutList size={40} stroke={1} className="text-[--color-text]/20 mb-4" />
          <p className="text-[--color-text]/50 font-medium">Nessun case study</p>
          <p className="text-[--color-text]/30 mt-1 text-sm">
            Crea il primo per raccontare i tuoi progetti
          </p>
          <button onClick={handleCreate} disabled={isPending} className="btn-primary mt-4">
            Crea case study
          </button>
        </div>
      ) : (
        <SortableCaseList
          items={items}
          onEdit={(id) => router.push(`/admin/cases/${id}`)}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}

      <button
        onClick={handleCreate}
        disabled={isPending}
        title="Nuovo case study"
        className="btn-fab"
      >
        <IconPlus size={22} />
      </button>
    </div>
  )
}
