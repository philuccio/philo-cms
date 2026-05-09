interface Props {
  params: Promise<{ slug: string }>
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  return (
    <main>
      <section className="ph-section">
        <div className="ph-container-narrow">
          <p className="text-sm opacity-50">Case: {slug}</p>
        </div>
      </section>
    </main>
  )
}
