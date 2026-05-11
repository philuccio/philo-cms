import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Section, SectionLabel, SectionHeading } from '@/components/public/ui/Section'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Case History',
  description: 'I nostri case study e risultati',
}

async function getCases() {
  const site = await prisma.site.findFirst({ select: { id: true } })
  if (!site) return []
  return prisma.caseHistory.findMany({
    where: { siteId: site.id, status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
    include: {
      kpis: { orderBy: { order: 'asc' }, take: 3 },
      media: {
        where: { order: 0 },
        take: 1,
        include: { media: { select: { url: true, alt: true } } },
      },
    },
  })
}

export default async function CasesPage() {
  const cases = await getCases()

  return (
    <main>
      <Section>
        <SectionLabel>Case History</SectionLabel>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '4rem',
          }}
        >
          <SectionHeading as="h1">I nostri risultati</SectionHeading>
          <p
            style={{
              color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
              fontSize: '0.875rem',
            }}
          >
            {cases.length} {cases.length === 1 ? 'case study' : 'case study'}
          </p>
        </div>

        {cases.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '8rem 0',
              color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
            }}
          >
            Nessun case study pubblicato
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cases.map((c, i) => {
            const coverUrl = c.media[0]?.media.url
            const topKpis = c.kpis.slice(0, 3)
            return (
              <Link
                key={c.id}
                href={`/cases/${c.slug}` as never}
                style={{ textDecoration: 'none' }}
              >
                <article
                  className="ph-hover-fade"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: coverUrl ? '1fr 1fr' : '1fr',
                    gap: '3rem',
                    alignItems: 'center',
                    padding: '4rem 0',
                    borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '5rem',
                        fontWeight: 700,
                        color: 'color-mix(in srgb, var(--color-text) 6%, transparent)',
                        lineHeight: 1,
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        marginBottom: c.brief ? '1rem' : '1.5rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {c.title}
                    </h2>
                    {c.brief && (
                      <p
                        style={{
                          fontSize: '1rem',
                          color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                          lineHeight: 1.7,
                          maxWidth: '52ch',
                          marginBottom: '1.5rem',
                        }}
                      >
                        {c.brief}
                      </p>
                    )}

                    {topKpis.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {topKpis.map((kpi) => (
                          <span
                            key={kpi.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.3rem 0.75rem',
                              borderRadius: '9999px',
                              border:
                                '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--color-accent)',
                            }}
                          >
                            <span
                              style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem' }}
                            >
                              {kpi.value}
                            </span>
                            <span
                              style={{
                                color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                                fontWeight: 400,
                              }}
                            >
                              {kpi.label}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    <p
                      style={{
                        marginTop: '1.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                      }}
                    >
                      Leggi il case →
                    </p>
                  </div>

                  {coverUrl && (
                    <div
                      style={{
                        aspectRatio: '4/3',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
                      }}
                    >
                      <img
                        src={coverUrl}
                        alt={c.media[0]?.media.alt ?? c.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </article>
              </Link>
            )
          })}
        </div>
      </Section>
    </main>
  )
}
