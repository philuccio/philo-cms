import type { Metadata } from 'next'
import { getGalleryConfig } from '@/app/actions/gallery'
import { GalleryConfigForm } from '@/components/admin/gallery/GalleryConfigForm'

export const metadata: Metadata = { title: 'Configurazione Gallery' }

export default async function AdminGalleryConfigPage() {
  let config = null
  try {
    config = await getGalleryConfig()
  } catch {
    // empty during build
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-[--color-text]">
        Configurazione Gallery
      </h1>
      <GalleryConfigForm config={config} />
    </div>
  )
}
