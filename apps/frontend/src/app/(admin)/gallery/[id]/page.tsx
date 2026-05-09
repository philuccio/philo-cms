interface Props { params: Promise<{ id: string }> }

export default async function AdminProjectEditor({ params }: Props) {
  const { id } = await params
  return <div className="p-8"><h1 className="ph-heading-md">Progetto — {id}</h1></div>
}
