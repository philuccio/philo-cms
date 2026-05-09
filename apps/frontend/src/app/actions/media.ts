'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloudinary, isCloudinaryConfigured, extractPublicId } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import type { MediaType } from '@prisma/client'

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp'])
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

function detectMediaType(resourceType: string, format: string): MediaType {
  if (resourceType === 'video') return 'VIDEO'
  if (IMAGE_EXTS.has(format.toLowerCase())) return 'IMAGE'
  return 'DOCUMENT'
}

export async function uploadMedia(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autorizzato')
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary non configurato — aggiungi le credenziali in .env.local')
  }

  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('Nessun file ricevuto')
  if (file.size > MAX_SIZE) throw new Error(`File troppo grande (max 20 MB): ${file.name}`)

  const siteId = session.user.siteId
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<{
    public_id: string
    secure_url: string
    width?: number
    height?: number
    bytes: number
    format: string
    resource_type: string
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `philo/${siteId}`,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (err, res) => {
          if (err || !res) reject(err ?? new Error('Upload fallito'))
          else resolve(res as typeof result)
        },
      )
      .end(buffer)
  })

  const type = detectMediaType(result.resource_type, result.format)
  const thumbUrl =
    type === 'IMAGE'
      ? result.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto/')
      : undefined

  const media = await prisma.media.create({
    data: {
      siteId,
      filename: file.name,
      url: result.secure_url,
      thumbUrl,
      type,
      mimeType: file.type || undefined,
      width: result.width,
      height: result.height,
      size: result.bytes,
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

  if (isCloudinaryConfigured()) {
    const publicId = extractPublicId(media.url)
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: media.type === 'VIDEO' ? 'video' : 'image',
        })
      } catch {
        // continue — delete from DB regardless
      }
    }
  }

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
