'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Depth, GalleryLayout, Status } from '@prisma/client'

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  return prisma.category.findMany({
    where: { siteId: session.user.siteId },
    orderBy: { name: 'asc' },
  })
}

export async function createCategory(data: { name: string; slug: string; color: string }) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  const cat = await prisma.category.create({ data: { ...data, siteId: session.user.siteId } })
  revalidatePath('/admin/gallery')
  return cat
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.category.deleteMany({ where: { id, siteId: session.user.siteId } })
  revalidatePath('/admin/gallery')
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects() {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  return prisma.project.findMany({
    where: { siteId: session.user.siteId },
    orderBy: { order: 'asc' },
    include: {
      category: { select: { id: true, name: true, color: true } },
      media: {
        where: { role: 'cover' },
        take: 1,
        include: { media: { select: { url: true, alt: true } } },
      },
    },
  })
}

export async function getProject(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  return prisma.project.findFirst({
    where: { id, siteId: session.user.siteId },
    include: {
      category: true,
      media: { orderBy: { order: 'asc' }, include: { media: true } },
    },
  })
}

export async function createProject(data: { title: string; slug: string; depth?: Depth }) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  const last = await prisma.project.findFirst({
    where: { siteId: session.user.siteId },
    orderBy: { order: 'desc' },
  })
  const project = await prisma.project.create({
    data: {
      siteId: session.user.siteId,
      title: data.title,
      slug: data.slug,
      depth: data.depth ?? 'CARD',
      status: 'DRAFT',
      order: (last?.order ?? -1) + 1,
    },
  })
  revalidatePath('/admin/gallery')
  return project
}

export async function updateProject(
  id: string,
  data: {
    title?: string
    slug?: string
    excerpt?: string | null
    body?: string | null
    status?: Status
    depth?: Depth
    categoryId?: string | null
    year?: number | null
    client?: string | null
    tags?: string | null
  },
) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.project.updateMany({ where: { id, siteId: session.user.siteId }, data })
  revalidatePath('/admin/gallery')
  revalidatePath(`/admin/gallery/${id}`)
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.project.deleteMany({ where: { id, siteId: session.user.siteId } })
  revalidatePath('/admin/gallery')
}

export async function reorderProjects(orderedIds: string[]) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.project.update({ where: { id }, data: { order: index } })),
  )
  revalidatePath('/admin/gallery')
}

// ── Project Media ─────────────────────────────────────────────────────────────

export async function addProjectMedia(
  projectId: string,
  mediaId: string,
  role: 'cover' | 'gallery' | 'detail',
) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const project = await prisma.project.findFirst({
    where: { id: projectId, siteId: session.user.siteId },
  })
  if (!project) throw new Error('Progetto non trovato')

  const last = await prisma.projectMedia.findFirst({
    where: { projectId },
    orderBy: { order: 'desc' },
  })

  // If setting cover, remove existing cover first
  if (role === 'cover') {
    await prisma.projectMedia.deleteMany({ where: { projectId, role: 'cover' } })
  }

  await prisma.projectMedia.upsert({
    where: { projectId_mediaId: { projectId, mediaId } },
    create: { projectId, mediaId, role, order: (last?.order ?? -1) + 1 },
    update: { role },
  })
  revalidatePath(`/admin/gallery/${projectId}`)
}

export async function removeProjectMedia(projectId: string, mediaId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const project = await prisma.project.findFirst({
    where: { id: projectId, siteId: session.user.siteId },
  })
  if (!project) throw new Error('Progetto non trovato')

  await prisma.projectMedia.delete({ where: { projectId_mediaId: { projectId, mediaId } } })
  revalidatePath(`/admin/gallery/${projectId}`)
}

export async function reorderProjectMedia(projectId: string, orderedMediaIds: string[]) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const project = await prisma.project.findFirst({
    where: { id: projectId, siteId: session.user.siteId },
  })
  if (!project) throw new Error('Progetto non trovato')

  await prisma.$transaction(
    orderedMediaIds.map((mediaId, index) =>
      prisma.projectMedia.update({
        where: { projectId_mediaId: { projectId, mediaId } },
        data: { order: index },
      }),
    ),
  )
  revalidatePath(`/admin/gallery/${projectId}`)
}

// ── Gallery Config ─────────────────────────────────────────────────────────────

export async function getGalleryConfig() {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  return prisma.galleryConfig.findFirst({ where: { siteId: session.user.siteId } })
}

export async function saveGalleryConfig(data: {
  layoutType: GalleryLayout
  cols: number
  hasFilters: boolean
  hasLightbox: boolean
  defaultDepth: Depth
}) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.galleryConfig.upsert({
    where: { siteId: session.user.siteId },
    create: { siteId: session.user.siteId, ...data },
    update: data,
  })
  revalidatePath('/admin/gallery')
}
