import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteConfig } from '@/app/actions/layout'
import { HeroSection } from '@/components/public/HeroSection'
import { ProjectsPreview } from '@/components/public/ProjectsPreview'
import { ServicesPreview } from '@/components/public/ServicesPreview'
import { CasesPreview } from '@/components/public/CasesPreview'

export const revalidate = 60

async function getHomeData() {
  const [site, config, projects, services, cases] = await Promise.all([
    prisma.site.findFirst({ select: { name: true } }),
    getSiteConfig(),
    prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 6,
      include: {
        category: { select: { name: true, color: true } },
        media: {
          where: { role: 'cover' },
          take: 1,
          include: { media: { select: { url: true } } },
        },
      },
    }),
    prisma.service.findMany({
      where: { level: 'L1_CARD', status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 6,
      select: { id: true, title: true, slug: true, icon: true, descShort: true, accentColor: true },
    }),
    prisma.caseHistory.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 4,
      include: {
        kpis: { select: { id: true } },
        media: { where: { order: 0 }, take: 1, include: { media: { select: { url: true } } } },
      },
    }),
  ])

  return { site, config, projects, services, cases }
}

export async function generateMetadata(): Promise<Metadata> {
  const { site, config } = await getHomeData()
  const title = config.seoTitle ?? site?.name ?? 'PHILO CMS'
  const description = config.seoDesc ?? undefined
  const ogImage = config.seoOgImage ?? undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function HomePage() {
  const { site, config, projects, services, cases } = await getHomeData()

  const heroTitle = config.seoTitle ?? site?.name ?? 'Studio Creativo'
  const heroSubtitle = config.seoDesc

  const projectCards = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    year: p.year,
    client: p.client,
    categoryName: p.category?.name ?? null,
    categoryColor: p.category?.color ?? null,
    coverUrl: p.media[0]?.media.url ?? null,
  }))

  const caseCards = cases.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    brief: c.brief,
    coverUrl: c.media[0]?.media.url ?? null,
    kpiCount: c.kpis.length,
  }))

  return (
    <main>
      <HeroSection
        variant="minimal"
        title={heroTitle}
        subtitle={heroSubtitle}
        imageUrl={config.seoOgImage}
      />
      <ProjectsPreview projects={projectCards} />
      <ServicesPreview services={services} />
      <CasesPreview cases={caseCards} />
    </main>
  )
}
