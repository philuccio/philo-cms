'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  IconDeviceFloppy,
  IconPalette,
  IconTypography,
  IconCode,
  IconCheck,
} from '@tabler/icons-react'
import { saveTheme, type ThemeData } from '@/app/actions/theme'

// ── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: {
  name: string
  label: string
  desc: string
  theme: Omit<ThemeData, 'customCss' | 'presetName'>
}[] = [
  {
    name: 'dark-luxury',
    label: 'Dark Luxury',
    desc: 'Nero intenso con oro',
    theme: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#f5f2ed',
      accentColor: '#c9a84c',
      bgColor: '#0a0a0a',
      textColor: '#f5f2ed',
      fontDisplay: 'Cormorant Garamond',
      fontBody: 'DM Sans',
    },
  },
  {
    name: 'clean-light',
    label: 'Clean Light',
    desc: 'Bianco minimalista',
    theme: {
      primaryColor: '#ffffff',
      secondaryColor: '#111111',
      accentColor: '#2563eb',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
  },
  {
    name: 'warm-natural',
    label: 'Warm Natural',
    desc: 'Toni caldi e terra',
    theme: {
      primaryColor: '#faf7f2',
      secondaryColor: '#2c1a0e',
      accentColor: '#b45309',
      bgColor: '#faf7f2',
      textColor: '#1c0f06',
      fontDisplay: 'Libre Baskerville',
      fontBody: 'Lato',
    },
  },
  {
    name: 'bold-creative',
    label: 'Bold Creative',
    desc: 'Contrasto forte',
    theme: {
      primaryColor: '#09090b',
      secondaryColor: '#fafafa',
      accentColor: '#a855f7',
      bgColor: '#09090b',
      textColor: '#fafafa',
      fontDisplay: 'Raleway',
      fontBody: 'Nunito',
    },
  },
  {
    name: 'sage-studio',
    label: 'Sage Studio',
    desc: 'Verde salvia sofisticato',
    theme: {
      primaryColor: '#f4f7f4',
      secondaryColor: '#1a2e1a',
      accentColor: '#4a7c59',
      bgColor: '#f4f7f4',
      textColor: '#1a2e1a',
      fontDisplay: 'Cormorant Garamond',
      fontBody: 'Open Sans',
    },
  },
]

const DISPLAY_FONTS = [
  'Cormorant Garamond',
  'Playfair Display',
  'Libre Baskerville',
  'Raleway',
  'Montserrat',
  'Josefin Sans',
]

const BODY_FONTS = ['DM Sans', 'Inter', 'Lato', 'Nunito', 'Open Sans', 'Roboto', 'Source Sans 3']

// ── Color field ──────────────────────────────────────────────────────────────

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0">
        <span className="field-label mb-0">{label}</span>
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-[--color-text]/12 h-8 w-12 cursor-pointer rounded border bg-transparent p-0.5"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-base w-28 font-mono text-xs"
        placeholder="#000000"
      />
      <div
        className="border-[--color-text]/10 h-8 w-8 shrink-0 rounded-md border"
        style={{ backgroundColor: value }}
      />
    </div>
  )
}

// ── Live preview ─────────────────────────────────────────────────────────────

function LivePreview({ theme }: { theme: ThemeData }) {
  return (
    <div
      className="border-[--color-text]/10 overflow-hidden rounded-xl border shadow-lg"
      style={{ backgroundColor: theme.bgColor, color: theme.textColor, fontFamily: theme.fontBody }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor:
            theme.primaryColor === theme.bgColor
              ? `color-mix(in srgb, ${theme.textColor} 8%, transparent)`
              : theme.primaryColor,
        }}
        className="flex items-center justify-between px-5 py-3"
      >
        <span
          style={{
            fontFamily: theme.fontDisplay,
            color: theme.accentColor,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '0.1em',
          }}
        >
          STUDIO
        </span>
        <div className="flex gap-4">
          {['Home', 'Servizi', 'Case'].map((l) => (
            <span key={l} style={{ color: theme.textColor, opacity: 0.6, fontSize: 12 }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 py-8">
        <p
          style={{
            color: theme.accentColor,
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Agenzia Creativa
        </p>
        <h2
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Progettiamo esperienze
        </h2>
        <p style={{ opacity: 0.6, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          Design strategico che trasforma idee in risultati concreti per il tuo business.
        </p>
        <div className="flex gap-3">
          <span
            className="rounded px-4 py-2 text-xs font-medium"
            style={{ backgroundColor: theme.accentColor, color: theme.bgColor }}
          >
            Scopri i servizi
          </span>
          <span
            className="rounded border px-4 py-2 text-xs"
            style={{
              borderColor: `color-mix(in srgb, ${theme.textColor} 25%, transparent)`,
              color: theme.textColor,
            }}
          >
            Case history
          </span>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-3 gap-3 px-6 pb-6">
        {['Branding', 'Web', 'Strategy'].map((t) => (
          <div
            key={t}
            className="rounded-lg p-3"
            style={{
              backgroundColor: `color-mix(in srgb, ${theme.textColor} 6%, transparent)`,
              border: `1px solid color-mix(in srgb, ${theme.textColor} 10%, transparent)`,
            }}
          >
            <div
              className="mb-1.5 h-1 w-6 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <p style={{ fontFamily: theme.fontDisplay, fontSize: 13, fontWeight: 600 }}>{t}</p>
            <p style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>Scopri →</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type Tab = 'presets' | 'colors' | 'typography' | 'css'

interface ThemeBuilderProps {
  initialTheme: ThemeData
}

export function ThemeBuilder({ initialTheme }: ThemeBuilderProps) {
  const [theme, setTheme] = useState<ThemeData>(initialTheme)
  const [tab, setTab] = useState<Tab>('presets')
  const [isPending, startTransition] = useTransition()

  function set<K extends keyof ThemeData>(key: K, value: ThemeData[K]) {
    setTheme((t) => ({
      ...t,
      [key]: value,
      presetName: key === 'presetName' ? (value as string) : null,
    }))
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setTheme((t) => ({ ...t, ...preset.theme, presetName: preset.name }))
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveTheme(theme)
        toast.success('Tema salvato')
      } catch {
        toast.error('Errore durante il salvataggio')
      }
    })
  }

  const TABS: {
    id: Tab
    label: string
    Icon: React.ComponentType<{ size?: number; stroke?: number }>
  }[] = [
    { id: 'presets', label: 'Preset', Icon: IconPalette },
    { id: 'colors', label: 'Colori', Icon: IconPalette },
    { id: 'typography', label: 'Tipografia', Icon: IconTypography },
    { id: 'css', label: 'CSS Custom', Icon: IconCode },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-[--color-text]/8 flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-[--color-text]">Theme Builder</h1>
          <p className="text-[--color-text]/40 mt-0.5 text-sm">
            Personalizza l&apos;aspetto del sito pubblico
          </p>
        </div>
        <button onClick={handleSave} disabled={isPending} className="btn-primary">
          <IconDeviceFloppy size={16} />
          Salva tema
        </button>
      </div>

      {/* Body: controls left + preview right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Controls */}
        <div className="border-[--color-text]/8 flex w-[420px] shrink-0 flex-col border-r">
          {/* Tabs */}
          <div className="border-[--color-text]/8 flex border-b">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm transition-colors ${
                  tab === id
                    ? 'border-[--color-accent] text-[--color-accent]'
                    : 'text-[--color-text]/40 border-transparent hover:text-[--color-text]'
                }`}
              >
                <Icon size={14} stroke={1.5} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {/* Presets */}
            {tab === 'presets' && (
              <div className="space-y-2">
                <p className="text-[--color-text]/40 mb-3 text-xs">
                  Scegli un punto di partenza e personalizza i dettagli.
                </p>
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      theme.presetName === p.name
                        ? 'border-[--color-accent]/50 bg-[--color-accent]/8'
                        : 'border-[--color-text]/10 hover:border-[--color-text]/20 hover:bg-[--color-text]/3'
                    }`}
                  >
                    {/* Color swatch */}
                    <div className="flex shrink-0 gap-1">
                      {[p.theme.bgColor, p.theme.accentColor, p.theme.textColor].map((c, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-md"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[--color-text]">{p.label}</p>
                      <p className="text-[--color-text]/40 text-xs">{p.desc}</p>
                    </div>
                    {theme.presetName === p.name && (
                      <IconCheck size={16} className="shrink-0 text-[--color-accent]" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Colors */}
            {tab === 'colors' && (
              <div className="space-y-4">
                <ColorField
                  label="Sfondo"
                  value={theme.bgColor}
                  onChange={(v) => set('bgColor', v)}
                />
                <ColorField
                  label="Testo"
                  value={theme.textColor}
                  onChange={(v) => set('textColor', v)}
                />
                <ColorField
                  label="Accento"
                  value={theme.accentColor}
                  onChange={(v) => set('accentColor', v)}
                />
                <ColorField
                  label="Primario"
                  value={theme.primaryColor}
                  onChange={(v) => set('primaryColor', v)}
                />
                <ColorField
                  label="Secondario"
                  value={theme.secondaryColor}
                  onChange={(v) => set('secondaryColor', v)}
                />
              </div>
            )}

            {/* Typography */}
            {tab === 'typography' && (
              <div className="space-y-5">
                <div>
                  <label className="field-label">Font Display (titoli)</label>
                  <div className="space-y-1.5">
                    {DISPLAY_FONTS.map((f) => (
                      <button
                        key={f}
                        onClick={() => set('fontDisplay', f)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                          theme.fontDisplay === f
                            ? 'border-[--color-accent]/50 bg-[--color-accent]/8'
                            : 'border-[--color-text]/10 hover:bg-[--color-text]/4'
                        }`}
                      >
                        <span className="text-sm text-[--color-text]" style={{ fontFamily: f }}>
                          {f}
                        </span>
                        <span className="text-[--color-text]/30 text-xs" style={{ fontFamily: f }}>
                          Aa Bb Cc
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="field-label">Font Body (testo)</label>
                  <div className="space-y-1.5">
                    {BODY_FONTS.map((f) => (
                      <button
                        key={f}
                        onClick={() => set('fontBody', f)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                          theme.fontBody === f
                            ? 'border-[--color-accent]/50 bg-[--color-accent]/8'
                            : 'border-[--color-text]/10 hover:bg-[--color-text]/4'
                        }`}
                      >
                        <span className="text-sm text-[--color-text]" style={{ fontFamily: f }}>
                          {f}
                        </span>
                        <span className="text-[--color-text]/30 text-xs" style={{ fontFamily: f }}>
                          Il testo del corpo
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom CSS */}
            {tab === 'css' && (
              <div>
                <p className="text-[--color-text]/40 mb-3 text-xs">
                  CSS aggiuntivo applicato al sito pubblico. Usa variabili come{' '}
                  <code className="bg-[--color-text]/8 text-[--color-text]/70 rounded px-1">
                    var(--color-accent)
                  </code>
                  .
                </p>
                <textarea
                  value={theme.customCss ?? ''}
                  onChange={(e) => set('customCss', e.target.value)}
                  placeholder={`/* Es. */\n.ph-container { max-width: 1400px; }\nh1 { letter-spacing: -0.03em; }`}
                  rows={18}
                  className="field-base font-mono text-xs"
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-[--color-text]/3 flex flex-1 flex-col overflow-y-auto p-6">
          <p className="text-[--color-text]/30 mb-4 text-xs font-medium uppercase tracking-wider">
            Anteprima live
          </p>
          <LivePreview theme={theme} />

          {/* Token summary */}
          <div className="border-[--color-text]/8 mt-6 rounded-xl border bg-[--color-sidebar] p-4">
            <p className="text-[--color-text]/30 mb-3 text-xs font-medium uppercase tracking-wider">
              CSS Variables
            </p>
            <div className="text-[--color-text]/60 space-y-1 font-mono text-xs">
              {[
                ['--color-bg', theme.bgColor],
                ['--color-text', theme.textColor],
                ['--color-accent', theme.accentColor],
                ['--color-primary', theme.primaryColor],
                ['--font-display', theme.fontDisplay],
                ['--font-body', theme.fontBody],
              ].map(([k, v]) => (
                <div key={k ?? ''} className="flex items-center gap-2">
                  <span className="text-[--color-text]/40">{k}:</span>
                  <span>{v};</span>
                  {k?.startsWith('--color') && (
                    <div
                      className="border-[--color-text]/10 h-3 w-3 rounded-full border"
                      style={{ backgroundColor: v }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
