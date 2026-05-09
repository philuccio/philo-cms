'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { BlockType, BlockContent } from '@philo/types'

export async function getPages() {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  return prisma.page.findMany({
    where: { siteId: session.user.siteId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, slug: true, status: true, updatedAt: true },
  })
}

export async function getPage(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  return prisma.page.findFirst({
    where: { id, siteId: session.user.siteId },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
}

export async function createPage(data: { title: string; slug: string }) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  const page = await prisma.page.create({
    data: {
      siteId: session.user.siteId,
      title: data.title,
      slug: data.slug,
      status: 'DRAFT',
      layoutConfig: JSON.stringify({ sections: [] }),
    },
  })
  revalidatePath('/admin/pages')
  return page
}

export async function updatePageMeta(
  id: string,
  data: {
    title?: string
    slug?: string
    status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED'
    metaTitle?: string
    metaDesc?: string
  },
) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.page.updateMany({ where: { id, siteId: session.user.siteId }, data })
  revalidatePath('/admin/pages')
  revalidatePath(`/admin/pages/${id}`)
}

export async function deletePage(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  await prisma.page.deleteMany({ where: { id, siteId: session.user.siteId } })
  revalidatePath('/admin/pages')
}

export async function addBlock(pageId: string, type: BlockType) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const page = await prisma.page.findFirst({ where: { id: pageId, siteId: session.user.siteId } })
  if (!page) throw new Error('Pagina non trovata')

  const last = await prisma.layoutBlock.findFirst({ where: { pageId }, orderBy: { order: 'desc' } })
  const order = (last?.order ?? -1) + 1

  const defaults: Record<BlockType, BlockContent> = {
    hero: { type: 'hero', heading: 'Titolo principale', variant: 'fullscreen' },
    text: { type: 'text', html: '<p>Inserisci il testo qui.</p>', align: 'left', columns: 1 },
    image: { type: 'image', mediaId: '', url: '', alt: '' },
    quote: { type: 'quote', text: 'Inserisci una citazione.' },
    stats: { type: 'stats', items: [{ value: '0', label: 'Metrica' }] },
    cta: { type: 'cta', heading: 'Titolo CTA', primaryLabel: 'Scopri di più', primaryHref: '/' },
    map: { type: 'map', embedUrl: '' },
  }

  const block = await prisma.layoutBlock.create({
    data: { pageId, type, order, content: JSON.stringify(defaults[type]) },
  })
  revalidatePath(`/admin/pages/${pageId}`)
  return block
}

export async function updateBlock(id: string, content: BlockContent) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const block = await prisma.layoutBlock.findFirst({
    where: { id },
    include: { page: { select: { siteId: true } } },
  })
  if (!block || block.page.siteId !== session.user.siteId) throw new Error('Blocco non trovato')

  await prisma.layoutBlock.update({ where: { id }, data: { content: JSON.stringify(content) } })
  revalidatePath(`/admin/pages/${block.pageId}`)
}

export async function deleteBlock(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const block = await prisma.layoutBlock.findFirst({
    where: { id },
    include: { page: { select: { siteId: true, id: true } } },
  })
  if (!block || block.page.siteId !== session.user.siteId) throw new Error('Blocco non trovato')

  await prisma.layoutBlock.delete({ where: { id } })

  const remaining = await prisma.layoutBlock.findMany({
    where: { pageId: block.pageId },
    orderBy: { order: 'asc' },
  })
  for (let i = 0; i < remaining.length; i++) {
    const b = remaining[i]
    if (b) await prisma.layoutBlock.update({ where: { id: b.id }, data: { order: i } })
  }

  revalidatePath(`/admin/pages/${block.pageId}`)
}

export async function moveBlock(id: string, direction: 'up' | 'down') {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const block = await prisma.layoutBlock.findFirst({
    where: { id },
    include: { page: { select: { siteId: true, id: true } } },
  })
  if (!block || block.page.siteId !== session.user.siteId) throw new Error('Blocco non trovato')

  const blocks = await prisma.layoutBlock.findMany({
    where: { pageId: block.pageId },
    orderBy: { order: 'asc' },
  })

  const idx = blocks.findIndex((b) => b.id === id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= blocks.length) return

  const target = blocks[idx]
  const swap = blocks[swapIdx]
  if (!target || !swap) return

  await prisma.$transaction([
    prisma.layoutBlock.update({ where: { id: target.id }, data: { order: swap.order } }),
    prisma.layoutBlock.update({ where: { id: swap.id }, data: { order: target.order } }),
  ])

  revalidatePath(`/admin/pages/${block.pageId}`)
}
