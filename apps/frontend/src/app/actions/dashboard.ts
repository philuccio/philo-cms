'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const siteId = session.user.siteId

  const [pages, projects, cases, services, media, recentMedia] = await Promise.all([
    prisma.page.count({ where: { siteId } }),
    prisma.project.count({ where: { siteId } }),
    prisma.caseHistory.count({ where: { siteId } }),
    prisma.service.count({ where: { siteId } }),
    prisma.media.count({ where: { siteId } }),
    prisma.media.findMany({
      where: { siteId },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, filename: true, url: true, type: true, size: true, createdAt: true },
    }),
  ])

  return { pages, projects, cases, services, media, recentMedia }
}
