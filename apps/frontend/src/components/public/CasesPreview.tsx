import Link from 'next/link'
import { Section, SectionLabel, SectionHeading } from './ui/Section'
import { LinkButton } from './ui/Button'

interface CaseCard {
  id: string
  title: string
  slug: string
  brief: string | null
  coverUrl: string | null
  kpiCount: number
}

export function CasesPreview({ cases }: { cases: CaseCard[] }) {
  if (cases.length === 0) return null

  return (
    <Section>
      <div className="mb-12 flex items-end justify-between">
        <div>
          <SectionLabel>Case History</SectionLabel>
          <SectionHeading>I nostri risultati</SectionHeading>
        </div>
        <LinkButton href="/cases" variant="ghost" size="sm">
          Vedi tutti →
        </LinkButton>
      </div>

      <div
        className="flex flex-col gap-px"
        style={{ borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)' }}
      >
        {cases.map((c, i) => (
          <Link key={c.id} href={`/cases/${c.slug}` as never} style={{ textDecoration: 'none' }}>
            <article
              className="ph-hover-fade"
              style={{
                display: 'grid',
                gridTemplateColumns: '3rem 1fr auto',
                alignItems: 'center',
                gap: '2rem',
                padding: '1.75rem 0',
                borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'color-mix(in srgb, var(--color-text) 15%, transparent)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: c.brief ? '0.375rem' : 0,
                  }}
                >
                  {c.title}
                </h3>
                {c.brief && (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                      maxWidth: '60ch',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.brief}
                  </p>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                }}
              >
                Leggi →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </Section>
  )
}
