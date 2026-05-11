'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  IconInfoCircle,
  IconAlignLeft,
  IconChartBar,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconDeviceFloppy,
  IconEye,
} from '@tabler/icons-react'
import {
  updateCaseStudy,
  saveKPIs,
  saveCaseMedia,
  type CaseFormData,
  type KPIInput,
  type CaseMediaInput,
} from '@/app/actions/cases'
import { KpiBuilder } from './KpiBuilder'
import { MediaPickerModal } from '@/components/admin/pages/MediaPickerModal'
import type { Media } from '@prisma/client'
import { IconPhoto, IconTrash, IconVideo } from '@tabler/icons-react'

interface CaseMediaItem extends CaseMediaInput {
  url: string
  type: string
  filename: string
}

interface CaseStudy {
  id: string
  title: string
  slug: string
  brief: string | null
  challenge: string | null
  approach: string | null
  solution: string | null
  results: string | null
  coverId: string | null
  projectId: string | null
  status: string
  kpis: KPIInput[]
  media: CaseMediaItem[]
}

interface CaseEditorProps {
  caseStudy: CaseStudy
}

const STEPS = [
  { label: 'Info base', Icon: IconInfoCircle },
  { label: 'Narrativa', Icon: IconAlignLeft },
  { label: 'KPI', Icon: IconChartBar },
  { label: 'Media', Icon: IconPhoto },
  { label: 'Revisione', Icon: IconCheck },
]

const SECTIONS = [
  { key: 'brief', label: 'Brief', placeholder: 'Contesto del progetto e obiettivi iniziali…' },
  {
    key: 'challenge',
    label: 'Sfida',
    placeholder: 'Quale problema o ostacolo era necessario risolvere…',
  },
  {
    key: 'approach',
    label: 'Approccio',
    placeholder: 'La strategia e il metodo adottato per affrontare la sfida…',
  },
  {
    key: 'solution',
    label: 'Soluzione',
    placeholder: 'Come è stata implementata la soluzione concretamente…',
  },
  {
    key: 'results',
    label: 'Risultati',
    placeholder: 'I risultati ottenuti e il valore generato per il cliente…',
  },
] as const

export function CaseEditor({ caseStudy }: CaseEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(0)
  const [coverPickerOpen, setCoverPickerOpen] = useState(false)

  const [form, setForm] = useState<CaseFormData>({
    title: caseStudy.title,
    slug: caseStudy.slug,
    brief: caseStudy.brief ?? '',
    challenge: caseStudy.challenge ?? '',
    approach: caseStudy.approach ?? '',
    solution: caseStudy.solution ?? '',
    results: caseStudy.results ?? '',
    coverId: caseStudy.coverId ?? '',
    projectId: caseStudy.projectId ?? '',
    status: caseStudy.status as 'DRAFT' | 'PUBLISHED',
  })

  const [kpis, setKpis] = useState<KPIInput[]>(caseStudy.kpis)
  const [mediaItems, setMediaItems] = useState<CaseMediaItem[]>(caseStudy.media)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  function set(field: keyof CaseFormData, value: string) {
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
        await updateCaseStudy(caseStudy.id, data)
        await saveKPIs(caseStudy.id, kpis)
        await saveCaseMedia(caseStudy.id, mediaItems)
        toast.success(publish ? 'Pubblicato' : 'Salvato')
        if (publish) router.push('/admin/cases')
      } catch {
        toast.error('Errore durante il salvataggio')
      }
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-[--color-text]/8 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/cases')}
            className="text-[--color-text]/40 flex items-center gap-1.5 text-sm transition-colors hover:text-[--color-text]"
          >
            <IconArrowLeft size={15} />
            Case History
          </button>
          <span className="text-[--color-text]/20">/</span>
          <span className="text-sm font-medium text-[--color-text]">{form.title || 'Nuovo'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={isPending}
            className="border-[--color-text]/15 text-[--color-text]/60 hover:bg-[--color-text]/5 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-50"
          >
            <IconDeviceFloppy size={15} />
            Salva bozza
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isPending}
            className="btn-primary px-3 py-1.5"
          >
            <IconEye size={15} />
            Pubblica
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-[--color-text]/8 flex items-center gap-0 border-b bg-[--color-sidebar] px-6">
        {STEPS.map(({ label, Icon }, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
              i === step
                ? 'border-[--color-accent] text-[--color-accent]'
                : 'text-[--color-text]/40 border-transparent hover:text-[--color-text]'
            }`}
          >
            <Icon size={15} stroke={1.5} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Step 0 — Info base */}
        {step === 0 && (
          <div className="mx-auto max-w-2xl space-y-5">
            <div>
              <label className="field-label">Titolo *</label>
              <input
                value={form.title}
                onChange={(e) => {
                  set('title', e.target.value)
                  set('slug', autoSlug(e.target.value))
                }}
                placeholder="Es. Rebranding per Studio Legale Rossi"
                className="field-base"
              />
            </div>

            <div>
              <label className="field-label">Slug URL</label>
              <div className="border-[--color-text]/12 bg-[--color-text]/4 flex items-center rounded-lg border">
                <span className="border-[--color-text]/10 text-[--color-text]/40 border-r px-3 py-2 text-xs">
                  /cases/
                </span>
                <input
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[--color-text] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Immagine copertina</label>
              <div className="flex items-center gap-3">
                {form.coverId ? (
                  <img
                    src={form.coverId}
                    alt="cover"
                    className="h-20 w-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-[--color-text]/5 border-[--color-text]/10 text-[--color-text]/30 flex h-20 w-32 items-center justify-center rounded-lg border text-xs">
                    Nessuna
                  </div>
                )}
                <button
                  onClick={() => setCoverPickerOpen(true)}
                  className="border-[--color-text]/15 text-[--color-text]/60 hover:bg-[--color-text]/5 rounded-lg border px-3 py-1.5 text-sm transition-colors"
                >
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

            <div>
              <label className="field-label">Stato</label>
              <div className="flex gap-2">
                {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => set('status', s)}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      form.status === s
                        ? 'bg-[--color-accent]/15 border-[--color-accent]/40 border text-[--color-accent]'
                        : 'border-[--color-text]/12 text-[--color-text]/50 hover:bg-[--color-text]/5 border'
                    }`}
                  >
                    {s === 'DRAFT' ? 'Bozza' : 'Pubblicato'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Narrativa */}
        {step === 1 && (
          <div className="mx-auto max-w-2xl space-y-6">
            {SECTIONS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="field-label">{label}</label>
                <textarea
                  value={(form[key as keyof CaseFormData] as string) ?? ''}
                  onChange={(e) => set(key as keyof CaseFormData, e.target.value)}
                  placeholder={placeholder}
                  rows={5}
                  className="field-base resize-y"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — KPI */}
        {step === 2 && (
          <div className="mx-auto max-w-3xl">
            <p className="text-[--color-text]/50 mb-4 text-sm">
              Aggiungi i risultati chiave del progetto. Ogni KPI verrà mostrato in evidenza nella
              pagina pubblica del case study.
            </p>
            <KpiBuilder initialKpis={kpis} onChange={setKpis} />
          </div>
        )}

        {/* Step 3 — Media */}
        {step === 3 && (
          <div className="mx-auto max-w-3xl">
            <p className="text-[--color-text]/50 mb-4 text-sm">
              Aggiungi foto e video del progetto. Vengono mostrati nella galleria del case study.
            </p>

            {/* Grid */}
            {mediaItems.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {mediaItems.map((item, i) => (
                  <div
                    key={item.mediaId}
                    className="bg-[--color-text]/5 group relative aspect-video overflow-hidden rounded-lg"
                  >
                    {item.type === 'VIDEO' ? (
                      <div className="flex h-full items-center justify-center">
                        <IconVideo size={28} className="text-[--color-text]/30" />
                        <p className="text-[--color-text]/50 absolute bottom-1 left-0 right-0 truncate px-2 text-center text-[10px]">
                          {item.filename}
                        </p>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="h-full w-full object-cover"
                      />
                    )}
                    {/* Caption input */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 p-1.5 transition-transform group-hover:translate-y-0">
                      <input
                        value={item.caption ?? ''}
                        onChange={(e) =>
                          setMediaItems((prev) =>
                            prev.map((m, j) => (j === i ? { ...m, caption: e.target.value } : m)),
                          )
                        }
                        placeholder="Didascalia…"
                        className="w-full bg-transparent text-[10px] text-white outline-none placeholder:text-white/40"
                      />
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => setMediaItems((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                    >
                      <IconTrash size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setMediaPickerOpen(true)}
              className="border-[--color-text]/15 text-[--color-text]/50 hover:border-[--color-accent]/50 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm transition-colors hover:text-[--color-accent]"
            >
              <IconPhoto size={16} />
              Aggiungi foto / video
            </button>
          </div>
        )}

        {/* Step 4 — Revisione */}
        {step === 4 && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="border-[--color-text]/8 rounded-xl border p-6">
              <h3 className="mb-4 font-semibold text-[--color-text]">Riepilogo</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">Titolo</dt>
                  <dd className="text-[--color-text]">{form.title || '—'}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">Slug</dt>
                  <dd className="text-[--color-text]/70 font-mono text-xs">/cases/{form.slug}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">Stato</dt>
                  <dd
                    className={
                      form.status === 'PUBLISHED' ? 'text-emerald-600' : 'text-[--color-text]/50'
                    }
                  >
                    {form.status === 'PUBLISHED' ? 'Pubblicato' : 'Bozza'}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">Sezioni</dt>
                  <dd className="text-[--color-text]">
                    {
                      SECTIONS.filter(({ key }) =>
                        (form[key as keyof CaseFormData] as string)?.trim(),
                      ).length
                    }{' '}
                    / {SECTIONS.length} compilate
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">KPI</dt>
                  <dd className="text-[--color-text]">{kpis.length} aggiunti</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">Media</dt>
                  <dd className="text-[--color-text]">{mediaItems.length} file</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-[--color-text]/40 w-32 flex-shrink-0">Copertina</dt>
                  <dd className="text-[--color-text]">{form.coverId ? 'Impostata' : 'Assente'}</dd>
                </div>
              </dl>
            </div>

            {kpis.length > 0 && (
              <div className="border-[--color-text]/8 rounded-xl border p-6">
                <h3 className="mb-4 font-semibold text-[--color-text]">KPI</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {kpis.map((k, i) => (
                    <div key={i} className="bg-[--color-text]/4 rounded-lg p-3">
                      <p className="text-lg font-semibold text-[--color-accent]">{k.value}</p>
                      <p className="text-xs font-medium text-[--color-text]">{k.label}</p>
                      {k.delta && (
                        <p className="text-[--color-text]/40 mt-0.5 text-xs">{k.delta}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={isPending}
                className="border-[--color-text]/15 text-[--color-text]/60 hover:bg-[--color-text]/5 flex-1 rounded-lg border py-2.5 text-sm transition-colors disabled:opacity-50"
              >
                Salva come bozza
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isPending}
                className="btn-primary flex-1 justify-center py-2.5"
              >
                Pubblica case study
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step nav */}
      <div className="border-[--color-text]/8 flex items-center justify-between border-t px-6 py-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-[--color-text]/40 flex items-center gap-1.5 text-sm transition-colors hover:text-[--color-text] disabled:opacity-30"
        >
          <IconArrowLeft size={15} />
          Indietro
        </button>
        <span className="text-[--color-text]/30 text-xs">
          {step + 1} / {STEPS.length}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="text-[--color-text]/40 flex items-center gap-1.5 text-sm transition-colors hover:text-[--color-text] disabled:opacity-30"
        >
          Avanti
          <IconArrowRight size={15} />
        </button>
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

      {mediaPickerOpen && (
        <MediaPickerModal
          multiple
          onSelect={() => {}}
          onSelectMultiple={(medias) => {
            setMediaItems((prev) => {
              const existingIds = new Set(prev.map((m) => m.mediaId))
              const toAdd = medias
                .filter((m) => !existingIds.has(m.id))
                .map((m, i) => ({
                  mediaId: m.id,
                  url: m.url,
                  type: m.type,
                  filename: m.filename,
                  caption: undefined,
                  order: prev.length + i,
                }))
              return [...prev, ...toAdd]
            })
            setMediaPickerOpen(false)
          }}
          onClose={() => setMediaPickerOpen(false)}
        />
      )}
    </div>
  )
}
