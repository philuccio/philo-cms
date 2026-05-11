import { getSiteConfig } from '@/app/actions/site-config'
import { LayoutBuilder } from '@/components/admin/layout/LayoutBuilder'

export default async function AdminSettingsPage() {
  const config = await getSiteConfig()
  return <LayoutBuilder initialConfig={config} />
}
