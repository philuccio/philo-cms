import type { Metadata } from 'next'
import { getMediaList } from '@/app/actions/media'
import { UploadZone } from '@/components/admin/media/UploadZone'
import { MediaGrid } from '@/components/admin/media/MediaGrid'

export const metadata: Metadata = { title: 'Media' }

export default async function AdminMediaPage() {
  const cloudinaryReady = !!process.env.CLOUDINARY_CLOUD_NAME

  let data = { items: [] as Awaited<ReturnType<typeof getMediaList>>['items'], total: 0, pages: 1 }
  try {
    data = await getMediaList()
  } catch {
    // empty if auth not available during static analysis
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[--color-text]">Media Library</h1>
        <p className="text-[--color-text]/40 mt-1 text-sm">{data.total} file</p>
      </div>

      {!cloudinaryReady && (
        <div className="bg-amber-500/8 mb-6 rounded border border-amber-400/20 px-4 py-3 text-sm text-amber-400">
          Cloudinary non configurato — aggiungi{' '}
          <code className="font-mono text-amber-300">CLOUDINARY_CLOUD_NAME</code>,{' '}
          <code className="font-mono text-amber-300">CLOUDINARY_API_KEY</code> e{' '}
          <code className="font-mono text-amber-300">CLOUDINARY_API_SECRET</code> in{' '}
          <code className="font-mono text-amber-300">.env.local</code> per abilitare gli upload.
        </div>
      )}

      <div className="mb-8">
        <UploadZone />
      </div>

      <MediaGrid items={data.items} total={data.total} />
    </div>
  )
}
