interface BadgeProps {
  label: string
  color?: string
  className?: string
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderRadius: '9999px',
        backgroundColor: color
          ? `color-mix(in srgb, ${color} 15%, transparent)`
          : 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
        color: color ?? 'var(--color-accent)',
        border: `1px solid ${color ? `color-mix(in srgb, ${color} 25%, transparent)` : 'color-mix(in srgb, var(--color-accent) 25%, transparent)'}`,
      }}
    >
      {label}
    </span>
  )
}
