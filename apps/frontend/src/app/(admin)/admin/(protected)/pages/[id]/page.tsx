import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage } from '@/app/actions/pages'
import { PageEditor } from '@/components/admin/pages/PageEditor'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Editor pagina' }

export default async function AdminPageEditorPage({ params }: Props) {
  const { id } = await params
  let page = null
  try {
    page = await getPage(id)
  } catch {
    // auth error during pre-render
  }
  if (!page) notFound()

  return (
    <div className="h-full">
      <PageEditor page={page} />
    </div>
  )
}
