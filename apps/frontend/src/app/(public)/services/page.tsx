import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Section, SectionLabel, SectionHeading } from '@/components/public/ui/Section'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Servizi',
  description: 'I nostri servizi e soluzioni',
}

async function getServices() {
  const site = await prisma.site.findFirst({ select: { id: true } })
  if (!site) return []
  return prisma.service.findMany({
    where: { siteId: site.id, status: 'PUBLISHED', level: 'L1_CARD' },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { children: true } },
    },
  })
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main>
      <Section>
        <SectionLabel>Cosa facciamo</SectionLabel>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '4rem',
          }}
        >
          <SectionHeading as="h1">I nostri servizi</SectionHeading>
          <p
            style={{
              color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
              fontSize: '0.875rem',
            }}
          >
            {services.length} {services.length === 1 ? 'servizio' : 'servizi'}
          </p>
        </div>

        {services.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '8rem 0',
              color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
            }}
          >
            Nessun servizio pubblicato
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}` as never}
              style={{ textDecoration: 'none' }}
            >
              <article
                className="ph-service-card"
                style={
                  {
                    padding: '2.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)',
                    height: '100%',
                    '--service-accent': s.accentColor ?? 'var(--color-accent)',
                  } as React.CSSProperties
                }
              >
                {/* Accent bar */}
                <div
                  style={{
                    width: '2.5rem',
                    height: '3px',
                    borderRadius: '9999px',
                    backgroundColor: s.accentColor ?? 'var(--color-accent)',
                    marginBottom: '1.5rem',
                  }}
                />

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: s.descShort ? '0.75rem' : '1.5rem',
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h2>

                {s.descShort && (
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                      lineHeight: 1.7,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {s.descShort}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: s.accentColor ?? 'var(--color-accent)',
                    }}
                  >
                    Scopri →
                  </span>
                  {s._count.children > 0 && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: 'color-mix(in srgb, var(--color-text) 6%, transparent)',
                        color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                      }}
                    >
                      {s._count.children} opzioni
                    </span>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  )
}
