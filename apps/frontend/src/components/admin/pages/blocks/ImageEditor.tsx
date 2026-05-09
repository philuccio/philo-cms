'use client'

import { useState } from 'react'
import { MediaPickerModal } from '../MediaPickerModal'
import type { ImageBlockContent } from '@philo/types'
import type { Media } from '@prisma/client'
import Image from 'next/image'

interface Props {
  content: ImageBlockContent
  onChange: (c: ImageBlockContent) => void
}

export function ImageEditor({ content, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)

  const handleSelect = (media: Media) => {
    onChange({ ...content, mediaId: media.id, url: media.url, alt: media.alt ?? media.filename })
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[--color-text]/50 mb-1 block text-xs">Immagine</span>
        {content.url ? (
          <div className="relative mb-2 h-40 overflow-hidden rounded">
            <Image src={content.url} alt={content.alt} fill className="object-cover" />
            <button
              onClick={() => onChange({ ...content, mediaId: '', url: '', alt: '' })}
              className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white"
            >
              Rimuovi
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="border-[--color-text]/20 text-[--color-text]/40 hover:text-[--color-text]/70 w-full rounded border border-dashed px-4 py-6 text-center text-sm"
          >
            + Scegli immagine dalla libreria
          </button>
        )}
        {content.url && (
          <button
            onClick={() => setShowPicker(true)}
            className="text-xs text-[--color-accent] hover:underline"
          >
            Cambia immagine
          </button>
        )}
      </div>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Testo alternativo (alt)</span>
        <input
          value={content.alt}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Didascalia</span>
        <input
          value={content.caption ?? ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Larghezza</span>
        <select
          value={content.width ?? 'contained'}
          onChange={(e) =>
            onChange({ ...content, width: e.target.value as ImageBlockContent['width'] })
          }
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
        >
          <option value="full">Piena larghezza</option>
          <option value="contained">Contenuta</option>
          <option value="narrow">Stretta</option>
        </select>
      </label>

      {showPicker && (
        <MediaPickerModal onSelect={handleSelect} onClose={() => setShowPicker(false)} />
      )}
    </div>
  )
}
