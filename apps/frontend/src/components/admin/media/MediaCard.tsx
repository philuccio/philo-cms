'use client'

import Image from 'next/image'
import { useState } from 'react'
import { deleteMedia } from '@/app/actions/media'
import type { Media } from '@prisma/client'

interface MediaCardProps {
  media: Media
  onDelete: () => void
}

export function MediaCard({ media, onDelete }: MediaCardProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Eliminare "${media.filename}"?`)) return
    setDeleting(true)
    try {
      await deleteMedia(media.id)
      onDelete()
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="border-[--color-text]/10 bg-[--color-text]/5 group relative overflow-hidden rounded-lg border">
      <div className="aspect-square overflow-hidden">
        {media.type === 'IMAGE' ? (
          <Image
            src={media.thumbUrl ?? media.url}
            alt={media.alt ?? media.filename}
            width={200}
            height={200}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[--color-text]/20 text-4xl">
              {media.type === 'VIDEO' ? '▶' : '⊡'}
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="p-2.5">
          <p className="truncate text-[11px] text-white/90">{media.filename}</p>
          {media.width != null && media.height != null && (
            <p className="text-[10px] text-white/50">
              {media.width}×{media.height}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          void handleDelete()
        }}
        disabled={deleting}
        title="Elimina"
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-black/60 text-sm text-white/70 opacity-0 transition-opacity hover:bg-red-500 hover:text-white disabled:cursor-not-allowed group-hover:opacity-100"
      >
        ×
      </button>

      {deleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
    </div>
  )
}
