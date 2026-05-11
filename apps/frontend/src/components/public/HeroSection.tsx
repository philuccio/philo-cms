import { LinkButton } from './ui/Button'

export type HeroVariant = 'fullscreen' | 'split' | 'minimal'

interface HeroSectionProps {
  variant?: HeroVariant
  title: string
  subtitle?: string | null
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  imageUrl?: string | null
}

export function HeroSection({
  variant = 'minimal',
  title,
  subtitle,
  ctaLabel = 'Scopri i lavori',
  ctaHref = '/gallery',
  secondaryCtaLabel = 'Contattaci',
  secondaryCtaHref = '/contact',
  imageUrl,
}: HeroSectionProps) {
  if (variant === 'fullscreen') {
    return (
      <section
        style={{
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--color-bg) 80%, transparent) 0%, transparent 60%)',
          }}
        />
        <div className="ph-container" style={{ position: 'relative', paddingBottom: '5rem' }}>
          <h1
            className="ph-heading-xl"
            style={{ maxWidth: '20ch', marginBottom: '1.5rem', color: 'var(--color-text)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '1.125rem',
                color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
                maxWidth: '50ch',
                marginBottom: '2.5rem',
                lineHeight: 1.7,
              }}
            >
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href={ctaHref} variant="primary" size="lg">
              {ctaLabel}
            </LinkButton>
            <LinkButton href={secondaryCtaHref} variant="outline" size="lg">
              {secondaryCtaLabel}
            </LinkButton>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'split') {
    return (
      <section style={{ minHeight: '100svh', display: 'flex', alignItems: 'center' }}>
        <div
          className="ph-container"
          style={{
            display: 'grid',
            gridTemplateColumns: imageUrl ? '1fr 1fr' : '1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                width: '2.5rem',
                height: '2px',
                backgroundColor: 'var(--color-accent)',
                marginBottom: '2rem',
              }}
            />
            <h1
              className="ph-heading-lg"
              style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
                  lineHeight: 1.8,
                  maxWidth: '45ch',
                  marginBottom: '2.5rem',
                }}
              >
                {subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <LinkButton href={ctaHref} variant="primary">
                {ctaLabel}
              </LinkButton>
              <LinkButton href={secondaryCtaHref} variant="outline">
                {secondaryCtaLabel}
              </LinkButton>
            </div>
          </div>
          {imageUrl && (
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', borderRadius: '0.5rem' }}>
              <img
                src={imageUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  // minimal (default)
  return (
    <section
      style={{
        minHeight: '85svh',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
      }}
    >
      <div className="ph-container" style={{ paddingBlock: '6rem' }}>
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1.5rem',
          }}
        >
          Agenzia Creativa
        </p>
        <h1
          className="ph-heading-xl"
          style={{
            maxWidth: '18ch',
            marginBottom: '2rem',
            color: 'var(--color-text)',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '1.125rem',
              color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
              maxWidth: '55ch',
              lineHeight: 1.8,
              marginBottom: '3rem',
            }}
          >
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <LinkButton href={ctaHref} variant="primary" size="lg">
            {ctaLabel}
          </LinkButton>
          <LinkButton href={secondaryCtaHref} variant="ghost" size="lg">
            {secondaryCtaLabel} →
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
