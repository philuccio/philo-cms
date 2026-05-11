'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireSite() {
  const session = await auth()
  if (!session?.user?.siteId) throw new Error('Non autorizzato')
  return session.user.siteId
}

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[àáâ]/g, 'a')
    .replace(/[èéê]/g, 'e')
    .replace(/[ìíî]/g, 'i')
    .replace(/[òóô]/g, 'o')
    .replace(/[ùúû]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type ServiceLevel = 'L1_CARD' | 'L2_PAGE' | 'L3_PACKAGE'

export interface ServiceNode {
  id: string
  title: string
  slug: string
  icon: string | null
  descShort: string | null
  descLong: string | null
  level: ServiceLevel
  parentId: string | null
  order: number
  accentColor: string | null
  status: string
  children: ServiceNode[]
}

export async function getServicesTree(): Promise<ServiceNode[]> {
  const siteId = await requireSite()
  const all = await prisma.service.findMany({
    where: { siteId },
    orderBy: { order: 'asc' },
  })

  function buildTree(parentId: string | null): ServiceNode[] {
    return all
      .filter((s) => s.parentId === parentId)
      .map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        icon: s.icon,
        descShort: s.descShort,
        descLong: s.descLong,
        level: s.level as ServiceLevel,
        parentId: s.parentId,
        order: s.order,
        accentColor: s.accentColor,
        status: s.status,
        children: buildTree(s.id),
      }))
  }

  return buildTree(null)
}

export async function getService(id: string) {
  const siteId = await requireSite()
  return prisma.service.findFirst({
    where: { id, siteId },
    include: { children: { orderBy: { order: 'asc' } } },
  })
}

export interface ServiceFormData {
  title: string
  slug?: string
  icon?: string
  descShort?: string
  descLong?: string
  accentColor?: string
  coverId?: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export async function createService(data: ServiceFormData, level: ServiceLevel, parentId?: string) {
  const siteId = await requireSite()
  const baseSlug = data.slug || toSlug(data.title) || `servizio-${Date.now()}`
  let slug = baseSlug
  let attempt = 0
  while (await prisma.service.findUnique({ where: { siteId_slug: { siteId, slug } } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }
  const count = await prisma.service.count({ where: { siteId, parentId: parentId ?? null } })
  const svc = await prisma.service.create({
    data: { siteId, ...data, slug, level, parentId: parentId ?? null, order: count },
  })
  revalidatePath('/admin/services')
  return svc
}

export async function updateService(id: string, data: ServiceFormData) {
  const siteId = await requireSite()
  if (data.title && !data.slug) data.slug = toSlug(data.title)
  const svc = await prisma.service.update({ where: { id, siteId }, data })
  revalidatePath('/admin/services')
  revalidatePath(`/admin/services/${id}`)
  return svc
}

export async function deleteService(id: string) {
  const siteId = await requireSite()
  await prisma.service.delete({ where: { id, siteId } })
  revalidatePath('/admin/services')
}

export async function reorderServices(parentId: string | null, orderedIds: string[]) {
  const siteId = await requireSite()
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.service.update({ where: { id, siteId }, data: { order: index } }),
    ),
  )
  revalidatePath('/admin/services')
}
