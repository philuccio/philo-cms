'use client'

import { IconTrash, IconPlus } from '@tabler/icons-react'
import type { StatsBlockContent } from '@philo/types'

interface Props {
  content: StatsBlockContent
  onChange: (c: StatsBlockContent) => void
}

export function StatsEditor({ content, onChange }: Props) {
  const updateItem = (i: number, field: 'value' | 'label' | 'suffix', val: string) => {
    const items = content.items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item))
    onChange({ ...content, items })
  }

  const addItem = () =>
    onChange({ ...content, items: [...content.items, { value: '0', label: 'Nuova metrica' }] })

  const removeItem = (i: number) =>
    onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      {content.items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="grid flex-1 grid-cols-3 gap-2">
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Valore</span>
              <input
                value={item.value}
                onChange={(e) => updateItem(i, 'value', e.target.value)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                placeholder="100"
              />
            </label>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Suffisso</span>
              <input
                value={item.suffix ?? ''}
                onChange={(e) => updateItem(i, 'suffix', e.target.value)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                placeholder="%"
              />
            </label>
            <label className="block">
              <span className="text-[--color-text]/50 mb-1 block text-xs">Etichetta</span>
              <input
                value={item.label}
                onChange={(e) => updateItem(i, 'label', e.target.value)}
                className="border-[--color-text]/15 w-full rounded border bg-[--color-bg] px-3 py-2 text-sm text-[--color-text]"
                placeholder="Clienti soddisfatti"
              />
            </label>
          </div>
          <button
            onClick={() => removeItem(i)}
            className="text-[--color-text]/30 mt-6 p-2 hover:text-red-400"
            aria-label="Rimuovi"
          >
            <IconTrash size={16} />
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="mt-2 flex items-center gap-2 text-sm text-[--color-accent] hover:opacity-80"
      >
        <IconPlus size={15} /> Aggiungi metrica
      </button>
    </div>
  )
}
