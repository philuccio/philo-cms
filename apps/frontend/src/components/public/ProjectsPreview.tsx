import Link from 'next/link'
import { Section, SectionLabel, SectionHeading } from './ui/Section'
import { Badge } from './ui/Badge'
import { LinkButton } from './ui/Button'

interface ProjectCard {
  id: string
  title: string
  slug: string
  excerpt: string | null
  year: number | null
  client: string | null
  categoryName: string | null
  categoryColor: string | null
  coverUrl: string | null
}

export function ProjectsPreview({ projects }: { projects: ProjectCard[] }) {
  return (
    <Section>
      <div className="mb-12 flex items-end justify-between">
        <div>
          <SectionLabel>Portfolio</SectionLabel>
          <SectionHeading>Lavori selezionati</SectionHeading>
        </div>
        <LinkButton href="/gallery" variant="ghost" size="sm">
          Vedi tutti →
        </LinkButton>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '6rem 0',
            color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
          }}
        >
          Nessun progetto pubblicato
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/gallery/${p.slug}` as never}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <article
                className="ph-hover-accent-border"
                style={{
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
                }}
              >
                {/* Cover */}
                <div
                  style={{
                    aspectRatio: '16/9',
                    backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
                    overflow: 'hidden',
                  }}
                >
                  {p.coverUrl ? (
                    <img
                      src={p.coverUrl}
                      alt={p.title}
                      className="ph-hover-zoom"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {p.title}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem' }}>
                  <div className="mb-2 flex items-center gap-2">
                    {p.categoryName && (
                      <Badge label={p.categoryName} color={p.categoryColor ?? undefined} />
                    )}
                    {p.year && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'color-mix(in srgb, var(--color-text) 35%, transparent)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {p.year}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: p.excerpt ? '0.5rem' : 0,
                    }}
                  >
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
