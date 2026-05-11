import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Section, SectionLabel, SectionHeading } from '@/components/public/ui/Section'
import { GalleryClient } from '@/components/public/gallery/GalleryClient'
import type { GalleryProject, GalleryCategory } from '@/components/public/gallery/GalleryClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'I nostri lavori e progetti',
}

async function getGalleryData() {
  const [projects, categories, galleryConfig] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      include: {
        category: { select: { id: true, name: true, color: true } },
        media: {
          where: { role: 'cover' },
          take: 1,
          include: { media: { select: { url: true, width: true, height: true } } },
        },
      },
    }),
    prisma.category.findMany({
      where: { site: { domain: { not: undefined } } },
      orderBy: { name: 'asc' },
    }),
    prisma.galleryConfig.findFirst(),
  ])

  return { projects, categories, galleryConfig }
}

export default async function GalleryPage() {
  const { projects, categories, galleryConfig } = await getGalleryData()

  const galleryProjects: GalleryProject[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    year: p.year,
    client: p.client,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? null,
    categoryColor: p.category?.color ?? null,
    coverUrl: p.media[0]?.media.url ?? null,
    coverWidth: p.media[0]?.media.width ?? null,
    coverHeight: p.media[0]?.media.height ?? null,
    depth: p.depth as 'THUMBNAIL' | 'CARD' | 'FULL',
  }))

  const galleryCategories: GalleryCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    color: c.color,
  }))

  const layout = galleryConfig?.layoutType ?? 'GRID'
  const cols = galleryConfig?.cols ?? 3
  const hasFilters = galleryConfig?.hasFilters ?? true
  const hasLightbox = galleryConfig?.hasLightbox ?? true

  return (
    <main>
      <Section>
        <SectionLabel>Portfolio</SectionLabel>
        <div className="mb-12 flex items-end justify-between">
          <SectionHeading as="h1">I nostri lavori</SectionHeading>
          <p
            style={{
              color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
              fontSize: '0.875rem',
            }}
          >
            {projects.length} {projects.length === 1 ? 'progetto' : 'progetti'}
          </p>
        </div>

        <Suspense fallback={null}>
          <GalleryClient
            projects={galleryProjects}
            categories={galleryCategories}
            layout={layout}
            cols={cols}
            hasFilters={hasFilters}
            hasLightbox={hasLightbox}
          />
        </Suspense>
      </Section>
    </main>
  )
}
