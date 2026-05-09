interface Props {
  params: Promise<{ slug: string }>
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  return (
    <main>
      <section className="ph-section">
        <div className="ph-container">
          <p className="text-sm opacity-50">Servizio: {slug}</p>
        </div>
      </section>
    </main>
  )
}
