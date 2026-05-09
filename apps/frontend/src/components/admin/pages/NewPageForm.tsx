'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createPage } from '@/app/actions/pages'
import type { Route } from 'next'

export function NewPageForm() {
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
        const page = await createPage({ title: title.trim(), slug: slug.trim() })
        router.push(`/admin/pages/${page.id}` as Route)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore creazione pagina')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Titolo pagina *</span>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          autoFocus
          className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
          placeholder="Home, Chi siamo, Contatti…"
        />
      </label>

      <label className="block">
        <span className="text-[--color-text]/50 mb-1 block text-xs">Slug (URL) *</span>
        <div className="border-[--color-text]/15 flex items-center gap-0 overflow-hidden rounded border">
          <span className="text-[--color-text]/30 bg-[--color-text]/5 border-[--color-text]/15 border-r px-3 py-2 text-sm">
            /
          </span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="flex-1 bg-[--color-bg] px-3 py-2 font-mono text-sm text-[--color-text]"
            placeholder="home"
          />
        </div>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[--color-text]/50 px-4 py-2 text-sm hover:text-[--color-text]"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={isPending || !title.trim() || !slug.trim()}
          className="rounded bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-primary] disabled:opacity-50"
        >
          {isPending ? 'Creazione…' : 'Crea pagina'}
        </button>
      </div>
    </form>
  )
}
