'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireSite() {
  const session = await auth()
  if (!session?.user?.siteId) throw new Error('Non autorizzato')
  return session.user.siteId
}

export interface ThemeData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  textColor: string
  fontDisplay: string
  fontBody: string
  presetName: string | null
  customCss: string | null
}

export async function getTheme(): Promise<ThemeData> {
  const siteId = await requireSite()
  const theme = await prisma.theme.findUnique({ where: { siteId } })
  return {
    primaryColor: theme?.primaryColor ?? '#0a0a0a',
    secondaryColor: theme?.secondaryColor ?? '#f5f2ed',
    accentColor: theme?.accentColor ?? '#c9a84c',
    bgColor: theme?.bgColor ?? '#0a0a0a',
    textColor: theme?.textColor ?? '#f5f2ed',
    fontDisplay: theme?.fontDisplay ?? 'Cormorant Garamond',
    fontBody: theme?.fontBody ?? 'DM Sans',
    presetName: theme?.presetName ?? 'dark-luxury',
    customCss: theme?.customCss ?? '',
  }
}

export async function saveTheme(data: ThemeData) {
  const siteId = await requireSite()
  await prisma.theme.upsert({
    where: { siteId },
    create: { siteId, ...data },
    update: data,
  })
  revalidatePath('/')
  revalidatePath('/admin/theme')
}
