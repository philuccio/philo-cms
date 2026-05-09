'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { saveUploadedFile, deleteUploadedFile, getImageDimensions } from '@/lib/storage'
import { revalidatePath } from 'next/cache'
import type { MediaType } from '@prisma/client'

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

function detectType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'IMAGE'
  if (mimeType.startsWith('video/')) return 'VIDEO'
  return 'DOCUMENT'
}

export async function uploadMedia(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('Nessun file ricevuto')
  if (file.size > MAX_SIZE) throw new Error(`File troppo grande (max 50 MB): ${file.name}`)

  const siteId = session.user.siteId
  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || 'application/octet-stream'

  const { url } = await saveUploadedFile(siteId, buffer, file.name)
  const { width, height } = await getImageDimensions(buffer, mimeType)

  const media = await prisma.media.create({
    data: {
      siteId,
      filename: file.name,
      url,
      type: detectType(mimeType),
      mimeType,
      width,
      height,
      size: file.size,
      alt: file.name.replace(/\.[^/.]+$/, ''),
    },
  })

  revalidatePath('/admin/media')
  return media
}

export async function deleteMedia(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const media = await prisma.media.findUnique({ where: { id } })
  if (!media || media.siteId !== session.user.siteId) throw new Error('Media non trovato')

  await deleteUploadedFile(media.url)
  await prisma.media.delete({ where: { id } })
  revalidatePath('/admin/media')
}

export async function updateMediaAlt(id: string, alt: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const media = await prisma.media.findUnique({ where: { id } })
  if (!media || media.siteId !== session.user.siteId) throw new Error('Media non trovato')

  const updated = await prisma.media.update({ where: { id }, data: { alt } })
  revalidatePath('/admin/media')
  return updated
}

export async function getMediaList(params?: { type?: MediaType; search?: string; page?: number }) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')

  const siteId = session.user.siteId
  const take = 40
  const skip = ((params?.page ?? 1) - 1) * take

  const where = {
    siteId,
    ...(params?.type ? { type: params.type } : {}),
    ...(params?.search
      ? {
          OR: [
            { filename: { contains: params.search } },
            { alt: { contains: params.search } },
            { tags: { contains: params.search } },
          ],
        }
      : {}),
  }

  const [items, total] = await Promise.all([
    prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
    prisma.media.count({ where }),
  ])

  return { items, total, pages: Math.ceil(total / take) }
}
