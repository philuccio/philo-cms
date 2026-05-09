import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

const UPLOADS_ROOT = join(process.cwd(), 'public', 'uploads')

function sanitizeExt(filename: string): string {
  const ext = extname(filename)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  return ext ? `.${ext}` : ''
}

export async function saveUploadedFile(
  siteId: string,
  buffer: Buffer,
  originalName: string,
): Promise<{ url: string; diskPath: string }> {
  const dir = join(UPLOADS_ROOT, siteId)
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })

  const ext = sanitizeExt(originalName)
  const safeName = `${Date.now()}-${randomUUID()}${ext}`
  const diskPath = join(dir, safeName)

  await writeFile(diskPath, buffer)

  return { url: `/uploads/${siteId}/${safeName}`, diskPath }
}

export async function deleteUploadedFile(url: string): Promise<void> {
  // url is like /uploads/{siteId}/{filename}
  const rel = url.startsWith('/') ? url.slice(1) : url
  const diskPath = join(process.cwd(), 'public', rel)
  try {
    await unlink(diskPath)
  } catch {
    // file already gone — not an error
  }
}

export async function getImageDimensions(
  buffer: Buffer,
  mimeType: string,
): Promise<{ width?: number; height?: number }> {
  if (!mimeType.startsWith('image/') || mimeType === 'image/svg+xml') return {}
  try {
    const sharp = (await import('sharp')).default
    const { width, height } = await sharp(buffer).metadata()
    return { width, height }
  } catch {
    return {}
  }
}
