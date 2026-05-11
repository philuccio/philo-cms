'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getMediaList, uploadMedia } from '@/app/actions/media'
import { IconX, IconCheck, IconUpload } from '@tabler/icons-react'
import type { Media } from '@prisma/client'
import Image from 'next/image'

interface Props {
  onSelect: (media: Media) => void
  onSelectMultiple?: (media: Media[]) => void
  onClose: () => void
  multiple?: boolean
}

export function MediaPickerModal({ onSelect, onSelectMultiple, onClose, multiple = false }: Props) {
  const [items, setItems] = useState<Media[]>([])
  // single mode
  const [selected, setSelected] = useState<Media | null>(null)
  // multiple mode
  const [selectedMap, setSelectedMap] = useState<Map<string, Media>>(new Map())

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

      if (failed.length > 0) setUploadError(failed[0] ?? 'Errore upload')

      const fulfilled = results
        .filter((r): r is PromiseFulfilledResult<Media> => r.status === 'fulfilled')
        .map((r) => r.value)

      if (fulfilled.length > 0) {
        loadMedia()
        const last = fulfilled[fulfilled.length - 1]
        if (!multiple && last) {
          setSelected(last)
        } else {
          setSelectedMap((prev) => {
            const next = new Map(prev)
            fulfilled.forEach((m) => next.set(m.id, m))
            return next
          })
        }
      }
    },
    [loadMedia, multiple],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  function handleItemClick(media: Media) {
    if (!multiple) {
      setSelected(media)
    } else {
      setSelectedMap((prev) => {
        const next = new Map(prev)
        if (next.has(media.id)) next.delete(media.id)
        else next.set(media.id, media)
        return next
      })
    }
  }

  function handleConfirm() {
    if (!multiple) {
      if (selected) {
        onSelect(selected)
        onClose()
      }
    } else {
      const items = Array.from(selectedMap.values())
      if (items.length > 0) {
        onSelectMultiple?.(items)
        onClose()
      }
    }
  }

  const isSelected = (id: string) => (multiple ? selectedMap.has(id) : selected?.id === id)

  const selectionCount = multiple ? selectedMap.size : selected ? 1 : 0
  const canConfirm = selectionCount > 0

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.65)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
          borderRadius: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '48rem',
          maxHeight: '85vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderBottom: '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
          }}
        >
          <span style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '0.9375rem' }}>
            {multiple ? 'Scegli immagini' : 'Scegli immagine'}
          </span>
          <button
            onClick={onClose}
            style={{
              color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Upload zone */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
          }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderRadius: '0.5rem',
              border: `1px dashed ${isDragging ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 20%, transparent)'}`,
              backgroundColor: isDragging
                ? 'color-mix(in srgb, var(--color-accent) 5%, transparent)'
                : 'transparent',
              padding: '0.75rem 1rem',
              cursor: uploading ? 'wait' : 'pointer',
              opacity: uploading ? 0.6 : 1,
              transition: 'border-color 0.15s, background-color 0.15s',
              fontSize: '0.875rem',
            }}
          >
            {uploading ? (
              <>
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    border: '2px solid var(--color-accent)',
                    borderTopColor: 'transparent',
                    flexShrink: 0,
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                <span style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>
                  Caricamento in corso…
                </span>
              </>
            ) : (
              <>
                <IconUpload
                  size={16}
                  style={{
                    color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>
                  Trascina qui o{' '}
                  <span style={{ color: 'var(--color-accent)' }}>clicca per caricare</span> nuove
                  immagini
                </span>
              </>
            )}
          </div>
          {uploadError && (
            <p style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: '#f87171' }}>
              {uploadError}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.length) {
                void handleFiles(e.target.files)
                e.target.value = ''
              }
            }}
          />
        </div>

        {/* Image grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {items.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                padding: '4rem 0',
                fontSize: '0.875rem',
                color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
              }}
            >
              Nessuna immagine. Caricane una sopra.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.625rem',
              }}
            >
              {items.map((media) => {
                const sel = isSelected(media.id)
                return (
                  <button
                    key={media.id}
                    onClick={() => handleItemClick(media)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      overflow: 'hidden',
                      borderRadius: '0.375rem',
                      border: `2px solid ${sel ? 'var(--color-accent)' : 'transparent'}`,
                      padding: 0,
                      cursor: 'pointer',
                      background: 'none',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <Image
                      src={media.url}
                      alt={media.alt ?? media.filename}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    {sel && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor:
                            'color-mix(in srgb, var(--color-accent) 30%, transparent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: 'var(--color-accent)',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconCheck size={14} color="#fff" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderTop: '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'color-mix(in srgb, var(--color-text) 25%, transparent)',
            }}
          >
            {items.length} immagini
            {multiple && selectionCount > 0 && (
              <span style={{ marginLeft: '0.5rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                · {selectionCount} selezionat{selectionCount === 1 ? 'a' : 'e'}
              </span>
            )}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Annulla
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.375rem',
                backgroundColor: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                cursor: canConfirm ? 'pointer' : 'default',
                opacity: canConfirm ? 1 : 0.4,
                transition: 'opacity 0.15s',
              }}
            >
              {multiple
                ? selectionCount > 0
                  ? `Usa ${selectionCount} immagi${selectionCount === 1 ? 'ne' : 'ni'}`
                  : 'Scegli immagini'
                : 'Usa immagine'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
