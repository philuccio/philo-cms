'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMedia } from '@/app/actions/media'

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files)
      setErrors([])
      setUploading(arr.map((f) => f.name))

      const results = await Promise.allSettled(
        arr.map((file) => {
          const fd = new FormData()
          fd.set('file', file)
          return uploadMedia(fd)
        }),
      )

      const failed = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r: PromiseRejectedResult) => String((r.reason as Error).message ?? r.reason))

      setUploading([])
      if (failed.length > 0) setErrors(failed)
      router.refresh()
    },
    [router],
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
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-8 py-10 text-center transition-colors ${
          isDragging
            ? 'bg-[--color-accent]/5 border-[--color-accent]'
            : 'border-[--color-text]/15 hover:border-[--color-text]/30'
        }`}
      >
        {uploading.length > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-[--color-accent] border-t-transparent" />
            <p className="text-[--color-text]/50 text-sm">Caricamento: {uploading.join(', ')}</p>
          </div>
        ) : (
          <>
            <p className="text-[--color-text]/20 text-2xl">↑</p>
            <p className="text-[--color-text]/50 mt-2 text-sm font-medium">
              Trascina file o clicca per selezionare
            </p>
            <p className="text-[--color-text]/25 mt-1 text-xs">
              PNG · JPG · WEBP · GIF · SVG · PDF · MP4 — max 20 MB
            </p>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-400">
              {err}
            </p>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf,.svg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            void handleFiles(e.target.files)
            e.target.value = ''
          }
        }}
      />
    </div>
  )
}
