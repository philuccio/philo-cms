interface Props { params: Promise<{ id: string }> }

export default async function AdminServiceEditor({ params }: Props) {
  const { id } = await params
  return <div className="p-8"><h1 className="ph-heading-md">Servizio — {id}</h1></div>
}
