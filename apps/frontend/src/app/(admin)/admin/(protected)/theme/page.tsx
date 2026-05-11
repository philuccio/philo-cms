import { getTheme } from '@/app/actions/theme'
import { ThemeBuilder } from '@/components/admin/theme/ThemeBuilder'

export default async function AdminThemePage() {
  const theme = await getTheme()
  return <ThemeBuilder initialTheme={theme} />
}
