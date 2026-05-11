'use client'

import { useState } from 'react'
import { IconPlus, IconTrash, IconGripVertical } from '@tabler/icons-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { KPIInput } from '@/app/actions/cases'

interface KpiRowProps {
  kpi: KPIInput & { _key: string }
  onChange: (key: string, field: keyof KPIInput, value: string) => void
  onDelete: (key: string) => void
}

function KpiRow({ kpi, onChange, onDelete }: KpiRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: kpi._key,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-[--color-text]/8 grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 rounded-lg border bg-[--color-bg] p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-[--color-text]/20 hover:text-[--color-text]/50 cursor-grab touch-none self-center"
      >
        <IconGripVertical size={14} />
      </button>

      <input
        value={kpi.label}
        onChange={(e) => onChange(kpi._key, 'label', e.target.value)}
        placeholder="Label (es. Traffico)"
        className="field-base"
      />
      <input
        value={kpi.value}
        onChange={(e) => onChange(kpi._key, 'value', e.target.value)}
        placeholder="Valore (es. +300%)"
        className="field-base"
      />
      <input
        value={kpi.delta ?? ''}
        onChange={(e) => onChange(kpi._key, 'delta', e.target.value)}
        placeholder="Delta (es. vs anno prec.)"
        className="field-base"
      />
      <input
        value={kpi.unit ?? ''}
        onChange={(e) => onChange(kpi._key, 'unit', e.target.value)}
        placeholder="Unità (es. sessioni/mese)"
        className="field-base"
      />

      <button
        onClick={() => onDelete(kpi._key)}
        className="text-[--color-text]/30 flex h-7 w-7 items-center justify-center self-center rounded transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <IconTrash size={14} />
      </button>
    </div>
  )
}

interface KpiBuilderProps {
  initialKpis: KPIInput[]
  onChange: (kpis: KPIInput[]) => void
}

export function KpiBuilder({ initialKpis, onChange }: KpiBuilderProps) {
  const [rows, setRows] = useState<(KPIInput & { _key: string })[]>(() =>
    initialKpis.map((k, i) => ({ ...k, _key: k.id ?? `new-${i}` })),
  )

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function emit(next: (KPIInput & { _key: string })[]) {
    setRows(next)
    onChange(next.map(({ _key, ...rest }, i) => ({ ...rest, order: i })))
  }

  function addRow() {
    const key = `new-${Date.now()}`
    emit([...rows, { _key: key, label: '', value: '', delta: '', unit: '', order: rows.length }])
  }

  function updateRow(key: string, field: keyof KPIInput, value: string) {
    emit(rows.map((r) => (r._key === key ? { ...r, [field]: value } : r)))
  }

  function deleteRow(key: string) {
    emit(rows.filter((r) => r._key !== key))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = rows.findIndex((r) => r._key === active.id)
    const newIndex = rows.findIndex((r) => r._key === over.id)
    emit(arrayMove(rows, oldIndex, newIndex))
  }

  return (
    <div className="space-y-3">
      {rows.length > 0 && (
        <div className="text-[--color-text]/30 mb-1 grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 px-3 text-[10px] font-medium uppercase tracking-wider">
          <span />
          <span>Label</span>
          <span>Valore</span>
          <span>Delta</span>
          <span>Unità</span>
          <span />
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((r) => r._key)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {rows.map((r) => (
              <KpiRow key={r._key} kpi={r} onChange={updateRow} onDelete={deleteRow} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={addRow}
        className="border-[--color-text]/15 text-[--color-text]/50 hover:border-[--color-accent]/50 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-sm transition-colors hover:text-[--color-accent]"
      >
        <IconPlus size={15} />
        Aggiungi KPI
      </button>
    </div>
  )
}
