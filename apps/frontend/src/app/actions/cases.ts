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

export async function getCaseStudies() {
  const siteId = await requireSite()
  return prisma.caseHistory.findMany({
    where: { siteId },
    include: { kpis: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
}

export async function getCaseStudy(id: string) {
  const siteId = await requireSite()
  return prisma.caseHistory.findFirst({
    where: { id, siteId },
    include: {
      kpis: { orderBy: { order: 'asc' } },
      media: {
        orderBy: { order: 'asc' },
        include: { media: true },
      },
    },
  })
}

export interface CaseFormData {
  title: string
  slug?: string
  brief?: string
  challenge?: string
  approach?: string
  solution?: string
  results?: string
  coverId?: string
  projectId?: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export async function createCaseStudy(data: CaseFormData) {
  const siteId = await requireSite()
  const baseSlug = data.slug || toSlug(data.title) || `case-${Date.now()}`
  // ensure slug uniqueness
  let slug = baseSlug
  let attempt = 0
  while (await prisma.caseHistory.findUnique({ where: { siteId_slug: { siteId, slug } } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }
  const count = await prisma.caseHistory.count({ where: { siteId } })
  const cs = await prisma.caseHistory.create({
    data: { siteId, ...data, slug, order: count },
  })
  revalidatePath('/admin/cases')
  return cs
}

export async function updateCaseStudy(id: string, data: CaseFormData) {
  const siteId = await requireSite()
  if (data.title && !data.slug) data.slug = toSlug(data.title)
  const cs = await prisma.caseHistory.update({
    where: { id, siteId },
    data,
  })
  revalidatePath('/admin/cases')
  revalidatePath(`/admin/cases/${id}`)
  return cs
}

export async function deleteCaseStudy(id: string) {
  const siteId = await requireSite()
  await prisma.caseHistory.delete({ where: { id, siteId } })
  revalidatePath('/admin/cases')
}

export async function reorderCaseStudies(orderedIds: string[]) {
  const siteId = await requireSite()
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.caseHistory.update({ where: { id, siteId }, data: { order: index } }),
    ),
  )
  revalidatePath('/admin/cases')
}

export interface KPIInput {
  id?: string
  label: string
  value: string
  delta?: string
  unit?: string
  order: number
}

export async function saveKPIs(caseId: string, kpis: KPIInput[]) {
  const siteId = await requireSite()
  const cs = await prisma.caseHistory.findFirst({ where: { id: caseId, siteId } })
  if (!cs) throw new Error('Case non trovato')

  await prisma.caseKPI.deleteMany({ where: { caseId } })
  if (kpis.length > 0) {
    await prisma.caseKPI.createMany({
      data: kpis.map((k, i) => ({
        caseId,
        label: k.label,
        value: k.value,
        delta: k.delta ?? null,
        unit: k.unit ?? null,
        order: i,
      })),
    })
  }
  revalidatePath(`/admin/cases/${caseId}`)
}

export interface CaseMediaInput {
  mediaId: string
  caption?: string
  order: number
}

export async function saveCaseMedia(caseId: string, items: CaseMediaInput[]) {
  const siteId = await requireSite()
  const cs = await prisma.caseHistory.findFirst({ where: { id: caseId, siteId } })
  if (!cs) throw new Error('Case non trovato')

  await prisma.caseMedia.deleteMany({ where: { caseId } })
  if (items.length > 0) {
    await prisma.caseMedia.createMany({
      data: items.map((item, i) => ({
        caseId,
        mediaId: item.mediaId,
        caption: item.caption ?? null,
        order: i,
      })),
    })
  }
  revalidatePath(`/admin/cases/${caseId}`)
}
