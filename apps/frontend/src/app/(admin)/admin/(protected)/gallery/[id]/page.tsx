import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProject, getCategories } from '@/app/actions/gallery'
import { ProjectEditor } from '@/components/admin/gallery/ProjectEditor'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Editor progetto' }

export default async function AdminProjectEditorPage({ params }: Props) {
  const { id } = await params
  let project = null
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    ;[project, categories] = await Promise.all([getProject(id), getCategories()])
  } catch {
    // auth error during pre-render
  }
  if (!project) notFound()

  return (
    <div className="h-full">
      <ProjectEditor project={project} categories={categories} />
    </div>
  )
}
