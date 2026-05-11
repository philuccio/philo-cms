'use client'

import { useEffect } from 'react'
import type { ThemeData } from '@/app/actions/theme'

export function ThemeProvider({ theme }: { theme: ThemeData }) {
  useEffect(() => {
    const el = document.querySelector('[data-theme="dark"]') as HTMLElement | null
    if (!el) return
    el.style.setProperty('--color-bg', theme.bgColor)
    el.style.setProperty('--color-text', theme.textColor)
    el.style.setProperty('--color-accent', theme.accentColor)
    el.style.setProperty('--color-primary', theme.primaryColor)
    el.style.setProperty('--color-secondary', theme.secondaryColor)
    el.style.setProperty('--font-display', `'${theme.fontDisplay}', Georgia, serif`)
    el.style.setProperty('--font-body', `'${theme.fontBody}', system-ui, sans-serif`)
  }, [theme])

  return null
}
