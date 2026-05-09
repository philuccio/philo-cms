'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconX } from '@tabler/icons-react'
import { createProject } from '@/app/actions/gallery'
import type { Route } from 'next'

interface Props {
  onClose: () => void
}

export function NewProjectModal({ onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  const handleTitleChange = (v: string) => {
    setTitle(v)
    setSlug(
      v
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return
    startTransition(async () => {
      try {
        const project = await createProject({ title: title.trim(), slug: slug.trim() })
        router.push(`/admin/gallery/${project.id}` as Route)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore creazione progetto')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-[--color-text]/10 w-full max-w-md rounded-lg border bg-[--color-bg]">
        <div className="border-[--color-text]/10 flex items-center justify-between border-b p-4">
          <span className="font-medium text-[--color-text]">Nuovo progetto</span>
          <button onClick={onClose} className="text-[--color-text]/40 hover:text-[--color-text]">
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <label className="block">
            <span className="text-[--color-text]/50 mb-1 block text-xs">Titolo *</span>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              autoFocus
              className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
              placeholder="Brand identity per Acme"
            />
          </label>

          <label className="block">
            <span className="text-[--color-text]/50 mb-1 block text-xs">Slug (URL) *</span>
            <div className="border-[--color-text]/15 flex items-center overflow-hidden rounded border">
              <span className="text-[--color-text]/30 bg-[--color-text]/5 border-[--color-text]/15 border-r px-3 py-2 text-sm">
                /gallery/
              </span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="flex-1 bg-[--color-bg] px-3 py-2 font-mono text-sm text-[--color-text]"
              />
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[--color-text]/50 px-4 py-2 text-sm hover:text-[--color-text]"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim() || !slug.trim()}
              className="flex-1 rounded bg-[--color-accent] py-2 text-sm font-medium text-[--color-primary] disabled:opacity-50"
            >
              {isPending ? 'Creazione…' : 'Crea e modifica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
