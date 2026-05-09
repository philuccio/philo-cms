'use client'

import type { QuoteBlockContent } from '@philo/types'

interface Props {
  content: QuoteBlockContent
  onChange: (c: QuoteBlockContent) => void
}

export function QuoteEditor({ content, onChange }: Props) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Citazione *</span>
        <textarea
          value={content.text}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          rows={4}
          className="border-[--color-text]/15 w-full resize-y rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Autore</span>
        <input
          value={content.author ?? ''}
          onChange={(e) => onChange({ ...content, author: e.target.value })}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Ruolo / Azienda</span>
        <input
          value={content.role ?? ''}
          onChange={(e) => onChange({ ...content, role: e.target.value })}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>
    </div>
  )
}
