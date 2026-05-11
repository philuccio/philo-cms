import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BlockRenderer } from '@/components/public/blocks/BlockRenderer'

export const revalidate = 60

async function getAboutPage() {
  const site = await prisma.site.findFirst({ select: { id: true } })
  if (!site) return null
  return prisma.page.findUnique({
    where: { siteId_slug: { siteId: site.id, slug: 'about' } },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
  return {
    title: page?.metaTitle ?? page?.title ?? 'Chi siamo',
    description: page?.metaDesc ?? undefined,
    openGraph: page?.ogImage ? { images: [page.ogImage] } : undefined,
  }
}

export default async function AboutPage() {
  const page = await getAboutPage()

  if (!page || page.status !== 'PUBLISHED') {
    return (
      <main>
        <section className="ph-section">
          <div className="ph-container-narrow">
            <h1 className="ph-heading-lg">Chi siamo</h1>
            <p
              style={{
                marginTop: '2rem',
                color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                fontSize: '1.0625rem',
                lineHeight: 1.8,
              }}
            >
              La pagina &ldquo;Chi siamo&rdquo; non è ancora stata pubblicata.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <BlockRenderer blocks={page.blocks} />
    </main>
  )
}
