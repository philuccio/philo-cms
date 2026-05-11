import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'
import { prisma } from '@/lib/prisma'
import { KpiCounter } from '@/components/public/cases/KpiCounter'
import { LinkButton } from '@/components/public/ui/Button'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

async function getCase(slug: string) {
  const site = await prisma.site.findFirst({ select: { id: true } })
  if (!site) return null
  return prisma.caseHistory.findUnique({
    where: { siteId_slug: { siteId: site.id, slug } },
    include: {
      kpis: { orderBy: { order: 'asc' } },
      media: {
        orderBy: { order: 'asc' },
        include: {
          media: { select: { id: true, url: true, alt: true, width: true, height: true } },
        },
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getCase(slug)
  if (!c) return {}
  return {
    title: c.title,
    description: c.brief ?? undefined,
    openGraph: {
      title: c.title,
      description: c.brief ?? undefined,
      images: c.media[0]?.media.url ? [c.media[0].media.url] : [],
    },
  }
}

// sanitize-html strips all dangerous tags/attrs before rendering — safe to use with dangerouslySetInnerHTML
function sanitize(html: string | null): string | null {
  if (!html) return null
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
    },
  })
}

interface NarrativeSectionProps {
  label: string
  safeHtml: string | null
  image?: { url: string; alt: string | null } | null
  reverse?: boolean
}

function NarrativeSection({ label, safeHtml, image, reverse }: NarrativeSectionProps) {
  if (!safeHtml) return null
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: image ? '1fr 1fr' : '1fr',
        gap: '4rem',
        alignItems: 'start',
        direction: reverse ? 'rtl' : 'ltr',
        paddingBlock: '4rem',
        borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
      }}
    >
      <div style={{ direction: 'ltr' }}>
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1.5rem',
          }}
        >
          {label}
        </p>
        {/* safeHtml is pre-sanitized server-side with sanitize-html */}
        <div
          style={{
            color: 'color-mix(in srgb, var(--color-text) 80%, transparent)',
            lineHeight: 1.9,
            fontSize: '1.0625rem',
          }}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
      {image && (
        <div
          style={{
            direction: 'ltr',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            aspectRatio: '4/3',
            backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
          }}
        >
          <img
            src={image.url}
            alt={image.alt ?? label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  )
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  const c = await getCase(slug)
  if (!c || c.status !== 'PUBLISHED') notFound()

  const coverUrl = c.media[0]?.media.url
  const processImages = c.media.slice(1)

  const sections = [
    { label: 'Il Brief', content: c.brief, image: processImages[0]?.media },
    { label: 'La Sfida', content: c.challenge, image: processImages[1]?.media },
    { label: "L'Approccio", content: c.approach, image: processImages[2]?.media },
    { label: 'La Soluzione', content: c.solution, image: processImages[3]?.media },
    { label: 'I Risultati', content: c.results, image: null },
  ]

  return (
    <main>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          aspectRatio: coverUrl ? '21/9' : undefined,
          minHeight: coverUrl ? undefined : '40vh',
          overflow: 'hidden',
          backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
        }}
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt={c.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--color-bg) 90%, transparent) 0%, transparent 50%)',
          }}
        />
      </section>

      {/* Header */}
      <div className="ph-container" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <Link
          href="/cases"
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '1.5rem',
          }}
        >
          ← Case History
        </Link>

        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1rem',
          }}
        >
          Case Study
        </p>
        <h1 className="ph-heading-lg" style={{ marginBottom: '1rem', maxWidth: '18ch' }}>
          {c.title}
        </h1>
      </div>

      {/* KPI strip */}
      {c.kpis.length > 0 && (
        <div
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
            paddingBlock: '3.5rem',
          }}
        >
          <div
            className="ph-container"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(c.kpis.length, 4)}, 1fr)`,
              gap: '2rem',
            }}
          >
            {c.kpis.map((kpi) => (
              <KpiCounter
                key={kpi.id}
                value={kpi.value}
                label={kpi.label}
                delta={kpi.delta}
                unit={kpi.unit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Narrative sections */}
      <div className="ph-container">
        {sections.map((s, i) => (
          <NarrativeSection
            key={s.label}
            label={s.label}
            safeHtml={sanitize(s.content)}
            image={s.image}
            reverse={i % 2 === 1 && !!s.image}
          />
        ))}
      </div>

      {/* Process gallery */}
      {processImages.length > 0 && (
        <div
          style={{
            paddingBlock: '4rem',
            backgroundColor: 'color-mix(in srgb, var(--color-text) 3%, transparent)',
          }}
        >
          <div className="ph-container">
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '2rem',
              }}
            >
              Process
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {processImages.map((m) => (
                <div
                  key={m.mediaId}
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: '0.375rem',
                    overflow: 'hidden',
                    backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
                  }}
                >
                  <img
                    src={m.media.url}
                    alt={m.media.alt ?? c.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="ph-container" style={{ paddingBlock: '6rem', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
            marginBottom: '1.5rem',
          }}
        >
          Vuoi risultati simili?
        </p>
        <h2 className="ph-heading-lg" style={{ marginBottom: '2rem' }}>
          Parliamo del tuo progetto
        </h2>
        <LinkButton href="/contact" variant="primary" size="lg">
          Contattaci
        </LinkButton>
      </div>
    </main>
  )
}
