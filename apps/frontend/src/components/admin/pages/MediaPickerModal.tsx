'use client'

import { useEffect, useState } from 'react'
import { getMediaList } from '@/app/actions/media'
import { IconX, IconCheck } from '@tabler/icons-react'
import type { Media } from '@prisma/client'
import Image from 'next/image'

interface Props {
  onSelect: (media: Media) => void
  onClose: () => void
}

export function MediaPickerModal({ onSelect, onClose }: Props) {
  const [items, setItems] = useState<Media[]>([])
  const [selected, setSelected] = useState<Media | null>(null)

  useEffect(() => {
    getMediaList({ type: 'IMAGE' }).then((d) => setItems(d.items))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-[--color-text]/10 flex max-h-[80vh] w-full max-w-3xl flex-col rounded-lg border bg-[--color-bg]">
        <div className="border-[--color-text]/10 flex items-center justify-between border-b p-4">
          <span className="font-medium text-[--color-text]">Scegli immagine</span>
          <button onClick={onClose} className="text-[--color-text]/40 hover:text-[--color-text]">
            <IconX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-[--color-text]/30 py-16 text-center text-sm">
              Nessuna immagine disponibile
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
              {items.map((media) => (
                <button
                  key={media.id}
                  onClick={() => setSelected(media)}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                    selected?.id === media.id
                      ? 'border-[--color-accent]'
                      : 'hover:border-[--color-text]/20 border-transparent'
                  }`}
                >
                  <Image
                    src={media.url}
                    alt={media.alt ?? media.filename}
                    fill
                    className="object-cover"
                  />
                  {selected?.id === media.id && (
                    <div className="bg-[--color-accent]/30 absolute inset-0 flex items-center justify-center">
                      <IconCheck size={20} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-[--color-text]/10 flex justify-end gap-3 border-t p-4">
          <button
            onClick={onClose}
            className="text-[--color-text]/60 px-4 py-2 text-sm hover:text-[--color-text]"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (selected) {
                onSelect(selected)
                onClose()
              }
            }}
            disabled={!selected}
            className="rounded bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-primary] disabled:opacity-40"
          >
            Usa immagine
          </button>
        </div>
      </div>
    </div>
  )
}
