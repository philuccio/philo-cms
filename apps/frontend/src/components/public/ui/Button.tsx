import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: Variant
  size?: Size
}

const styles = (variant: Variant, size: Size): React.CSSProperties => {
  const padding = size === 'sm' ? '0.5rem 1.25rem' : size === 'lg' ? '1rem 2.5rem' : '0.75rem 2rem'
  const fontSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem'

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding,
    fontSize,
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    textDecoration: 'none',
    fontFamily: 'inherit',
  }

  if (variant === 'primary') {
    return { ...base, backgroundColor: 'var(--color-accent)', color: '#fff' }
  }
  if (variant === 'outline') {
    return {
      ...base,
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
      border: '1px solid color-mix(in srgb, var(--color-text) 30%, transparent)',
    }
  }
  return {
    ...base,
    backgroundColor: 'transparent',
    color: 'color-mix(in srgb, var(--color-text) 70%, transparent)',
    border: 'none',
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button style={{ ...styles(variant, size), ...style }} {...props}>
      {children}
    </button>
  )
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href as never} style={{ ...styles(variant, size), ...style }} {...props}>
      {children}
    </Link>
  )
}
