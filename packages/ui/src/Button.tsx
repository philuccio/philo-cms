import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[--color-primary] text-[--color-secondary] hover:opacity-90 focus-visible:ring-[--color-primary]',
  secondary:
    'bg-[--color-secondary] text-[--color-primary] hover:opacity-90 focus-visible:ring-[--color-secondary]',
  ghost: 'bg-transparent text-[--color-text] hover:bg-[--color-primary]/10 focus-visible:ring-[--color-primary]',
  outline:
    'border border-[--color-primary] bg-transparent text-[--color-primary] hover:bg-[--color-primary]/5 focus-visible:ring-[--color-primary]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={[
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded font-medium',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}
