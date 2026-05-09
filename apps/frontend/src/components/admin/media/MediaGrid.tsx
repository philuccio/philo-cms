'use client'

import { useRouter } from 'next/navigation'
import { MediaCard } from './MediaCard'
import type { Media } from '@prisma/client'

interface MediaGridProps {
  items: Media[]
  total: number
}

export function MediaGrid({ items, total }: MediaGridProps) {
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[--color-text]/25">Nessun file caricato</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[--color-text]/30 mb-4 text-xs">{total} file</p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {items.map((media) => (
          <MediaCard key={media.id} media={media} onDelete={() => router.refresh()} />
        ))}
      </div>
    </div>
  )
}
