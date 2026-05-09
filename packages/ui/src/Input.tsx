import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[--color-text]"
        >
          {label}
          {props.required ? <span aria-hidden className="ml-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={[
          'rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]',
          'placeholder:text-[--color-text]/40',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:ring-offset-1',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-[--color-primary]/20 hover:border-[--color-primary]/40',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-[--color-text]/50">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
