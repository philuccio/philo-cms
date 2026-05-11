import { getServicesTree } from '@/app/actions/services'
import { ServiceTree } from '@/components/admin/services/ServiceTree'

export default async function AdminServicesPage() {
  const tree = await getServicesTree()
  return <ServiceTree initialTree={tree} />
}
