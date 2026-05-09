import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const userName = session.user.email ?? session.user.name ?? 'Admin'
  const userRole = session.user.role ?? 'VIEWER'

  return (
    <AdminShell userName={userName} userRole={userRole}>
      {children}
    </AdminShell>
  )
}
