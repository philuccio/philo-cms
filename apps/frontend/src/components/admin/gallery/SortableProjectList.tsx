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
import { IconGripVertical, IconTrash, IconEdit } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

interface ProjectItem {
  id: string
  title: string
  slug: string
  status: string
  depth: string
  category: { name: string; color: string } | null
  media: { media: { url: string; alt: string | null } }[]
}

interface ItemProps {
  project: ProjectItem
  isPending: boolean
  onDelete: (id: string) => void
}

function SortableProjectItem({ project, isPending, onDelete }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })

  const coverUrl = project.media[0]?.media.url
  const statusColor =
    project.status === 'PUBLISHED'
      ? 'bg-emerald-500/15 text-emerald-400'
      : project.status === 'REVIEW'
        ? 'bg-amber-500/15 text-amber-400'
        : 'bg-[--color-text]/10 text-[--color-text]/40'

  const statusLabel =
    project.status === 'PUBLISHED'
      ? 'Pubblicato'
      : project.status === 'REVIEW'
        ? 'In revisione'
        : 'Bozza'

  const depthLabel =
    project.depth === 'THUMBNAIL'
      ? 'Thumbnail'
      : project.depth === 'CARD'
        ? 'Card'
        : 'Pagina completa'

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="border-[--color-text]/8 hover:border-[--color-text]/15 group flex items-center gap-3 rounded-lg border bg-[--color-bg] px-4 py-3 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-[--color-text]/20 hover:text-[--color-text]/50 shrink-0 cursor-grab touch-none active:cursor-grabbing"
        aria-label="Trascina"
      >
        <IconGripVertical size={16} />
      </button>

      <div className="bg-[--color-text]/5 h-12 w-12 shrink-0 overflow-hidden rounded">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={project.title}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-[--color-text]/15 flex h-full w-full items-center justify-center text-xs">
            —
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[--color-text]">{project.title}</p>
        <p className="text-[--color-text]/35 mt-0.5 text-xs">/{project.slug}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {project.category && (
          <span
            className="rounded-full px-2 py-0.5 text-xs"
            style={{ background: project.category.color + '22', color: project.category.color }}
          >
            {project.category.name}
          </span>
        )}
        <span className="text-[--color-text]/30 text-xs">{depthLabel}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor}`}>{statusLabel}</span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/admin/gallery/${project.id}` as Route}
            className="text-[--color-text]/30 hover:text-[--color-text]/70 rounded p-1.5"
            aria-label="Modifica"
          >
            <IconEdit size={15} />
          </Link>
          <button
            onClick={() => onDelete(project.id)}
            disabled={isPending}
            className="text-[--color-text]/30 rounded p-1.5 hover:text-red-400 disabled:opacity-40"
            aria-label="Elimina"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  projects: ProjectItem[]
  isPending: boolean
  onDelete: (id: string) => void
  onReorder: (ids: string[]) => void
}

export function SortableProjectList({ projects, isPending, onDelete, onReorder }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    onReorder(arrayMove(projects, oldIndex, newIndex).map((p) => p.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {projects.map((project) => (
            <SortableProjectItem
              key={project.id}
              project={project}
              isPending={isPending}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
