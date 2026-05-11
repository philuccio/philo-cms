'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireSite() {
  const session = await auth()
  if (!session?.user?.siteId) throw new Error('Non autorizzato')
  return session.user.siteId
}

export interface NavItem {
  id: string
  label: string
  href: string
  target?: '_blank' | '_self'
  children?: NavItem[]
}

export interface FooterColumn {
  id: string
  title: string
  links: { id: string; label: string; href: string }[]
}

export interface FooterConfig {
  columns: FooterColumn[]
  copyright: string
  showSocial: boolean
  social?: { instagram?: string; linkedin?: string; behance?: string; dribbble?: string }
}

export interface SiteConfigData {
  logoUrl: string | null
  faviconUrl: string | null
  seoTitle: string | null
  seoDesc: string | null
  seoOgImage: string | null
  nav: NavItem[]
  footer: FooterConfig
}

const defaultFooter: FooterConfig = {
  columns: [],
  copyright: '© 2025',
  showSocial: false,
  social: {},
}

export async function getSiteConfig(): Promise<SiteConfigData> {
  const siteId = await requireSite()
  const config = await prisma.siteConfig.findUnique({ where: { siteId } })
  return {
    logoUrl: config?.logoUrl ?? null,
    faviconUrl: config?.faviconUrl ?? null,
    seoTitle: config?.seoTitle ?? null,
    seoDesc: config?.seoDesc ?? null,
    seoOgImage: config?.seoOgImage ?? null,
    nav: config?.navJson ? (JSON.parse(config.navJson) as NavItem[]) : [],
    footer: config?.footerJson ? (JSON.parse(config.footerJson) as FooterConfig) : defaultFooter,
  }
}

export async function saveSiteConfig(data: SiteConfigData) {
  const siteId = await requireSite()
  const payload = {
    logoUrl: data.logoUrl,
    faviconUrl: data.faviconUrl,
    seoTitle: data.seoTitle,
    seoDesc: data.seoDesc,
    seoOgImage: data.seoOgImage,
    navJson: JSON.stringify(data.nav),
    footerJson: JSON.stringify(data.footer),
  }
  await prisma.siteConfig.upsert({
    where: { siteId },
    create: { siteId, ...payload },
    update: payload,
  })
  revalidatePath('/')
  revalidatePath('/admin/settings')
}
