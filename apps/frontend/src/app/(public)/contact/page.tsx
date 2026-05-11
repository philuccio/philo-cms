import type { Metadata } from 'next'
import { ContactForm } from '@/components/public/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Scrivici per qualsiasi informazione o per iniziare un progetto insieme.',
}

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <div
        style={{
          paddingTop: '5rem',
          paddingBottom: '4rem',
          borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
        }}
      >
        <div className="ph-container">
          <p
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
            }}
          >
            Contatti
          </p>
          <h1 className="ph-heading-lg" style={{ maxWidth: '20ch', marginBottom: '1.25rem' }}>
            Parliamo del tuo progetto
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
              lineHeight: 1.7,
              maxWidth: '52ch',
            }}
          >
            Hai un progetto in mente o vuoi semplicemente saperne di più? Scrivici e ti risponderemo
            il prima possibile.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="ph-container" style={{ paddingBlock: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)',
            gap: '6rem',
            alignItems: 'start',
          }}
        >
          {/* Left: contact info */}
          <div>
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '2rem',
              }}
            >
              Informazioni
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Email
                </p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                  info@example.com
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Telefono
                </p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                  +39 000 000 0000
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Sede
                </p>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-text)',
                    lineHeight: 1.7,
                  }}
                >
                  Via Example 1<br />
                  Milano, Italy
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
