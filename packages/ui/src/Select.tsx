import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  placeholder?: string
}

export function Select({ label, options, error, placeholder, id, className = '', ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-[--color-text]">
          {label}
          {props.required ? <span aria-hidden className="ml-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        className={[
          'rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:ring-offset-1',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-[--color-primary]/20 hover:border-[--color-primary]/40',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
