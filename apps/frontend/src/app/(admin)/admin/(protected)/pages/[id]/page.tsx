interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminPageEditor({ params }: Props) {
  const { id } = await params
  return (
    <div className="p-8">
      <h1 className="ph-heading-md">Editor Pagina — {id}</h1>
    </div>
  )
}
