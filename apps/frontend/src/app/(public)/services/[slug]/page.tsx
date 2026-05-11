import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
// sanitize-html removes all XSS vectors before any dangerouslySetInnerHTML usage
import sanitizeHtml from 'sanitize-html'
import { prisma } from '@/lib/prisma'
import { LinkButton } from '@/components/public/ui/Button'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

async function getService(slug: string) {
  const site = await prisma.site.findFirst({ select: { id: true } })
  if (!site) return null
  return prisma.service.findUnique({
    where: { siteId_slug: { siteId: site.id, slug } },
    include: {
      parent: { select: { title: true, slug: true } },
      children: {
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = await getService(slug)
  if (!s) return {}
  return {
    title: s.title,
    description: s.descShort ?? undefined,
  }
}

function sanitizeContent(html: string | null): string | null {
  if (!html) return null
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
    },
  })
}

function PackagesTable({
  packages,
}: {
  packages: {
    id: string
    title: string
    descShort: string | null
    descLong: string | null
    accentColor: string | null
    slug: string
  }[]
}) {
  if (packages.length === 0) return null
  return (
    <div
      style={{
        paddingBlock: '5rem',
        borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
      }}
    >
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
        Pacchetti
      </p>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '3rem',
        }}
      >
        Scegli il piano giusto per te
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(packages.length, 3)}, 1fr)`,
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {packages.map((pkg, i) => {
          const isFeatured = packages.length === 3 && i === 1
          const accent = pkg.accentColor ?? 'var(--color-accent)'
          return (
            <div
              key={pkg.id}
              style={{
                borderRadius: '0.75rem',
                border: `2px solid ${isFeatured ? accent : 'color-mix(in srgb, var(--color-text) 10%, transparent)'}`,
                padding: '2rem',
                position: 'relative',
                backgroundColor: isFeatured
                  ? `color-mix(in srgb, ${accent} 5%, transparent)`
                  : 'transparent',
              }}
            >
              {isFeatured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-0.875rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: accent,
                    color: '#fff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Consigliato
                </div>
              )}

              <div
                style={{
                  width: '2rem',
                  height: '3px',
                  borderRadius: '9999px',
                  backgroundColor: accent,
                  marginBottom: '1.25rem',
                }}
              />

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: pkg.descShort ? '0.75rem' : '1.5rem',
                }}
              >
                {pkg.title}
              </h3>

              {pkg.descShort && (
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                  }}
                >
                  {pkg.descShort}
                </p>
              )}

              {pkg.descLong && (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {pkg.descLong
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, j) => (
                      <li
                        key={j}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: 'color-mix(in srgb, var(--color-text) 70%, transparent)',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: accent, flexShrink: 0 }}>✓</span>
                        {line.replace(/^[-•✓]\s*/, '')}
                      </li>
                    ))}
                </ul>
              )}

              <Link
                href={`/services/${pkg.slug}` as never}
                style={{
                  display: 'inline-block',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  backgroundColor: isFeatured ? accent : 'transparent',
                  color: isFeatured ? '#fff' : accent,
                  border: `1.5px solid ${accent}`,
                }}
              >
                Scopri di più
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SubServicesSection({
  services,
}: {
  services: {
    id: string
    title: string
    slug: string
    descShort: string | null
    accentColor: string | null
  }[]
}) {
  if (services.length === 0) return null
  return (
    <div
      style={{
        paddingBlock: '4rem',
        borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
      }}
    >
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
        Approfondisci
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {services.map((s) => (
          <Link key={s.id} href={`/services/${s.slug}` as never} style={{ textDecoration: 'none' }}>
            <div
              className="ph-service-card"
              style={
                {
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
                  '--service-accent': s.accentColor ?? 'var(--color-accent)',
                } as React.CSSProperties
              }
            >
              <div
                style={{
                  width: '1.5rem',
                  height: '2px',
                  backgroundColor: s.accentColor ?? 'var(--color-accent)',
                  marginBottom: '1rem',
                }}
              />
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: s.descShort ? '0.5rem' : 0,
                }}
              >
                {s.title}
              </h3>
              {s.descShort && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                    lineHeight: 1.6,
                  }}
                >
                  {s.descShort}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service || service.status !== 'PUBLISHED') notFound()

  const safeBody = sanitizeContent(service.descLong)
  const l2Children = service.children.filter((c) => c.level === 'L2_PAGE')
  const l3Children = service.children.filter((c) => c.level === 'L3_PACKAGE')
  const accent = service.accentColor ?? 'var(--color-accent)'

  return (
    <main>
      {/* Hero */}
      <div
        style={{
          paddingTop: '5rem',
          paddingBottom: '4rem',
          borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
          background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 8%, transparent) 0%, transparent 60%)`,
        }}
      >
        <div className="ph-container">
          {/* Breadcrumb */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
          >
            <Link
              href="/services"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                textDecoration: 'none',
              }}
            >
              ← Servizi
            </Link>
            {service.parent && (
              <>
                <span
                  style={{
                    color: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
                    fontSize: '0.75rem',
                  }}
                >
                  /
                </span>
                <Link
                  href={`/services/${service.parent.slug}` as never}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                    textDecoration: 'none',
                  }}
                >
                  {service.parent.title}
                </Link>
              </>
            )}
          </div>

          <span
            style={{
              display: 'inline-block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: accent,
              marginBottom: '1rem',
            }}
          >
            {service.level === 'L3_PACKAGE' ? 'Pacchetto' : 'Servizio'}
          </span>

          <h1
            className="ph-heading-lg"
            style={{ marginBottom: service.descShort ? '1.25rem' : 0, maxWidth: '20ch' }}
          >
            {service.title}
          </h1>

          {service.descShort && (
            <p
              style={{
                fontSize: '1.125rem',
                color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                lineHeight: 1.7,
                maxWidth: '58ch',
              }}
            >
              {service.descShort}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="ph-container" style={{ paddingTop: '4rem' }}>
        {safeBody && (
          // safeBody is pre-sanitized server-side via sanitizeContent() using sanitize-html
          <div
            style={{
              maxWidth: '70ch',
              color: 'color-mix(in srgb, var(--color-text) 80%, transparent)',
              lineHeight: 1.9,
              fontSize: '1.0625rem',
              marginBottom: l2Children.length > 0 || l3Children.length > 0 ? '2rem' : '4rem',
            }}
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        )}

        <SubServicesSection services={l2Children} />
        <PackagesTable packages={l3Children} />
      </div>

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
          Interessato a questo servizio?
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
