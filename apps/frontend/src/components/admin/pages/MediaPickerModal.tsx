'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getMediaList, uploadMedia } from '@/app/actions/media'
import { IconX, IconCheck, IconUpload } from '@tabler/icons-react'
import type { Media } from '@prisma/client'
import Image from 'next/image'

interface Props {
  onSelect: (media: Media) => void
  onClose: () => void
}

export function MediaPickerModal({ onSelect, onClose }: Props) {
  const [items, setItems] = useState<Media[]>([])
  const [selected, setSelected] = useState<Media | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadMedia = useCallback(() => {
    getMediaList({ type: 'IMAGE' }).then((d) => setItems(d.items))
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files)
      setUploading(true)
      setUploadError(null)

      const results = await Promise.allSettled(
        arr.map((file) => {
          const fd = new FormData()
          fd.set('file', file)
          return uploadMedia(fd)
        }),
      )

      setUploading(false)

      const failed = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => String((r.reason as Error).message ?? r.reason))

      if (failed.length > 0) {
        setUploadError(failed[0] ?? 'Errore upload')
      }

      // Reload list and auto-select last uploaded
      const fulfilled = results
        .filter((r): r is PromiseFulfilledResult<Media> => r.status === 'fulfilled')
        .map((r) => r.value)

      if (fulfilled.length > 0) {
        loadMedia()
        setSelected(fulfilled[fulfilled.length - 1] ?? null)
      }
    },
    [loadMedia],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-[--color-text]/10 flex max-h-[85vh] w-full max-w-3xl flex-col rounded-lg border bg-[--color-bg]">
        {/* Header */}
        <div className="border-[--color-text]/10 flex items-center justify-between border-b p-4">
          <span className="font-medium text-[--color-text]">Scegli immagine</span>
          <button onClick={onClose} className="text-[--color-text]/40 hover:text-[--color-text]">
            <IconX size={18} />
          </button>
        </div>

        {/* Upload zone */}
        <div className="border-[--color-text]/10 border-b px-4 py-3">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm transition-colors ${
              isDragging
                ? 'bg-[--color-accent]/5 border-[--color-accent]'
                : 'border-[--color-text]/15 hover:border-[--color-text]/30'
            } ${uploading ? 'cursor-wait opacity-60' : ''}`}
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[--color-accent] border-t-transparent" />
                <span className="text-[--color-text]/50">Caricamento in corso…</span>
              </>
            ) : (
              <>
                <IconUpload size={16} className="text-[--color-text]/30 shrink-0" />
                <span className="text-[--color-text]/50">
                  Trascina qui o <span className="text-[--color-accent]">clicca per caricare</span>{' '}
                  nuove immagini
                </span>
              </>
            )}
          </div>
          {uploadError && <p className="mt-1.5 text-xs text-red-400">{uploadError}</p>}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                void handleFiles(e.target.files)
                e.target.value = ''
              }
            }}
          />
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-[--color-text]/30 py-16 text-center text-sm">
              Nessuna immagine. Caricane una sopra.
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

        {/* Footer */}
        <div className="border-[--color-text]/10 flex items-center justify-between border-t p-4">
          <span className="text-[--color-text]/25 text-xs">{items.length} immagini</span>
          <div className="flex gap-3">
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
    </div>
  )
}
