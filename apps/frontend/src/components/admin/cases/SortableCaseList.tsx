'use client'

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
import { IconGripVertical, IconEdit, IconTrash, IconEye, IconEyeOff } from '@tabler/icons-react'

interface CaseItem {
  id: string
  title: string
  slug: string
  status: string
  coverId: string | null
  kpis: { id: string }[]
}

interface SortableRowProps {
  item: CaseItem
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function SortableRow({ item, onEdit, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
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
      className="border-[--color-text]/12 flex items-center gap-3 rounded-lg border bg-[--color-sidebar] px-4 py-3 shadow-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-[--color-text]/20 hover:text-[--color-text]/50 cursor-grab touch-none"
      >
        <IconGripVertical size={16} />
      </button>

      {item.coverId ? (
        <img
          src={item.coverId}
          alt={item.title}
          className="h-10 w-16 flex-shrink-0 rounded object-cover"
        />
      ) : (
        <div className="bg-[--color-text]/5 text-[--color-text]/30 flex h-10 w-16 flex-shrink-0 items-center justify-center rounded text-[10px]">
          No img
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[--color-text]">{item.title}</p>
        <p className="text-[--color-text]/40 truncate text-xs">/{item.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[--color-text]/40 text-xs">{item.kpis.length} KPI</span>

        <span
          className={`rounded px-2 py-0.5 text-[10px] font-medium ${
            item.status === 'PUBLISHED'
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-[--color-text]/8 text-[--color-text]/50'
          }`}
        >
          {item.status === 'PUBLISHED' ? (
            <span className="flex items-center gap-1">
              <IconEye size={10} />
              Pubblicato
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <IconEyeOff size={10} />
              Bozza
            </span>
          )}
        </span>

        <button
          onClick={() => onEdit(item.id)}
          className="text-[--color-text]/40 hover:bg-[--color-text]/8 flex h-7 w-7 items-center justify-center rounded transition-colors hover:text-[--color-text]"
        >
          <IconEdit size={15} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-[--color-text]/30 flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <IconTrash size={15} />
        </button>
      </div>
    </div>
  )
}

interface SortableCaseListProps {
  items: CaseItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function SortableCaseList({ items, onEdit, onDelete, onReorder }: SortableCaseListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    onReorder(reordered.map((i) => i.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
