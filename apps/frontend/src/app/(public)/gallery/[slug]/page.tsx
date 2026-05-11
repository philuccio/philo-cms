import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/public/ui/Badge'
import { LinkButton } from '@/components/public/ui/Button'
import { ProjectGallery } from '@/components/public/gallery/ProjectGallery'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  const site = await prisma.site.findFirst({ select: { id: true } })
  if (!site) return null
  return prisma.project.findUnique({
    where: { siteId_slug: { siteId: site.id, slug } },
    include: {
      category: { select: { name: true, color: true } },
      media: {
        orderBy: { order: 'asc' },
        include: {
          media: { select: { id: true, url: true, width: true, height: true, alt: true } },
        },
      },
    },
  })
}

async function getRelated(projectId: string, categoryId: string | null) {
  return prisma.project.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: projectId },
      ...(categoryId ? { categoryId } : {}),
    },
    take: 3,
    orderBy: { order: 'asc' },
    include: {
      category: { select: { name: true, color: true } },
      media: {
        where: { role: 'cover' },
        take: 1,
        include: { media: { select: { url: true } } },
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.excerpt ?? undefined,
    openGraph: {
      title: project.title,
      description: project.excerpt ?? undefined,
      images: project.media[0]?.media.url ? [project.media[0].media.url] : [],
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project || project.status !== 'PUBLISHED') notFound()

  const related = await getRelated(project.id, project.categoryId)

  const galleryImages = project.media
    .filter((m) => m.role !== 'cover' || project.media.length === 1)
    .map((m) => ({
      src: m.media.url,
      width: m.media.width ?? 1920,
      height: m.media.height ?? 1080,
      alt: m.media.alt ?? project.title,
    }))

  const coverUrl =
    project.media.find((m) => m.role === 'cover')?.media.url ?? project.media[0]?.media.url

  const tags = project.tags
    ? project.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const safeBody = project.body
    ? sanitizeHtml(project.body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'width', 'height'],
        },
      })
    : null

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
            alt={project.title}
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

      {/* Header info */}
      <div className="ph-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <Link
          href="/gallery"
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
          ← Gallery
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          <div>
            {project.category && (
              <div style={{ marginBottom: '1rem' }}>
                <Badge label={project.category.name} color={project.category.color} />
              </div>
            )}
            <h1 className="ph-heading-lg" style={{ marginBottom: '1rem' }}>
              {project.title}
            </h1>
            {project.excerpt && (
              <p
                style={{
                  fontSize: '1.125rem',
                  color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                  lineHeight: 1.8,
                  maxWidth: '60ch',
                }}
              >
                {project.excerpt}
              </p>
            )}
          </div>

          {/* Meta sidebar */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
              minWidth: '200px',
            }}
          >
            {project.client && <MetaRow label="Cliente" value={project.client} />}
            {project.year && <MetaRow label="Anno" value={String(project.year)} />}
            {tags.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 35%, transparent)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Tag
                </p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.6875rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: 'color-mix(in srgb, var(--color-text) 6%, transparent)',
                        color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body content — sanitized server-side */}
        {safeBody && (
          <div
            style={{
              marginTop: '3rem',
              maxWidth: '70ch',
              color: 'color-mix(in srgb, var(--color-text) 80%, transparent)',
              lineHeight: 1.9,
              fontSize: '1.0625rem',
            }}
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        )}
      </div>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div className="ph-container" style={{ paddingBottom: '4rem' }}>
          <ProjectGallery images={galleryImages} />
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
            paddingBlock: '4rem',
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
              Progetti correlati
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/gallery/${r.slug}` as never}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: '16/9',
                        backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
                        overflow: 'hidden',
                      }}
                    >
                      {r.media[0]?.media.url && (
                        <img
                          src={r.media[0].media.url}
                          alt={r.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      {r.category && <Badge label={r.category.name} color={r.category.color} />}
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--color-text)',
                          marginTop: '0.5rem',
                        }}
                      >
                        {r.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="ph-container" style={{ paddingBottom: '6rem', textAlign: 'center' }}>
        <LinkButton href="/contact" variant="primary" size="lg">
          Parliamo del tuo progetto
        </LinkButton>
      </div>
    </main>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p
        style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'color-mix(in srgb, var(--color-text) 35%, transparent)',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)', fontWeight: 500 }}>{value}</p>
    </div>
  )
}
