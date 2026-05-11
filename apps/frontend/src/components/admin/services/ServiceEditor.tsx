'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconArrowLeft, IconDeviceFloppy, IconEye } from '@tabler/icons-react'
import { updateService, type ServiceFormData, type ServiceLevel } from '@/app/actions/services'
import { MediaPickerModal } from '@/components/admin/pages/MediaPickerModal'
import type { Media } from '@prisma/client'

const LEVEL_LABELS: Record<ServiceLevel, string> = {
  L1_CARD: 'Servizio (L1)',
  L2_PAGE: 'Sotto-servizio (L2)',
  L3_PACKAGE: 'Pacchetto (L3)',
}

const TABLER_SUGGESTIONS = [
  'IconBriefcase',
  'IconPalette',
  'IconCode',
  'IconBulb',
  'IconRocket',
  'IconCamera',
  'IconPencil',
  'IconGraph',
  'IconDevices',
  'IconWorld',
  'IconMegaphone',
  'IconChartBar',
  'IconCrown',
  'IconStar',
  'IconHeart',
]

interface ServiceEditorProps {
  service: {
    id: string
    title: string
    slug: string
    icon: string | null
    descShort: string | null
    descLong: string | null
    level: ServiceLevel
    parentId: string | null
    accentColor: string | null
    coverId: string | null
    status: string
  }
  parentTitle?: string
}

export function ServiceEditor({ service, parentTitle }: ServiceEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [coverPickerOpen, setCoverPickerOpen] = useState(false)
  const [form, setForm] = useState<ServiceFormData>({
    title: service.title,
    slug: service.slug,
    icon: service.icon ?? '',
    descShort: service.descShort ?? '',
    descLong: service.descLong ?? '',
    coverId: service.coverId ?? '',
    accentColor: service.accentColor ?? '#6366f1',
    status: service.status as 'DRAFT' | 'PUBLISHED',
  })

  function set(field: keyof ServiceFormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[àáâ]/g, 'a')
      .replace(/[èéê]/g, 'e')
      .replace(/[ìíî]/g, 'i')
      .replace(/[òóô]/g, 'o')
      .replace(/[ùúû]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleSave(publish?: boolean) {
    startTransition(async () => {
      try {
        const data = { ...form }
        if (publish !== undefined) data.status = publish ? 'PUBLISHED' : 'DRAFT'
        await updateService(service.id, data)
        toast.success(publish ? 'Pubblicato' : 'Salvato')
        if (publish !== undefined) router.push('/admin/services')
      } catch {
        toast.error('Errore durante il salvataggio')
      }
    })
  }

  const isL1 = service.level === 'L1_CARD'

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-[--color-text]/8 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/services')}
            className="text-[--color-text]/40 flex items-center gap-1.5 text-sm transition-colors hover:text-[--color-text]"
          >
            <IconArrowLeft size={15} />
            Servizi
          </button>
          {parentTitle && (
            <>
              <span className="text-[--color-text]/20">/</span>
              <span className="text-[--color-text]/50 text-sm">{parentTitle}</span>
            </>
          )}
          <span className="text-[--color-text]/20">/</span>
          <span className="text-sm font-medium text-[--color-text]">{form.title || 'Nuovo'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[--color-text]/8 text-[--color-text]/50 rounded px-2 py-0.5 text-xs">
            {LEVEL_LABELS[service.level]}
          </span>
          <button onClick={() => handleSave(false)} disabled={isPending} className="btn-secondary">
            <IconDeviceFloppy size={15} />
            Salva bozza
          </button>
          <button onClick={() => handleSave(true)} disabled={isPending} className="btn-primary">
            <IconEye size={15} />
            Pubblica
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {/* Titolo */}
          <div>
            <label className="field-label">Titolo *</label>
            <input
              value={form.title}
              onChange={(e) => {
                set('title', e.target.value)
                set('slug', autoSlug(e.target.value))
              }}
              placeholder="Es. Web Design"
              className="field-base"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="field-label">Slug URL</label>
            <div className="border-[--color-text]/12 bg-[--color-text]/4 flex items-center rounded-lg border">
              <span className="border-[--color-text]/10 text-[--color-text]/40 border-r px-3 py-2 text-xs">
                /services/
              </span>
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[--color-text] outline-none"
              />
            </div>
          </div>

          {/* Descrizione breve */}
          <div>
            <label className="field-label">Descrizione breve</label>
            <textarea
              value={form.descShort ?? ''}
              onChange={(e) => set('descShort', e.target.value)}
              placeholder="Una riga che descrive il servizio per le card e anteprime…"
              rows={2}
              className="field-base resize-none"
            />
          </div>

          {/* Descrizione lunga (L2 e L3) */}
          {!isL1 && (
            <div>
              <label className="field-label">Descrizione completa</label>
              <textarea
                value={form.descLong ?? ''}
                onChange={(e) => set('descLong', e.target.value)}
                placeholder="Contenuto dettagliato della pagina servizio…"
                rows={8}
                className="field-base resize-y"
              />
            </div>
          )}

          {/* Icona (solo L1) */}
          {isL1 && (
            <div>
              <label className="field-label">Icona Tabler</label>
              <input
                value={form.icon ?? ''}
                onChange={(e) => set('icon', e.target.value)}
                placeholder="Es. IconBriefcase"
                className="field-base"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TABLER_SUGGESTIONS.map((name) => (
                  <button
                    key={name}
                    onClick={() => set('icon', name)}
                    className={`rounded px-2 py-1 text-xs transition-colors ${
                      form.icon === name
                        ? 'bg-[--color-accent]/15 text-[--color-accent]'
                        : 'bg-[--color-text]/5 text-[--color-text]/50 hover:bg-[--color-text]/10'
                    }`}
                  >
                    {name.replace('Icon', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colore accento (solo L1) */}
          {isL1 && (
            <div>
              <label className="field-label">Colore accento</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.accentColor ?? '#6366f1'}
                  onChange={(e) => set('accentColor', e.target.value)}
                  className="border-[--color-text]/12 h-9 w-16 cursor-pointer rounded border bg-transparent p-0.5"
                />
                <input
                  value={form.accentColor ?? '#6366f1'}
                  onChange={(e) => set('accentColor', e.target.value)}
                  placeholder="#6366f1"
                  className="field-base w-32"
                />
                <div
                  className="h-9 w-9 rounded-lg"
                  style={{ backgroundColor: form.accentColor ?? '#6366f1' }}
                />
              </div>
            </div>
          )}

          {/* Immagine copertina */}
          <div>
            <label className="field-label">Immagine copertina</label>
            <div className="flex items-center gap-3">
              {form.coverId ? (
                <img src={form.coverId} alt="cover" className="h-20 w-32 rounded-lg object-cover" />
              ) : (
                <div className="border-[--color-text]/10 bg-[--color-text]/5 text-[--color-text]/30 flex h-20 w-32 items-center justify-center rounded-lg border text-xs">
                  Nessuna
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button onClick={() => setCoverPickerOpen(true)} className="btn-secondary text-sm">
                  {form.coverId ? 'Cambia' : 'Seleziona'}
                </button>
                {form.coverId && (
                  <button
                    onClick={() => set('coverId', '')}
                    className="text-[--color-text]/40 text-sm transition-colors hover:text-red-400"
                  >
                    Rimuovi
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stato */}
          <div>
            <label className="field-label">Stato</label>
            <div className="flex gap-2">
              {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => set('status', s)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    form.status === s
                      ? 'border-[--color-accent]/40 bg-[--color-accent]/15 text-[--color-accent]'
                      : 'border-[--color-text]/12 text-[--color-text]/50 hover:bg-[--color-text]/5'
                  }`}
                >
                  {s === 'DRAFT' ? 'Bozza' : 'Pubblicato'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {coverPickerOpen && (
        <MediaPickerModal
          onSelect={(media: Media) => {
            set('coverId', media.url)
            setCoverPickerOpen(false)
          }}
          onClose={() => setCoverPickerOpen(false)}
        />
      )}
    </div>
  )
}
