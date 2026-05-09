import type { PhiloTheme } from '@philo/types'

const SAFE_COLOR_RE = /^#[0-9a-fA-F]{3,8}$|^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/
const SAFE_FONT_RE = /^[\w\s,'-]+$/

function sanitizeColor(value: string): string {
  return SAFE_COLOR_RE.test(value.trim()) ? value.trim() : '#000000'
}

function sanitizeFont(value: string): string {
  return SAFE_FONT_RE.test(value.trim()) ? value.trim() : 'sans-serif'
}

export function themeToCssVars(theme: PhiloTheme): string {
  const vars: Record<string, string> = {
    '--color-primary': sanitizeColor(theme.primaryColor),
    '--color-secondary': sanitizeColor(theme.secondaryColor),
    '--color-accent': sanitizeColor(theme.accentColor),
    '--color-bg': sanitizeColor(theme.bgColor),
    '--color-text': sanitizeColor(theme.textColor),
    '--font-display': `"${sanitizeFont(theme.fontDisplay)}", Georgia, serif`,
    '--font-body': `"${sanitizeFont(theme.fontBody)}", system-ui, sans-serif`,
  }

  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')
}
