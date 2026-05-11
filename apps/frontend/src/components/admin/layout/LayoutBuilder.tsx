'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SiteConfigData, NavItem, FooterColumn } from '@/app/actions/layout'
import { saveSiteConfig } from '@/app/actions/layout'

type Tab = 'siteinfo' | 'nav' | 'footer' | 'seo'

// ─── Sortable nav row ────────────────────────────────────────────────────────

function SortableNavRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: NavItem
  onUpdate: (id: string, field: keyof NavItem, value: string) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded bg-[--color-sidebar] p-2"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab px-1 text-[--color-text] opacity-40 hover:opacity-80"
      >
        ⠿
      </button>
      <input
        value={item.label}
        onChange={(e) => onUpdate(item.id, 'label', e.target.value)}
        placeholder="Label"
        className="field-base flex-1 text-sm"
      />
      <input
        value={item.href}
        onChange={(e) => onUpdate(item.id, 'href', e.target.value)}
        placeholder="/pagina"
        className="field-base flex-1 text-sm"
      />
      <select
        value={item.target ?? '_self'}
        onChange={(e) => onUpdate(item.id, 'target', e.target.value)}
        className="field-base w-24 text-sm"
      >
        <option value="_self">Stesso tab</option>
        <option value="_blank">Nuovo tab</option>
      </select>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="px-1 text-sm text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  )
}

// ─── Footer column editor ────────────────────────────────────────────────────

function FooterColumnEditor({
  col,
  onUpdate,
  onRemove,
}: {
  col: FooterColumn
  onUpdate: (col: FooterColumn) => void
  onRemove: (id: string) => void
}) {
  function addLink() {
    onUpdate({
      ...col,
      links: [...col.links, { id: crypto.randomUUID(), label: '', href: '' }],
    })
  }

  function updateLink(linkId: string, field: 'label' | 'href', value: string) {
    onUpdate({
      ...col,
      links: col.links.map((l) => (l.id === linkId ? { ...l, [field]: value } : l)),
    })
  }

  function removeLink(linkId: string) {
    onUpdate({ ...col, links: col.links.filter((l) => l.id !== linkId) })
  }

  return (
    <div className="space-y-2 rounded border border-[--color-sidebar] p-3">
      <div className="flex items-center gap-2">
        <input
          value={col.title}
          onChange={(e) => onUpdate({ ...col, title: e.target.value })}
          placeholder="Titolo colonna"
          className="field-base flex-1 text-sm font-semibold"
        />
        <button
          type="button"
          onClick={() => onRemove(col.id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Rimuovi colonna
        </button>
      </div>
      <div className="space-y-1 pl-2">
        {col.links.map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <input
              value={link.label}
              onChange={(e) => updateLink(link.id, 'label', e.target.value)}
              placeholder="Label"
              className="field-base flex-1 text-sm"
            />
            <input
              value={link.href}
              onChange={(e) => updateLink(link.id, 'href', e.target.value)}
              placeholder="/href"
              className="field-base flex-1 text-sm"
            />
            <button
              type="button"
              onClick={() => removeLink(link.id)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="mt-1 text-xs text-[--color-accent] hover:underline"
        >
          + aggiungi link
        </button>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function LayoutBuilder({ initialConfig }: { initialConfig: SiteConfigData }) {
  const [tab, setTab] = useState<Tab>('siteinfo')
  const [config, setConfig] = useState<SiteConfigData>(initialConfig)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // ── Site Info helpers ──────────────────────────────────────────────────────
  function setSiteField<K extends 'logoUrl' | 'faviconUrl'>(field: K, value: string) {
    setConfig((c) => ({ ...c, [field]: value || null }))
  }

  // ── Nav helpers ────────────────────────────────────────────────────────────
  function addNavItem() {
    setConfig((c) => ({
      ...c,
      nav: [...c.nav, { id: crypto.randomUUID(), label: '', href: '/' }],
    }))
  }

  function updateNavItem(id: string, field: keyof NavItem, value: string) {
    setConfig((c) => ({
      ...c,
      nav: c.nav.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  function removeNavItem(id: string) {
    setConfig((c) => ({ ...c, nav: c.nav.filter((item) => item.id !== id) }))
  }

  function handleNavDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setConfig((c) => {
      const oldIdx = c.nav.findIndex((i) => i.id === active.id)
      const newIdx = c.nav.findIndex((i) => i.id === over.id)
      return { ...c, nav: arrayMove(c.nav, oldIdx, newIdx) }
    })
  }

  // ── Footer helpers ─────────────────────────────────────────────────────────
  function addFooterColumn() {
    setConfig((c) => ({
      ...c,
      footer: {
        ...c.footer,
        columns: [...c.footer.columns, { id: crypto.randomUUID(), title: '', links: [] }],
      },
    }))
  }

  function updateFooterColumn(col: FooterColumn) {
    setConfig((c) => ({
      ...c,
      footer: {
        ...c.footer,
        columns: c.footer.columns.map((existing) => (existing.id === col.id ? col : existing)),
      },
    }))
  }

  function removeFooterColumn(id: string) {
    setConfig((c) => ({
      ...c,
      footer: { ...c.footer, columns: c.footer.columns.filter((col) => col.id !== id) },
    }))
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  function handleSave() {
    startTransition(async () => {
      await saveSiteConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'siteinfo', label: 'Sito' },
    { key: 'nav', label: 'Navigazione' },
    { key: 'footer', label: 'Footer' },
    { key: 'seo', label: 'SEO' },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[--color-sidebar] px-8 py-5">
        <h1 className="ph-heading-md">Layout & Impostazioni</h1>
        <button onClick={handleSave} disabled={isPending} className="btn-primary px-5 py-2 text-sm">
          {saved ? '✓ Salvato' : isPending ? 'Salvataggio…' : 'Salva'}
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{ borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
        className="flex gap-1 border-b px-8 pt-4"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={
              tab === t.key
                ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                : { color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }
            }
            className="rounded-t px-4 py-2 text-sm transition-colors"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* ── SITO ─────────────────────────────────────────────────────── */}
        {tab === 'siteinfo' && (
          <div className="max-w-xl space-y-6">
            <div className="space-y-1">
              <label className="field-label">URL Logo</label>
              <input
                value={config.logoUrl ?? ''}
                onChange={(e) => setSiteField('logoUrl', e.target.value)}
                placeholder="https://... oppure /logo.svg"
                className="field-base w-full"
              />
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Logo preview"
                  className="mt-2 h-10 rounded border border-[--color-sidebar] object-contain p-1"
                />
              )}
            </div>
            <div className="space-y-1">
              <label className="field-label">URL Favicon</label>
              <input
                value={config.faviconUrl ?? ''}
                onChange={(e) => setSiteField('faviconUrl', e.target.value)}
                placeholder="https://... oppure /favicon.ico"
                className="field-base w-full"
              />
            </div>
          </div>
        )}

        {/* ── NAVIGAZIONE ───────────────────────────────────────────────── */}
        {tab === 'nav' && (
          <div className="max-w-2xl space-y-4">
            <p className="text-sm text-[--color-text] opacity-60">
              Definisci le voci del menu principale. Trascina per riordinare.
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleNavDragEnd}
            >
              <SortableContext
                items={config.nav.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {config.nav.map((item) => (
                    <SortableNavRow
                      key={item.id}
                      item={item}
                      onUpdate={updateNavItem}
                      onRemove={removeNavItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {config.nav.length === 0 && (
              <p className="py-4 text-center text-sm text-[--color-text] opacity-40">
                Nessuna voce. Aggiungine una.
              </p>
            )}

            <button onClick={addNavItem} className="btn-secondary px-4 py-2 text-sm">
              + Aggiungi voce
            </button>
          </div>
        )}

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        {tab === 'footer' && (
          <div className="max-w-2xl space-y-6">
            <div className="space-y-1">
              <label className="field-label">Copyright</label>
              <input
                value={config.footer.copyright}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, footer: { ...c.footer, copyright: e.target.value } }))
                }
                placeholder="© 2025 Nome Studio"
                className="field-base w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showSocial"
                checked={config.footer.showSocial}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    footer: { ...c.footer, showSocial: e.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              <label htmlFor="showSocial" className="field-label mb-0">
                Mostra icone social
              </label>
            </div>

            {config.footer.showSocial && (
              <div className="grid grid-cols-2 gap-3">
                {(['instagram', 'linkedin', 'behance', 'dribbble'] as const).map((s) => (
                  <div key={s} className="space-y-1">
                    <label className="field-label capitalize">{s}</label>
                    <input
                      value={config.footer.social?.[s] ?? ''}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          footer: {
                            ...c.footer,
                            social: { ...c.footer.social, [s]: e.target.value },
                          },
                        }))
                      }
                      placeholder={`https://${s}.com/...`}
                      className="field-base w-full text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[--color-text]">Colonne footer</h3>
                <button onClick={addFooterColumn} className="btn-secondary px-3 py-1 text-xs">
                  + Colonna
                </button>
              </div>
              <div className="space-y-3">
                {config.footer.columns.map((col) => (
                  <FooterColumnEditor
                    key={col.id}
                    col={col}
                    onUpdate={updateFooterColumn}
                    onRemove={removeFooterColumn}
                  />
                ))}
                {config.footer.columns.length === 0 && (
                  <p className="py-4 text-center text-sm text-[--color-text] opacity-40">
                    Nessuna colonna nel footer.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SEO ───────────────────────────────────────────────────────── */}
        {tab === 'seo' && (
          <div className="max-w-xl space-y-5">
            <p className="text-sm text-[--color-text] opacity-60">
              Valori di default SEO per le pagine che non hanno metadati propri.
            </p>
            <div className="space-y-1">
              <label className="field-label">Titolo SEO di default</label>
              <input
                value={config.seoTitle ?? ''}
                onChange={(e) => setConfig((c) => ({ ...c, seoTitle: e.target.value || null }))}
                placeholder="Studio · Sito"
                className="field-base w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="field-label">Descrizione SEO di default</label>
              <textarea
                value={config.seoDesc ?? ''}
                onChange={(e) => setConfig((c) => ({ ...c, seoDesc: e.target.value || null }))}
                placeholder="Descrizione breve del sito…"
                rows={3}
                className="field-base w-full resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="field-label">OG Image di default</label>
              <input
                value={config.seoOgImage ?? ''}
                onChange={(e) => setConfig((c) => ({ ...c, seoOgImage: e.target.value || null }))}
                placeholder="https://... oppure /og-image.jpg"
                className="field-base w-full"
              />
              {config.seoOgImage && (
                <img
                  src={config.seoOgImage}
                  alt="OG Image preview"
                  className="mt-2 w-48 rounded border border-[--color-sidebar] object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
