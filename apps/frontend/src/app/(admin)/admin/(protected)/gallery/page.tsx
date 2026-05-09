import type { Metadata } from 'next'
import { getProjects } from '@/app/actions/gallery'
import { GalleryPageClient } from '@/components/admin/gallery/GalleryPageClient'

export const metadata: Metadata = { title: 'Gallery' }

export default async function AdminGalleryPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects()
  } catch {
    // empty during build
  }

  return <GalleryPageClient projects={projects} />
}
