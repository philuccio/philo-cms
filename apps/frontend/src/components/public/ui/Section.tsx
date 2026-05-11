import type { HTMLAttributes } from 'react'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  narrow?: boolean
  as?: 'section' | 'div' | 'article'
}

export function Section({
  narrow = false,
  as: Tag = 'section',
  children,
  style,
  ...props
}: SectionProps) {
  return (
    <Tag style={{ paddingBlock: 'var(--spacing-section)', ...style }} {...props}>
      <div className={narrow ? 'ph-container-narrow' : 'ph-container'}>{children}</div>
    </Tag>
  )
}

interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
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
      {children}
    </p>
  )
}

interface SectionHeadingProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
}

export function SectionHeading({ children, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <Tag className="ph-heading-lg" style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
      {children}
    </Tag>
  )
}
