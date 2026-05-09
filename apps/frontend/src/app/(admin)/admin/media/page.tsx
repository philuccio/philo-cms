import type { Metadata } from 'next'
import { getMediaList } from '@/app/actions/media'
import { UploadZone } from '@/components/admin/media/UploadZone'
import { MediaGrid } from '@/components/admin/media/MediaGrid'

export const metadata: Metadata = { title: 'Media' }

export default async function AdminMediaPage() {
  let data = { items: [] as Awaited<ReturnType<typeof getMediaList>>['items'], total: 0, pages: 1 }
  try {
    data = await getMediaList()
  } catch {
    // empty during build / pre-render
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[--color-text]">Media Library</h1>
        <p className="text-[--color-text]/40 mt-1 text-sm">{data.total} file</p>
      </div>

      <div className="mb-8">
        <UploadZone />
      </div>

      <MediaGrid items={data.items} total={data.total} />
    </div>
  )
}
