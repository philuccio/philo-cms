export interface PhiloTheme {
  id: string
  siteId: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  textColor: string
  fontDisplay: string
  fontBody: string
  presetName?: string | null
  customCss?: string | null
}

export type ThemePreset = 'dark-luxury' | 'clean-white' | 'editorial-bold' | 'soft-neutral'

export const THEME_PRESETS: Record<ThemePreset, Omit<PhiloTheme, 'id' | 'siteId' | 'customCss'>> = {
  'dark-luxury': {
    primaryColor: '#0a0a0a',
    secondaryColor: '#f5f2ed',
    accentColor: '#c9a84c',
    bgColor: '#0a0a0a',
    textColor: '#f5f2ed',
    fontDisplay: 'Cormorant Garamond',
    fontBody: 'DM Sans',
    presetName: 'Dark Luxury',
  },
  'clean-white': {
    primaryColor: '#1c1c1c',
    secondaryColor: '#f9f9f9',
    accentColor: '#2563eb',
    bgColor: '#ffffff',
    textColor: '#1c1c1c',
    fontDisplay: 'Playfair Display',
    fontBody: 'Inter',
    presetName: 'Clean White',
  },
  'editorial-bold': {
    primaryColor: '#111111',
    secondaryColor: '#f0ece4',
    accentColor: '#e63946',
    bgColor: '#f0ece4',
    textColor: '#111111',
    fontDisplay: 'Bebas Neue',
    fontBody: 'Source Sans 3',
    presetName: 'Editorial Bold',
  },
  'soft-neutral': {
    primaryColor: '#3d3d3d',
    secondaryColor: '#faf8f5',
    accentColor: '#8b7355',
    bgColor: '#faf8f5',
    textColor: '#3d3d3d',
    fontDisplay: 'Libre Baskerville',
    fontBody: 'Nunito Sans',
    presetName: 'Soft Neutral',
  },
}
