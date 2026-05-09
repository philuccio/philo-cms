'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  IconPlus,
  IconDeviceFloppy,
  IconChevronLeft,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react'
import type { Page, LayoutBlock } from '@prisma/client'
import type { BlockType, BlockContent } from '@philo/types'
import {
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  updatePageMeta,
} from '@/app/actions/pages'
import { SortableBlockList } from './SortableBlockList'
import { HeroEditor } from './blocks/HeroEditor'
import { TextEditor } from './blocks/TextEditor'
import { ImageEditor } from './blocks/ImageEditor'
import { QuoteEditor } from './blocks/QuoteEditor'
import { StatsEditor } from './blocks/StatsEditor'
import { CtaEditor } from './blocks/CtaEditor'
import type { Route } from 'next'

const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero',
  text: 'Testo',
  image: 'Immagine',
  quote: 'Citazione',
  stats: 'Statistiche',
  cta: 'CTA',
  map: 'Mappa',
}

const BLOCK_TYPES: BlockType[] = ['hero', 'text', 'image', 'quote', 'stats', 'cta']

interface PageWithBlocks extends Page {
  blocks: LayoutBlock[]
}

interface Props {
  page: PageWithBlocks
}

export function PageEditor({ page }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedId, setSelectedId] = useState<string | null>(page.blocks[0]?.id ?? null)
  const [localContents, setLocalContents] = useState<Record<string, BlockContent>>(() =>
    Object.fromEntries(page.blocks.map((b) => [b.id, JSON.parse(b.content) as BlockContent])),
  )
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [metaOpen, setMetaOpen] = useState(false)
  const [meta, setMeta] = useState({
    title: page.title,
    slug: page.slug,
    metaTitle: page.metaTitle ?? '',
    metaDesc: page.metaDesc ?? '',
    status: page.status as 'DRAFT' | 'REVIEW' | 'PUBLISHED',
  })

  const selectedBlock = page.blocks.find((b) => b.id === selectedId)
  const selectedContent = selectedId ? localContents[selectedId] : null

  const handleAdd = (type: BlockType) => {
    setShowAddMenu(false)
    startTransition(async () => {
      try {
        const block = await addBlock(page.id, type)
        setLocalContents((prev) => ({
          ...prev,
          [block.id]: JSON.parse(block.content) as BlockContent,
        }))
        setSelectedId(block.id)
        router.refresh()
      } catch {
        toast.error('Errore aggiunta blocco')
      }
    })
  }

  const handleSaveBlock = () => {
    if (!selectedId || !selectedContent) return
    startTransition(async () => {
      try {
        await updateBlock(selectedId, selectedContent)
        toast.success('Blocco salvato')
        router.refresh()
      } catch {
        toast.error('Errore salvataggio blocco')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteBlock(id)
        setLocalContents((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        if (selectedId === id) setSelectedId(null)
        router.refresh()
        toast.success('Blocco eliminato')
      } catch {
        toast.error('Errore eliminazione blocco')
      }
    })
  }

  const handleReorder = (orderedIds: string[]) => {
    startTransition(async () => {
      try {
        await reorderBlocks(page.id, orderedIds)
        router.refresh()
      } catch {
        toast.error('Errore riordinamento blocchi')
      }
    })
  }

  const handleSaveMeta = () => {
    startTransition(async () => {
      try {
        await updatePageMeta(page.id, meta)
        toast.success('Metadati salvati')
        router.refresh()
      } catch {
        toast.error('Errore salvataggio metadati')
      }
    })
  }

  const renderEditor = () => {
    if (!selectedContent) return null
    switch (selectedContent.type) {
      case 'hero':
        return (
          <HeroEditor
            content={selectedContent}
            onChange={(c) => setLocalContents((p) => ({ ...p, [selectedId!]: c }))}
          />
        )
      case 'text':
        return (
          <TextEditor
            content={selectedContent}
            onChange={(c) => setLocalContents((p) => ({ ...p, [selectedId!]: c }))}
          />
        )
      case 'image':
        return (
          <ImageEditor
            content={selectedContent}
            onChange={(c) => setLocalContents((p) => ({ ...p, [selectedId!]: c }))}
          />
        )
      case 'quote':
        return (
          <QuoteEditor
            content={selectedContent}
            onChange={(c) => setLocalContents((p) => ({ ...p, [selectedId!]: c }))}
          />
        )
      case 'stats':
        return (
          <StatsEditor
            content={selectedContent}
            onChange={(c) => setLocalContents((p) => ({ ...p, [selectedId!]: c }))}
          />
        )
      case 'cta':
        return (
          <CtaEditor
            content={selectedContent}
            onChange={(c) => setLocalContents((p) => ({ ...p, [selectedId!]: c }))}
          />
        )
      default:
        return (
          <p className="text-[--color-text]/40 text-sm">
            Editor non disponibile per questo blocco.
          </p>
        )
    }
  }

  return (
    <div className="flex h-full">
      {/* Blocchi sidebar */}
      <aside className="border-[--color-text]/10 flex w-64 shrink-0 flex-col overflow-hidden border-r">
        <div className="border-[--color-text]/10 flex items-center gap-2 border-b p-4">
          <button
            onClick={() => router.push('/admin/pages' as Route)}
            className="text-[--color-text]/40 hover:text-[--color-text]"
          >
            <IconChevronLeft size={18} />
          </button>
          <span className="truncate text-sm font-medium text-[--color-text]">{page.title}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {page.blocks.length === 0 ? (
            <p className="text-[--color-text]/30 py-8 text-center text-xs">
              Nessun blocco. Aggiungine uno.
            </p>
          ) : (
            <SortableBlockList
              blocks={page.blocks}
              selectedId={selectedId}
              isPending={isPending}
              onSelect={setSelectedId}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          )}
        </div>

        {/* Aggiungi blocco */}
        <div className="border-[--color-text]/10 relative border-t p-3">
          <button
            onClick={() => setShowAddMenu((v) => !v)}
            disabled={isPending}
            className="border-[--color-text]/20 text-[--color-text]/50 hover:text-[--color-text]/80 hover:border-[--color-text]/40 flex w-full items-center justify-center gap-2 rounded border border-dashed py-2 text-sm disabled:opacity-40"
          >
            <IconPlus size={15} /> Aggiungi blocco
          </button>

          {showAddMenu && (
            <div className="border-[--color-text]/15 absolute bottom-full left-3 right-3 z-10 mb-1 overflow-hidden rounded border bg-[--color-bg] shadow-xl">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAdd(type)}
                  className="text-[--color-text]/80 hover:bg-[--color-text]/5 w-full px-4 py-2 text-left text-sm"
                >
                  {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Area editing */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-[--color-text]/10 flex shrink-0 items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                meta.status === 'PUBLISHED'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : meta.status === 'REVIEW'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-[--color-text]/10 text-[--color-text]/50'
              }`}
            >
              {meta.status === 'PUBLISHED'
                ? 'Pubblicata'
                : meta.status === 'REVIEW'
                  ? 'In revisione'
                  : 'Bozza'}
            </span>
            <button
              onClick={() => setMetaOpen((v) => !v)}
              className="text-[--color-text]/40 hover:text-[--color-text]/70 flex items-center gap-1 text-xs"
            >
              {metaOpen ? <IconEyeOff size={14} /> : <IconEye size={14} />}
              {metaOpen ? 'Nascondi SEO' : 'SEO & Meta'}
            </button>
          </div>

          {selectedContent && (
            <button
              onClick={handleSaveBlock}
              disabled={isPending}
              className="flex items-center gap-2 rounded bg-[--color-accent] px-4 py-1.5 text-sm font-medium text-[--color-primary] disabled:opacity-50"
            >
              <IconDeviceFloppy size={15} /> Salva blocco
            </button>
          )}
        </div>

        {/* SEO panel */}
        {metaOpen && (
          <div className="border-[--color-text]/10 bg-[--color-text]/3 shrink-0 space-y-3 border-b px-6 py-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Titolo pagina</span>
                <input
                  value={meta.title}
                  onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                />
              </label>
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Slug (URL)</span>
                <input
                  value={meta.slug}
                  onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value }))}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 font-mono text-sm text-[--color-text]"
                />
              </label>
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Meta title</span>
                <input
                  value={meta.metaTitle}
                  onChange={(e) => setMeta((m) => ({ ...m, metaTitle: e.target.value }))}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                />
              </label>
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Stato</span>
                <select
                  value={meta.status}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, status: e.target.value as typeof meta.status }))
                  }
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                >
                  <option value="DRAFT">Bozza</option>
                  <option value="REVIEW">In revisione</option>
                  <option value="PUBLISHED">Pubblicata</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Meta description</span>
              <textarea
                value={meta.metaDesc}
                onChange={(e) => setMeta((m) => ({ ...m, metaDesc: e.target.value }))}
                rows={2}
                className="border-[--color-text]/15 w-full resize-none rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
              />
            </label>
            <button
              onClick={handleSaveMeta}
              disabled={isPending}
              className="rounded bg-[--color-accent] px-4 py-1.5 text-sm font-medium text-[--color-primary] disabled:opacity-50"
            >
              Salva metadati
            </button>
          </div>
        )}

        {/* Block editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedBlock ? (
            <>
              <h2 className="mb-4 text-base font-semibold text-[--color-text]">
                {BLOCK_LABELS[selectedBlock.type as BlockType]}
              </h2>
              {renderEditor()}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-[--color-text]/25 text-sm">Seleziona un blocco per modificarlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
