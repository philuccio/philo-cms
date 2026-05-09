import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[--color-primary]/10 text-[--color-primary]',
  accent: 'bg-[--color-accent]/15 text-[--color-accent]',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-700',
  outline: 'border border-[--color-primary]/30 text-[--color-text]',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
