interface DividerProps {
  accent?: boolean
}

export function Divider({ accent = false }: DividerProps) {
  return (
    <hr
      style={{
        border: 'none',
        height: '1px',
        backgroundColor: accent
          ? 'var(--color-accent)'
          : 'color-mix(in srgb, var(--color-text) 10%, transparent)',
        width: accent ? '3rem' : '100%',
        marginBlock: accent ? '1.5rem' : '0',
      }}
    />
  )
}
