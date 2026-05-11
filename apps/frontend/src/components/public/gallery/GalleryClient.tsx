'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Badge } from '../ui/Badge'
import Link from 'next/link'

export interface GalleryProject {
  id: string
  title: string
  slug: string
  excerpt: string | null
  year: number | null
  client: string | null
  categoryId: string | null
  categoryName: string | null
  categoryColor: string | null
  coverUrl: string | null
  coverWidth: number | null
  coverHeight: number | null
  depth: 'THUMBNAIL' | 'CARD' | 'FULL'
}

export interface GalleryCategory {
  id: string
  name: string
  slug: string
  color: string
}

interface GalleryClientProps {
  projects: GalleryProject[]
  categories: GalleryCategory[]
  layout: 'GRID' | 'MASONRY' | 'FULLWIDTH' | 'FILMSTRIP' | 'BENTO_GRID'
  cols: number
  hasFilters: boolean
  hasLightbox: boolean
  initialCategory?: string
}

export function GalleryClient({
  projects,
  categories,
  layout,
  cols,
  hasFilters,
  hasLightbox,
  initialCategory,
}: GalleryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('cat') ?? initialCategory ?? 'all'
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const filtered = useMemo(
    () =>
      activeCategory === 'all' ? projects : projects.filter((p) => p.categoryId === activeCategory),
    [projects, activeCategory],
  )

  const lightboxSlides = useMemo(
    () =>
      filtered
        .filter((p) => p.coverUrl)
        .map((p) => ({
          src: p.coverUrl!,
          width: p.coverWidth ?? 1920,
          height: p.coverHeight ?? 1080,
          alt: p.title,
        })),
    [filtered],
  )

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'all') params.delete('cat')
    else params.set('cat', cat)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const openLightbox = useCallback(
    (project: GalleryProject) => {
      if (!hasLightbox || !project.coverUrl) return
      const idx = lightboxSlides.findIndex((s) => s.src === project.coverUrl)
      if (idx >= 0) setLightboxIndex(idx)
    },
    [hasLightbox, lightboxSlides],
  )

  return (
    <>
      {/* Filters */}
      {hasFilters && categories.length > 0 && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory('all')}
            style={{
              padding: '0.375rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: activeCategory === 'all' ? 'var(--color-accent)' : 'transparent',
              color:
                activeCategory === 'all'
                  ? '#fff'
                  : 'color-mix(in srgb, var(--color-text) 60%, transparent)',
              borderColor:
                activeCategory === 'all'
                  ? 'var(--color-accent)'
                  : 'color-mix(in srgb, var(--color-text) 15%, transparent)',
            }}
          >
            Tutti
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: '0.375rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: activeCategory === cat.id ? cat.color : 'transparent',
                color:
                  activeCategory === cat.id
                    ? '#fff'
                    : 'color-mix(in srgb, var(--color-text) 60%, transparent)',
                borderColor:
                  activeCategory === cat.id
                    ? cat.color
                    : 'color-mix(in srgb, var(--color-text) 15%, transparent)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '8rem 0',
            color: 'color-mix(in srgb, var(--color-text) 30%, transparent)',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
          }}
        >
          Nessun progetto in questa categoria
        </div>
      )}

      {/* Grid layout */}
      {layout === 'GRID' && filtered.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: '1.5rem',
          }}
        >
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpenLightbox={openLightbox}
              hasLightbox={hasLightbox}
            />
          ))}
        </div>
      )}

      {/* Masonry layout */}
      {layout === 'MASONRY' && filtered.length > 0 && (
        <div style={{ columns: cols, gap: '1.5rem' }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ breakInside: 'avoid', marginBottom: '1.5rem' }}>
              <ProjectCard project={p} onOpenLightbox={openLightbox} hasLightbox={hasLightbox} />
            </div>
          ))}
        </div>
      )}

      {/* Fullwidth alternating layout */}
      {layout === 'FULLWIDTH' && filtered.length > 0 && (
        <div className="flex flex-col gap-16">
          {filtered.map((p, i) => (
            <FullwidthCard
              key={p.id}
              project={p}
              reverse={i % 2 === 1}
              onOpenLightbox={openLightbox}
              hasLightbox={hasLightbox}
            />
          ))}
        </div>
      )}

      {/* Filmstrip layout */}
      {layout === 'FILMSTRIP' && filtered.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollSnapType: 'x mandatory',
          }}
        >
          {filtered.map((p) => (
            <div key={p.id} style={{ flexShrink: 0, width: '320px', scrollSnapAlign: 'start' }}>
              <ProjectCard project={p} onOpenLightbox={openLightbox} hasLightbox={hasLightbox} />
            </div>
          ))}
        </div>
      )}

      {/* Bento grid */}
      {layout === 'BENTO_GRID' && filtered.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '200px',
            gap: '1rem',
          }}
        >
          {filtered.map((p, i) => {
            const isFeatured = i % 5 === 0
            return (
              <div
                key={p.id}
                style={{
                  gridColumn: isFeatured ? 'span 2' : 'span 1',
                  gridRow: isFeatured ? 'span 2' : 'span 1',
                }}
              >
                <ProjectCard
                  project={p}
                  onOpenLightbox={openLightbox}
                  hasLightbox={hasLightbox}
                  fill
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox */}
      {hasLightbox && (
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={lightboxSlides}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.95)' },
          }}
        />
      )}
    </>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project: p,
  onOpenLightbox,
  hasLightbox,
  fill = false,
}: {
  project: GalleryProject
  onOpenLightbox: (p: GalleryProject) => void
  hasLightbox: boolean
  fill?: boolean
}) {
  const isClickableAsLightbox = hasLightbox && p.coverUrl && p.depth === 'THUMBNAIL'
  const isNavigable = p.depth !== 'THUMBNAIL'

  const inner = (
    <article
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0.5rem',
        border: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
        cursor: isClickableAsLightbox || isNavigable ? 'pointer' : 'default',
        height: fill ? '100%' : undefined,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor =
          'color-mix(in srgb, var(--color-accent) 40%, transparent)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor =
          'color-mix(in srgb, var(--color-text) 8%, transparent)')
      }
    >
      {/* Cover image */}
      <div
        style={{
          aspectRatio: fill ? undefined : '4/3',
          height: fill ? '100%' : undefined,
          backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {p.coverUrl ? (
          <img
            src={p.coverUrl}
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
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
              minHeight: '200px',
            }}
          >
            {p.title}
          </div>
        )}

        {/* Overlay on hover for CARD/FULL depth */}
        {p.depth !== 'THUMBNAIL' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
              opacity: 0,
              transition: 'opacity 0.3s',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '1.25rem',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0')}
          >
            <div>
              {p.categoryName && (
                <Badge label={p.categoryName} color={p.categoryColor ?? undefined} />
              )}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#fff',
                  marginTop: '0.5rem',
                }}
              >
                {p.title}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Info below (for CARD depth) */}
      {p.depth === 'CARD' && (
        <div style={{ padding: '1rem' }}>
          <div className="mb-1.5 flex items-center gap-2">
            {p.categoryName && (
              <Badge label={p.categoryName} color={p.categoryColor ?? undefined} />
            )}
            {p.year && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'color-mix(in srgb, var(--color-text) 35%, transparent)',
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
            }}
          >
            {p.title}
          </h3>
          {p.excerpt && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                marginTop: '0.375rem',
                lineHeight: 1.6,
              }}
            >
              {p.excerpt}
            </p>
          )}
        </div>
      )}
    </article>
  )

  if (isClickableAsLightbox) {
    return (
      <div onClick={() => onOpenLightbox(p)} style={{ height: fill ? '100%' : undefined }}>
        {inner}
      </div>
    )
  }

  if (isNavigable) {
    return (
      <Link
        href={`/gallery/${p.slug}` as never}
        style={{ display: 'block', textDecoration: 'none', height: fill ? '100%' : undefined }}
      >
        {inner}
      </Link>
    )
  }

  return inner
}

// ── Fullwidth Card ────────────────────────────────────────────────────────────

function FullwidthCard({
  project: p,
  reverse,
  onOpenLightbox,
  hasLightbox,
}: {
  project: GalleryProject
  reverse: boolean
  onOpenLightbox: (p: GalleryProject) => void
  hasLightbox: boolean
}) {
  const content = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        direction: reverse ? 'rtl' : 'ltr',
      }}
    >
      <div
        style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: '0.5rem', direction: 'ltr' }}
      >
        {p.coverUrl ? (
          <img
            src={p.coverUrl}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
              minHeight: '300px',
            }}
          />
        )}
      </div>
      <div style={{ direction: 'ltr' }}>
        {p.categoryName && <Badge label={p.categoryName} color={p.categoryColor ?? undefined} />}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          {p.title}
        </h2>
        {p.excerpt && (
          <p
            style={{
              color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
              lineHeight: 1.8,
            }}
          >
            {p.excerpt}
          </p>
        )}
        {p.client && (
          <p
            style={{
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}
          >
            Cliente: {p.client}
          </p>
        )}
        {p.depth !== 'THUMBNAIL' && (
          <Link
            href={`/gallery/${p.slug}` as never}
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}
          >
            Scopri il progetto →
          </Link>
        )}
      </div>
    </div>
  )

  return <div>{content}</div>
}
