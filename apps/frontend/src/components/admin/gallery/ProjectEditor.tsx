'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import Image from 'next/image'
import type { Project, ProjectMedia, Media, Category } from '@prisma/client'
import type { Route } from 'next'
import { updateProject, addProjectMedia, removeProjectMedia } from '@/app/actions/gallery'
import { MediaPickerModal } from '@/components/admin/pages/MediaPickerModal'

type ProjectWithMedia = Project & {
  category: Category | null
  media: (ProjectMedia & { media: Media })[]
}

interface Props {
  project: ProjectWithMedia
  categories: Category[]
}

const STEPS = ['Info base', 'Media', 'Dettagli', 'Pubblicazione']

export function ProjectEditor({ project, categories }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(0)
  const [showCoverPicker, setShowCoverPicker] = useState(false)
  const [showGalleryPicker, setShowGalleryPicker] = useState(false)

  const [form, setForm] = useState({
    title: project.title,
    slug: project.slug,
    excerpt: project.excerpt ?? '',
    body: project.body ?? '',
    status: project.status as 'DRAFT' | 'REVIEW' | 'PUBLISHED',
    depth: project.depth as 'THUMBNAIL' | 'CARD' | 'FULL',
    categoryId: project.categoryId ?? '',
    year: project.year?.toString() ?? '',
    client: project.client ?? '',
    tags: project.tags ?? '',
  })

  const cover = project.media.find((m) => m.role === 'cover')
  const gallery = project.media.filter((m) => m.role === 'gallery')

  const save = (extra?: Partial<typeof form>) => {
    const data = { ...form, ...extra }
    startTransition(async () => {
      try {
        await updateProject(project.id, {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || null,
          body: data.body || null,
          status: data.status,
          depth: data.depth,
          categoryId: data.categoryId || null,
          year: data.year ? Number(data.year) : null,
          client: data.client || null,
          tags: data.tags || null,
        })
        toast.success('Salvato')
        router.refresh()
      } catch {
        toast.error('Errore salvataggio')
      }
    })
  }

  const handleAddCover = (media: Media) => {
    startTransition(async () => {
      try {
        await addProjectMedia(project.id, media.id, 'cover')
        router.refresh()
        toast.success('Cover aggiornata')
      } catch {
        toast.error('Errore')
      }
    })
  }

  const handleAddGallery = (media: Media) => {
    startTransition(async () => {
      try {
        await addProjectMedia(project.id, media.id, 'gallery')
        router.refresh()
        toast.success('Immagine aggiunta')
      } catch {
        toast.error('Errore')
      }
    })
  }

  const handleRemoveMedia = (mediaId: string) => {
    startTransition(async () => {
      try {
        await removeProjectMedia(project.id, mediaId)
        router.refresh()
      } catch {
        toast.error('Errore rimozione')
      }
    })
  }

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-[--color-text]/10 flex shrink-0 items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/gallery' as Route)}
            className="text-[--color-text]/40 hover:text-[--color-text]"
          >
            <IconChevronLeft size={18} />
          </button>
          <span className="max-w-48 truncate text-sm font-medium text-[--color-text]">
            {form.title}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              form.status === 'PUBLISHED'
                ? 'bg-emerald-500/15 text-emerald-400'
                : form.status === 'REVIEW'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-[--color-text]/10 text-[--color-text]/40'
            }`}
          >
            {form.status === 'PUBLISHED'
              ? 'Pubblicato'
              : form.status === 'REVIEW'
                ? 'In revisione'
                : 'Bozza'}
          </span>
        </div>
        <button
          onClick={() => save()}
          disabled={isPending}
          className="flex items-center gap-2 rounded bg-[--color-accent] px-4 py-1.5 text-sm font-medium text-[--color-primary] disabled:opacity-50"
        >
          <IconDeviceFloppy size={15} /> Salva
        </button>
      </div>

      {/* Stepper */}
      <div className="border-[--color-text]/10 flex shrink-0 items-center gap-1 border-b px-6 py-3">
        {STEPS.map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              step === i
                ? 'bg-[--color-accent]/15 text-[--color-accent]'
                : 'text-[--color-text]/40 hover:text-[--color-text]/70'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                step === i
                  ? 'bg-[--color-accent] text-[--color-primary]'
                  : 'bg-[--color-text]/10 text-[--color-text]/40'
              }`}
            >
              {i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Step 0 — Info base */}
        {step === 0 && (
          <div className="max-w-xl space-y-4">
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Titolo *</span>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
              />
            </label>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Slug (URL)</span>
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 font-mono text-sm text-[--color-text]"
              />
            </label>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Estratto / Tagline</span>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                rows={3}
                className="border-[--color-text]/15 w-full resize-y rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Categoria</span>
                <select
                  value={form.categoryId}
                  onChange={(e) => set('categoryId', e.target.value)}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                >
                  <option value="">— Nessuna —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">
                  Livello di profondità
                </span>
                <select
                  value={form.depth}
                  onChange={(e) => set('depth', e.target.value as typeof form.depth)}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                >
                  <option value="THUMBNAIL">Thumbnail only</option>
                  <option value="CARD">Card con excerpt</option>
                  <option value="FULL">Pagina completa</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Step 1 — Media */}
        {step === 1 && (
          <div className="max-w-2xl space-y-6">
            {/* Cover */}
            <div>
              <p className="mb-3 text-sm font-medium text-[--color-text]">Immagine di copertina</p>
              {cover ? (
                <div className="group relative h-32 w-48 overflow-hidden rounded">
                  <Image
                    src={cover.media.url}
                    alt={cover.media.alt ?? ''}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemoveMedia(cover.mediaId)}
                    className="absolute right-2 top-2 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Rimuovi"
                  >
                    <IconX size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCoverPicker(true)}
                  className="border-[--color-text]/20 text-[--color-text]/40 hover:text-[--color-text]/70 flex items-center gap-2 rounded border border-dashed px-5 py-4 text-sm"
                >
                  <IconPlus size={15} /> Scegli cover dalla libreria
                </button>
              )}
              {cover && (
                <button
                  onClick={() => setShowCoverPicker(true)}
                  className="mt-2 text-xs text-[--color-accent] hover:underline"
                >
                  Cambia cover
                </button>
              )}
            </div>

            {/* Gallery */}
            <div>
              <p className="mb-3 text-sm font-medium text-[--color-text]">Gallery immagini</p>
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((pm) => (
                  <div
                    key={pm.mediaId}
                    className="group relative aspect-square overflow-hidden rounded"
                  >
                    <Image
                      src={pm.media.url}
                      alt={pm.media.alt ?? ''}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleRemoveMedia(pm.mediaId)}
                      className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Rimuovi"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowGalleryPicker(true)}
                  className="border-[--color-text]/20 text-[--color-text]/30 hover:text-[--color-text]/60 flex aspect-square flex-col items-center justify-center gap-1 rounded border border-dashed text-xs"
                >
                  <IconPlus size={18} />
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Dettagli */}
        {step === 2 && (
          <div className="max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Anno</span>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                  placeholder="2025"
                />
              </label>
              <label className="block">
                <span className="text-[--color-text]/50 mb-1 block text-xs">Cliente</span>
                <input
                  value={form.client}
                  onChange={(e) => set('client', e.target.value)}
                  className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">
                Tag (separati da virgola)
              </span>
              <input
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                placeholder="branding, web, print"
              />
            </label>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">
                Descrizione completa (HTML)
              </span>
              <textarea
                value={form.body}
                onChange={(e) => set('body', e.target.value)}
                rows={12}
                className="border-[--color-text]/15 w-full resize-y rounded border bg-[--color-bg] px-3 py-2 font-mono text-sm text-[--color-text]"
              />
            </label>
          </div>
        )}

        {/* Step 3 — Pubblicazione */}
        {step === 3 && (
          <div className="max-w-sm space-y-4">
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Stato</span>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as typeof form.status)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
              >
                <option value="DRAFT">Bozza</option>
                <option value="REVIEW">In revisione</option>
                <option value="PUBLISHED">Pubblicato</option>
              </select>
            </label>
            <div className="pt-2">
              <button
                onClick={() => save()}
                disabled={isPending}
                className="w-full rounded bg-[--color-accent] py-2.5 text-sm font-medium text-[--color-primary] disabled:opacity-50"
              >
                {isPending ? 'Salvataggio…' : 'Salva e pubblica'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step nav */}
      <div className="border-[--color-text]/10 flex shrink-0 items-center justify-between border-t px-6 py-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-[--color-text]/40 hover:text-[--color-text]/70 flex items-center gap-1 text-sm disabled:opacity-20"
        >
          <IconChevronLeft size={15} /> Precedente
        </button>
        <span className="text-[--color-text]/25 text-xs">
          {step + 1} / {STEPS.length}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="text-[--color-text]/40 hover:text-[--color-text]/70 flex items-center gap-1 text-sm disabled:opacity-20"
        >
          Successivo <IconChevronRight size={15} />
        </button>
      </div>

      {showCoverPicker && (
        <MediaPickerModal onSelect={handleAddCover} onClose={() => setShowCoverPicker(false)} />
      )}
      {showGalleryPicker && (
        <MediaPickerModal onSelect={handleAddGallery} onClose={() => setShowGalleryPicker(false)} />
      )}
    </div>
  )
}
