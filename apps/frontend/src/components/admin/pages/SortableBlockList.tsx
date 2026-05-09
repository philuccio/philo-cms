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
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import type { LayoutBlock } from '@prisma/client'
import type { BlockType } from '@philo/types'

const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero',
  text: 'Testo',
  image: 'Immagine',
  quote: 'Citazione',
  stats: 'Statistiche',
  cta: 'CTA',
  map: 'Mappa',
}

interface ItemProps {
  block: LayoutBlock
  isSelected: boolean
  isPending: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

function SortableBlockItem({ block, isSelected, isPending, onSelect, onDelete }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(block.id)}
      className={`group flex cursor-pointer items-center gap-1.5 rounded px-2 py-2 text-sm transition-colors ${
        isSelected
          ? 'bg-[--color-accent]/15 text-[--color-accent]'
          : 'hover:bg-[--color-text]/5 text-[--color-text]/70'
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="text-[--color-text]/20 hover:text-[--color-text]/50 shrink-0 cursor-grab touch-none active:cursor-grabbing"
        aria-label="Trascina"
      >
        <IconGripVertical size={14} />
      </button>

      <span className="flex-1 truncate text-xs font-medium">
        {BLOCK_LABELS[block.type as BlockType]}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(block.id)
        }}
        disabled={isPending}
        className="shrink-0 p-0.5 opacity-0 transition-opacity hover:text-red-400 disabled:opacity-20 group-hover:opacity-100"
        aria-label="Elimina"
      >
        <IconTrash size={12} />
      </button>
    </div>
  )
}

interface Props {
  blocks: LayoutBlock[]
  selectedId: string | null
  isPending: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function SortableBlockList({
  blocks,
  selectedId,
  isPending,
  onSelect,
  onDelete,
  onReorder,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    const reordered = arrayMove(blocks, oldIndex, newIndex)
    onReorder(reordered.map((b) => b.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0.5">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              isSelected={selectedId === block.id}
              isPending={isPending}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
