'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconEdit,
  IconTrash,
  IconGripVertical,
} from '@tabler/icons-react'
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
import {
  createService,
  deleteService,
  reorderServices,
  type ServiceNode,
  type ServiceLevel,
} from '@/app/actions/services'

const LEVEL_LABELS: Record<ServiceLevel, string> = {
  L1_CARD: 'Servizio',
  L2_PAGE: 'Sotto-servizio',
  L3_PACKAGE: 'Pacchetto',
}

const LEVEL_COLORS: Record<ServiceLevel, string> = {
  L1_CARD: '#6366f1',
  L2_PAGE: '#0ea5e9',
  L3_PACKAGE: '#10b981',
}

const CHILD_LEVEL: Partial<Record<ServiceLevel, ServiceLevel>> = {
  L1_CARD: 'L2_PAGE',
  L2_PAGE: 'L3_PACKAGE',
}

interface SortableRowProps {
  node: ServiceNode
  depth: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAddChild: (parentId: string, level: ServiceLevel) => void
  isPending: boolean
}

function SortableRow({ node, depth, onEdit, onDelete, onAddChild, isPending }: SortableRowProps) {
  const [expanded, setExpanded] = useState(true)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const childLevel = CHILD_LEVEL[node.level]
  const hasChildren = node.children.length > 0

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="border-[--color-text]/10 flex items-center gap-2 rounded-lg border bg-[--color-sidebar] px-3 py-2.5 shadow-sm"
        style={{ marginLeft: depth * 20 }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-[--color-text]/20 hover:text-[--color-text]/50 cursor-grab touch-none"
        >
          <IconGripVertical size={14} />
        </button>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-[--color-text]/30 flex h-5 w-5 shrink-0 items-center justify-center"
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
        >
          {expanded ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />}
        </button>

        {/* Level badge */}
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
          style={{ backgroundColor: LEVEL_COLORS[node.level] }}
        >
          {LEVEL_LABELS[node.level]}
        </span>

        {/* Icon */}
        {node.icon && <span className="text-[--color-text]/40 shrink-0 text-xs">{node.icon}</span>}

        {/* Title */}
        <span className="flex-1 truncate text-sm font-medium text-[--color-text]">
          {node.title}
        </span>

        {/* Status */}
        <span
          className={`shrink-0 text-[10px] ${node.status === 'PUBLISHED' ? 'text-emerald-600' : 'text-[--color-text]/30'}`}
        >
          {node.status === 'PUBLISHED' ? 'Pubblicato' : 'Bozza'}
        </span>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          {childLevel && (
            <button
              onClick={() => onAddChild(node.id, childLevel)}
              disabled={isPending}
              title={`Aggiungi ${LEVEL_LABELS[childLevel]}`}
              className="text-[--color-text]/30 hover:bg-[--color-text]/8 flex h-6 w-6 items-center justify-center rounded transition-colors hover:text-[--color-text]"
            >
              <IconPlus size={13} />
            </button>
          )}
          <button
            onClick={() => onEdit(node.id)}
            className="text-[--color-text]/30 hover:bg-[--color-text]/8 flex h-6 w-6 items-center justify-center rounded transition-colors hover:text-[--color-text]"
          >
            <IconEdit size={13} />
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="text-[--color-text]/30 flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <IconTrash size={13} />
          </button>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <ServiceLevel
          nodes={node.children}
          depth={depth + 1}
          parentId={node.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
          isPending={isPending}
        />
      )}
    </div>
  )
}

interface ServiceLevelProps {
  nodes: ServiceNode[]
  depth: number
  parentId: string | null
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAddChild: (parentId: string, level: ServiceLevel) => void
  isPending: boolean
}

function ServiceLevel({
  nodes,
  depth,
  parentId,
  onEdit,
  onDelete,
  onAddChild,
  isPending,
}: ServiceLevelProps) {
  const [items, setItems] = useState<ServiceNode[]>(nodes)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const [, startTransition] = useTransition()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)
    startTransition(async () => {
      try {
        await reorderServices(
          parentId,
          reordered.map((i) => i.id),
        )
      } catch {
        toast.error('Errore nel salvataggio ordine')
      }
    })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {items.map((node) => (
            <SortableRow
              key={node.id}
              node={node}
              depth={depth}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              isPending={isPending}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

interface ServiceTreeProps {
  initialTree: ServiceNode[]
}

export function ServiceTree({ initialTree }: ServiceTreeProps) {
  const router = useRouter()
  const [tree, setTree] = useState<ServiceNode[]>(initialTree)
  const [isPending, startTransition] = useTransition()

  function handleAddRoot() {
    startTransition(async () => {
      try {
        const svc = await createService({ title: 'Nuovo Servizio' }, 'L1_CARD')
        router.push(`/admin/services/${svc.id}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  function handleAddChild(parentId: string, level: ServiceLevel) {
    startTransition(async () => {
      try {
        const label = level === 'L2_PAGE' ? 'Nuovo Sotto-servizio' : 'Nuovo Pacchetto'
        const svc = await createService({ title: label }, level, parentId)
        router.push(`/admin/services/${svc.id}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Eliminare questo servizio e tutti i suoi figli?')) return
    startTransition(async () => {
      try {
        await deleteService(id)
        router.refresh()
        toast.success('Eliminato')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[--color-text]">Servizi</h1>
          <p className="text-[--color-text]/40 mt-0.5 text-sm">{tree.length} servizi principali</p>
        </div>
        <button onClick={handleAddRoot} disabled={isPending} className="btn-primary">
          <IconPlus size={16} />
          Nuovo servizio
        </button>
      </div>

      {/* Legend */}
      <div className="mb-4 flex items-center gap-4">
        {(Object.entries(LEVEL_LABELS) as [ServiceLevel, string][]).map(([level, label]) => (
          <div key={level} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
            <span className="text-[--color-text]/40 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {tree.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[--color-text]/50 font-medium">Nessun servizio</p>
          <p className="text-[--color-text]/30 mt-1 text-sm">Crea il primo servizio per iniziare</p>
          <button onClick={handleAddRoot} disabled={isPending} className="btn-primary mt-4">
            Crea servizio
          </button>
        </div>
      ) : (
        <ServiceLevel
          nodes={tree}
          depth={0}
          parentId={null}
          onEdit={(id) => router.push(`/admin/services/${id}`)}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          isPending={isPending}
        />
      )}

      <button
        onClick={handleAddRoot}
        disabled={isPending}
        title="Nuovo servizio"
        className="btn-fab"
      >
        <IconPlus size={22} />
      </button>
    </div>
  )
}
