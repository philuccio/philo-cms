import { getSiteConfig } from '@/app/actions/layout'
import { LayoutBuilder } from '@/components/admin/layout/LayoutBuilder'

export default async function AdminSettingsPage() {
  const config = await getSiteConfig()
  return <LayoutBuilder initialConfig={config} />
}
