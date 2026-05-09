import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const userName = session.user.email ?? session.user.name ?? 'Admin'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userName={userName} />
      <main className="flex-1 overflow-y-auto bg-[--color-bg]">{children}</main>
    </div>
  )
}
