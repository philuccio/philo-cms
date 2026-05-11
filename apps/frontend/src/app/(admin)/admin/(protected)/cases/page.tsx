import { getCaseStudies } from '@/app/actions/cases'
import { CasesClient } from '@/components/admin/cases/CasesClient'

export default async function AdminCasesPage() {
  const items = await getCaseStudies()
  return <CasesClient initialItems={items} />
}
