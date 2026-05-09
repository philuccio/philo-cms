'use client'

import DOMPurify from 'dompurify'
import type { TextBlockContent } from '@philo/types'

interface Props {
  content: TextBlockContent
  onChange: (c: TextBlockContent) => void
}

export function TextEditor({ content, onChange }: Props) {
  const set = <K extends keyof TextBlockContent>(key: K, value: TextBlockContent[K]) =>
    onChange({ ...content, [key]: value })

  const safeHtml = DOMPurify.sanitize(content.html)

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <label className="flex-1">
          <span className="text-[--color-text]/50 mb-1 block text-xs">Allineamento</span>
          <select
            value={content.align ?? 'left'}
            onChange={(e) => set('align', e.target.value as TextBlockContent['align'])}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          >
            <option value="left">Sinistra</option>
            <option value="center">Centro</option>
            <option value="right">Destra</option>
          </select>
        </label>
        <label className="flex-1">
          <span className="text-[--color-text]/50 mb-1 block text-xs">Colonne</span>
          <select
            value={content.columns ?? 1}
            onChange={(e) => set('columns', Number(e.target.value) as 1 | 2)}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          >
            <option value={1}>1 colonna</option>
            <option value={2}>2 colonne</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Testo (HTML)</span>
        <textarea
          value={content.html}
          onChange={(e) => set('html', e.target.value)}
          rows={10}
          className="border-[--color-text]/15 w-full resize-y rounded border bg-[--color-bg] px-3 py-2 font-mono text-sm text-[--color-text]"
        />
      </label>

      {safeHtml && (
        <div>
          <span className="text-[--color-text]/50 mb-2 block text-xs">Anteprima</span>
          {/* safeHtml is sanitized with DOMPurify */}
          <div
            className="prose prose-sm border-[--color-text]/10 max-w-none rounded border p-4 text-sm leading-relaxed text-[--color-text]"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>
      )}
    </div>
  )
}
