'use client'

import { useState } from 'react'
import { MediaPickerModal } from '../MediaPickerModal'
import type { HeroBlockContent } from '@philo/types'
import type { Media } from '@prisma/client'
import Image from 'next/image'

interface Props {
  content: HeroBlockContent
  onChange: (c: HeroBlockContent) => void
}

export function HeroEditor({ content, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)

  const set = <K extends keyof HeroBlockContent>(key: K, value: HeroBlockContent[K]) =>
    onChange({ ...content, [key]: value })

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Variante</span>
        <select
          value={content.variant}
          onChange={(e) => set('variant', e.target.value as HeroBlockContent['variant'])}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        >
          <option value="fullscreen">Fullscreen</option>
          <option value="split">Split</option>
          <option value="minimal">Minimal</option>
        </select>
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Titolo *</span>
        <input
          value={content.heading}
          onChange={(e) => set('heading', e.target.value)}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Sottotitolo</span>
        <input
          value={content.subheading ?? ''}
          onChange={(e) => set('subheading', e.target.value)}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <div>
        <span className="text-[--color-text]/50 mb-1 block text-xs">Immagine di sfondo</span>
        {content.mediaUrl ? (
          <div className="relative mb-2 h-32 overflow-hidden rounded">
            <Image src={content.mediaUrl} alt="" fill className="object-cover" />
            <button
              onClick={() => onChange({ ...content, mediaUrl: undefined })}
              className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white"
            >
              Rimuovi
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="border-[--color-text]/20 text-[--color-text]/40 hover:text-[--color-text]/70 w-full rounded border border-dashed px-4 py-3 text-left text-sm"
          >
            + Scegli immagine
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[--color-text]/50 mb-1 block text-xs">Etichetta CTA</span>
          <input
            value={content.ctaLabel ?? ''}
            onChange={(e) => set('ctaLabel', e.target.value)}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          />
        </label>
        <label className="block">
          <span className="text-[--color-text]/50 mb-1 block text-xs">Link CTA</span>
          <input
            value={content.ctaHref ?? ''}
            onChange={(e) => set('ctaHref', e.target.value)}
            className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
            placeholder="/contatti"
          />
        </label>
      </div>

      {showPicker && (
        <MediaPickerModal
          onSelect={(m: Media) => onChange({ ...content, mediaUrl: m.url, mediaType: 'image' })}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
