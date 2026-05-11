import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'
import type {
  BlockType,
  HeroBlockContent,
  TextBlockContent,
  ImageBlockContent,
  QuoteBlockContent,
  StatsBlockContent,
  CtaBlockContent,
  MapBlockContent,
} from '@philo/types'

interface RawBlock {
  id: string
  type: string
  order: number
  content: string
}

// Strips all dangerous tags/attributes server-side before rendering
function clean(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
    },
  })
}

function HeroBlock({ c }: { c: HeroBlockContent }) {
  const isFullscreen = c.variant === 'fullscreen'
  const isSplit = c.variant === 'split'

  return (
    <div
      style={{
        position: 'relative',
        minHeight: isFullscreen ? '80vh' : isSplit ? '60vh' : '40vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'color-mix(in srgb, var(--color-text) 4%, transparent)',
      }}
    >
      {c.mediaUrl && c.mediaType !== 'video' && (
        <img
          src={c.mediaUrl}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
          }}
        />
      )}
      {c.mediaUrl && c.mediaType === 'video' && (
        <video
          src={c.mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
          }}
        />
      )}
      <div
        className="ph-container"
        style={{ position: 'relative', zIndex: 1, paddingBlock: '6rem' }}
      >
        <h1
          className="ph-heading-xl"
          style={{
            maxWidth: '18ch',
            marginBottom: c.subheading ? '1.5rem' : c.ctaLabel ? '2.5rem' : 0,
          }}
        >
          {c.heading}
        </h1>
        {c.subheading && (
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
              maxWidth: '52ch',
              lineHeight: 1.7,
              marginBottom: c.ctaLabel ? '2.5rem' : 0,
            }}
          >
            {c.subheading}
          </p>
        )}
        {c.ctaLabel && c.ctaHref && (
          <Link
            href={c.ctaHref as never}
            style={{
              display: 'inline-block',
              padding: '0.875rem 2rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
            }}
          >
            {c.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

function TextBlock({ c }: { c: TextBlockContent }) {
  const align = c.align ?? 'left'
  const cols = c.columns ?? 1
  const sanitized = clean(c.html)

  return (
    <div className="ph-container" style={{ paddingBlock: '4rem' }}>
      <div
        style={{
          textAlign: align,
          columns: cols > 1 ? cols : undefined,
          columnGap: cols > 1 ? '3rem' : undefined,
          maxWidth: cols > 1 ? '100%' : '72ch',
          marginInline: align === 'center' ? 'auto' : undefined,
          color: 'color-mix(in srgb, var(--color-text) 80%, transparent)',
          lineHeight: 1.9,
          fontSize: '1.0625rem',
        }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  )
}

function ImageBlock({ c }: { c: ImageBlockContent }) {
  const maxW = { full: '100%', contained: '1280px', narrow: '800px' }[c.width ?? 'contained']

  return (
    <div
      style={{
        paddingBlock: '2rem',
        maxWidth: maxW,
        marginInline: 'auto',
        paddingInline: '1.5rem',
      }}
    >
      <img
        src={c.url}
        alt={c.alt}
        style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', display: 'block' }}
      />
      {c.caption && (
        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '0.8125rem',
            color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {c.caption}
        </p>
      )}
    </div>
  )
}

function QuoteBlock({ c }: { c: QuoteBlockContent }) {
  return (
    <div
      style={{
        paddingBlock: '5rem',
        borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
      }}
    >
      <div className="ph-container-narrow" style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '2rem',
            height: '2px',
            backgroundColor: 'var(--color-accent)',
            marginInline: 'auto',
            marginBottom: '2rem',
          }}
        />
        <blockquote
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            fontWeight: 500,
            color: 'var(--color-text)',
            lineHeight: 1.5,
            fontStyle: 'italic',
            margin: 0,
            marginBottom: c.author ? '2rem' : 0,
          }}
        >
          &ldquo;{c.text}&rdquo;
        </blockquote>
        {c.author && (
          <cite style={{ fontStyle: 'normal', display: 'block' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                letterSpacing: '0.05em',
              }}
            >
              {c.author}
            </span>
            {c.role && (
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
                  marginTop: '0.25rem',
                  letterSpacing: '0.05em',
                }}
              >
                {c.role}
              </span>
            )}
          </cite>
        )}
      </div>
    </div>
  )
}

function StatsBlock({ c }: { c: StatsBlockContent }) {
  return (
    <div
      style={{
        paddingBlock: '5rem',
        backgroundColor: 'color-mix(in srgb, var(--color-text) 3%, transparent)',
        borderTop: '1px solid color-mix(in srgb, var(--color-text) 6%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--color-text) 6%, transparent)',
      }}
    >
      <div className="ph-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(c.items.length, 4)}, 1fr)`,
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {c.items.map((item, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {item.value}
                {item.suffix && (
                  <span style={{ fontSize: '0.5em', verticalAlign: 'super', marginLeft: '0.15em' }}>
                    {item.suffix}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CtaBlock({ c }: { c: CtaBlockContent }) {
  return (
    <div className="ph-container" style={{ paddingBlock: '6rem', textAlign: 'center' }}>
      <h2
        className="ph-heading-lg"
        style={{
          marginBottom: c.body ? '1.25rem' : '2.5rem',
          maxWidth: '22ch',
          marginInline: 'auto',
        }}
      >
        {c.heading}
      </h2>
      {c.body && (
        <p
          style={{
            fontSize: '1.0625rem',
            color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
            lineHeight: 1.7,
            maxWidth: '52ch',
            marginInline: 'auto',
            marginBottom: '2.5rem',
          }}
        >
          {c.body}
        </p>
      )}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href={c.primaryHref as never}
          style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            borderRadius: '0.375rem',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9375rem',
            textDecoration: 'none',
          }}
        >
          {c.primaryLabel}
        </Link>
        {c.secondaryLabel && c.secondaryHref && (
          <Link
            href={c.secondaryHref as never}
            style={{
              display: 'inline-block',
              padding: '0.875rem 2rem',
              borderRadius: '0.375rem',
              border: '1.5px solid color-mix(in srgb, var(--color-text) 20%, transparent)',
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
            }}
          >
            {c.secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

function MapBlock({ c }: { c: MapBlockContent }) {
  return (
    <div style={{ paddingBlock: '3rem' }}>
      <iframe
        src={c.embedUrl}
        width="100%"
        height={c.height ?? 400}
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={c.address ?? 'Mappa'}
      />
      {c.address && (
        <div className="ph-container" style={{ paddingTop: '1rem' }}>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
            }}
          >
            {c.address}
          </p>
        </div>
      )}
    </div>
  )
}

const renderers: Record<BlockType, (content: unknown) => React.ReactNode> = {
  hero: (c) => <HeroBlock c={c as HeroBlockContent} />,
  text: (c) => <TextBlock c={c as TextBlockContent} />,
  image: (c) => <ImageBlock c={c as ImageBlockContent} />,
  quote: (c) => <QuoteBlock c={c as QuoteBlockContent} />,
  stats: (c) => <StatsBlock c={c as StatsBlockContent} />,
  cta: (c) => <CtaBlock c={c as CtaBlockContent} />,
  map: (c) => <MapBlock c={c as MapBlockContent} />,
}

export function BlockRenderer({ blocks }: { blocks: RawBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const render = renderers[block.type as BlockType]
        if (!render) return null
        let parsed: unknown
        try {
          parsed = typeof block.content === 'string' ? JSON.parse(block.content) : block.content
        } catch {
          return null
        }
        return <section key={block.id}>{render(parsed)}</section>
      })}
    </>
  )
}
