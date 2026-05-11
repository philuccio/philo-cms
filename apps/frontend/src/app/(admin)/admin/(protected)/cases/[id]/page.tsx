import { notFound } from 'next/navigation'
import { getCaseStudy } from '@/app/actions/cases'
import { CaseEditor } from '@/components/admin/cases/CaseEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminCaseEditorPage({ params }: Props) {
  const { id } = await params
  const caseStudy = await getCaseStudy(id)
  if (!caseStudy) notFound()

  const normalized = {
    ...caseStudy,
    kpis: caseStudy.kpis.map((k) => ({
      ...k,
      delta: k.delta ?? undefined,
      unit: k.unit ?? undefined,
    })),
    media: caseStudy.media.map((m) => ({
      mediaId: m.mediaId,
      caption: m.caption ?? undefined,
      order: m.order,
      url: m.media.url,
      type: m.media.type,
      filename: m.media.filename,
    })),
  }

  return <CaseEditor caseStudy={normalized} />
}
