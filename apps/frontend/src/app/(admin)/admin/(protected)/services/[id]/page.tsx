import { notFound } from 'next/navigation'
import { getService } from '@/app/actions/services'
import { ServiceEditor } from '@/components/admin/services/ServiceEditor'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminServiceEditorPage({ params }: Props) {
  const { id } = await params
  const service = await getService(id)
  if (!service) notFound()

  let parentTitle: string | undefined
  if (service.parentId) {
    const parent = await prisma.service.findUnique({
      where: { id: service.parentId },
      select: { title: true },
    })
    parentTitle = parent?.title
  }

  return (
    <ServiceEditor
      service={{
        ...service,
        level: service.level as 'L1_CARD' | 'L2_PAGE' | 'L3_PACKAGE',
        coverId: service.coverId ?? null,
      }}
      parentTitle={parentTitle}
    />
  )
}
