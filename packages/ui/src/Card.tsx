import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
  elevated?: boolean
}

export function Card({ bordered = true, elevated = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg bg-[--color-bg] p-6',
        bordered ? 'border border-[--color-primary]/10' : '',
        elevated ? 'shadow-md' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['mb-4 flex items-center justify-between', className].join(' ')} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={['font-[--font-display] text-lg font-semibold text-[--color-text]', className].join(' ')}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['text-[--color-text]/80', className].join(' ')} {...props}>
      {children}
    </div>
  )
}
