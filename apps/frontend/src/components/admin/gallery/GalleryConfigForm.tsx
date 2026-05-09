'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconDeviceFloppy } from '@tabler/icons-react'
import type { GalleryConfig } from '@prisma/client'
import { saveGalleryConfig } from '@/app/actions/gallery'

const LAYOUTS = [
  { value: 'GRID', label: 'Grid uniforme', desc: 'Griglia con colonne fisse' },
  { value: 'MASONRY', label: 'Masonry', desc: 'Colonne con altezze variabili' },
  { value: 'BENTO_GRID', label: 'Bento Grid', desc: 'Card di dimensioni miste stile dashboard' },
  { value: 'FULLWIDTH', label: 'Full-width alternato', desc: 'Immagine + testo alternati' },
  { value: 'FILMSTRIP', label: 'Filmstrip', desc: 'Scroll orizzontale' },
]

interface Props {
  config: GalleryConfig | null
}

export function GalleryConfigForm({ config }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    layoutType: (config?.layoutType ?? 'GRID') as
      | 'GRID'
      | 'MASONRY'
      | 'FULLWIDTH'
      | 'FILMSTRIP'
      | 'BENTO_GRID',
    cols: config?.cols ?? 3,
    hasFilters: config?.hasFilters ?? true,
    hasLightbox: config?.hasLightbox ?? true,
    defaultDepth: (config?.defaultDepth ?? 'CARD') as 'THUMBNAIL' | 'CARD' | 'FULL',
  })

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveGalleryConfig(form)
        toast.success('Configurazione salvata')
        router.refresh()
      } catch {
        toast.error('Errore salvataggio')
      }
    })
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Layout */}
      <div>
        <p className="mb-3 text-sm font-medium text-[--color-text]">Layout gallery</p>
        <div className="grid grid-cols-2 gap-3">
          {LAYOUTS.map((l) => (
            <button
              key={l.value}
              onClick={() =>
                setForm((f) => ({ ...f, layoutType: l.value as typeof form.layoutType }))
              }
              className={`rounded-lg border p-3 text-left transition-colors ${
                form.layoutType === l.value
                  ? 'bg-[--color-accent]/8 border-[--color-accent]'
                  : 'border-[--color-text]/10 hover:border-[--color-text]/20'
              }`}
            >
              <p
                className={`text-sm font-medium ${form.layoutType === l.value ? 'text-[--color-accent]' : 'text-[--color-text]'}`}
              >
                {l.label}
              </p>
              <p className="text-[--color-text]/40 mt-0.5 text-xs">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Colonne (Grid e Masonry) */}
      {(form.layoutType === 'GRID' || form.layoutType === 'MASONRY') && (
        <div>
          <p className="mb-3 text-sm font-medium text-[--color-text]">Numero colonne</p>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setForm((f) => ({ ...f, cols: n }))}
                className={`h-10 w-12 rounded border text-sm font-medium transition-colors ${
                  form.cols === n
                    ? 'bg-[--color-accent]/15 border-[--color-accent] text-[--color-accent]'
                    : 'border-[--color-text]/10 text-[--color-text]/50 hover:border-[--color-text]/20'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profondità default */}
      <label className="block">
        <span className="mb-3 block text-sm font-medium text-[--color-text]">
          Profondità di default
        </span>
        <select
          value={form.defaultDepth}
          onChange={(e) =>
            setForm((f) => ({ ...f, defaultDepth: e.target.value as typeof form.defaultDepth }))
          }
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        >
          <option value="THUMBNAIL">Thumbnail only</option>
          <option value="CARD">Card con excerpt</option>
          <option value="FULL">Pagina completa</option>
        </select>
      </label>

      {/* Toggle options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[--color-text]">Opzioni</p>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.hasFilters}
            onChange={(e) => setForm((f) => ({ ...f, hasFilters: e.target.checked }))}
            className="h-4 w-4 accent-[--color-accent]"
          />
          <div>
            <p className="text-sm text-[--color-text]">Filtri per categoria</p>
            <p className="text-[--color-text]/40 text-xs">
              Mostra i bottoni filtro sopra la gallery
            </p>
          </div>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.hasLightbox}
            onChange={(e) => setForm((f) => ({ ...f, hasLightbox: e.target.checked }))}
            className="h-4 w-4 accent-[--color-accent]"
          />
          <div>
            <p className="text-sm text-[--color-text]">Lightbox al click</p>
            <p className="text-[--color-text]/40 text-xs">
              Apre l&apos;immagine in overlay fullscreen
            </p>
          </div>
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={isPending}
        className="flex items-center gap-2 rounded bg-[--color-accent] px-5 py-2.5 text-sm font-medium text-[--color-primary] disabled:opacity-50"
      >
        <IconDeviceFloppy size={15} /> Salva configurazione
      </button>
    </div>
  )
}
