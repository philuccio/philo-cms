import type { Metadata } from 'next'
import { NewPageForm } from '@/components/admin/pages/NewPageForm'

export const metadata: Metadata = { title: 'Nuova pagina' }

export default function NewPagePage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-[--color-text]">
        Nuova pagina
      </h1>
      <NewPageForm />
    </div>
  )
}
