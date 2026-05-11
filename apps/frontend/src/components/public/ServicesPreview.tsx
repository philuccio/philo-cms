import Link from 'next/link'
import { Section, SectionLabel, SectionHeading } from './ui/Section'
import { LinkButton } from './ui/Button'

interface ServiceCard {
  id: string
  title: string
  slug: string
  icon: string | null
  descShort: string | null
  accentColor: string | null
}

export function ServicesPreview({ services }: { services: ServiceCard[] }) {
  return (
    <Section style={{ backgroundColor: 'color-mix(in srgb, var(--color-text) 3%, transparent)' }}>
      <div className="mb-12 flex items-end justify-between">
        <div>
          <SectionLabel>Cosa facciamo</SectionLabel>
          <SectionHeading>I nostri servizi</SectionHeading>
        </div>
        <LinkButton href="/services" variant="ghost" size="sm">
          Vedi tutti →
        </LinkButton>
      </div>

      {services.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '6rem 0',
            color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
          }}
        >
          Nessun servizio pubblicato
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)',
                    height: '100%',
                    '--service-accent': s.accentColor ?? 'var(--color-accent)',
                  } as React.CSSProperties
                }
              >
                {/* Accent line */}
                <div
                  style={{
                    width: '2rem',
                    height: '2px',
                    backgroundColor: s.accentColor ?? 'var(--color-accent)',
                    marginBottom: '1.25rem',
                  }}
                />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: s.descShort ? '0.75rem' : 0,
                  }}
                >
                  {s.title}
                </h3>
                {s.descShort && (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                      lineHeight: 1.7,
                    }}
                  >
                    {s.descShort}
                  </p>
                )}
                <p
                  style={{
                    marginTop: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: s.accentColor ?? 'var(--color-accent)',
                  }}
                >
                  Scopri →
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
