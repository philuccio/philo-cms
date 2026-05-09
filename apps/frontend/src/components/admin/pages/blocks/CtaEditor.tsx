'use client'

import type { CtaBlockContent } from '@philo/types'

interface Props {
  content: CtaBlockContent
  onChange: (c: CtaBlockContent) => void
}

export function CtaEditor({ content, onChange }: Props) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Titolo *</span>
        <input
          value={content.heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Sottotesto</span>
        <textarea
          value={content.body ?? ''}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          rows={3}
          className="border-[--color-text]/15 w-full resize-y rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[--color-text]/50 mb-1 block text-xs">
            Etichetta pulsante primario *
          </span>
          <input
            value={content.primaryLabel}
            onChange={(e) => onChange({ ...content, primaryLabel: e.target.value })}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          />
        </label>
        <label className="block">
          <span className="text-[--color-text]/50 mb-1 block text-xs">Link primario *</span>
          <input
            value={content.primaryHref}
            onChange={(e) => onChange({ ...content, primaryHref: e.target.value })}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
            placeholder="/contatti"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[--color-text]/50 mb-1 block text-xs">
            Etichetta pulsante secondario
          </span>
          <input
            value={content.secondaryLabel ?? ''}
            onChange={(e) => onChange({ ...content, secondaryLabel: e.target.value })}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          />
        </label>
        <label className="block">
          <span className="text-[--color-text]/50 mb-1 block text-xs">Link secondario</span>
          <input
            value={content.secondaryHref ?? ''}
            onChange={(e) => onChange({ ...content, secondaryHref: e.target.value })}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          />
        </label>
      </div>
    </div>
  )
}
