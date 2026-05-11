import Link from 'next/link'
import type { FooterConfig } from '@/app/actions/site-config'

interface FooterProps {
  logoUrl: string | null
  siteName: string
  footer: FooterConfig
}

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    instagram:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    linkedin:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    behance:
      'M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.726zm-7.726-3h3.427c-.123-1.979-1.similaritiesAll-2.577-1.661-2.577-1.104 0-1.658.74-1.766 2.577zm-7-6h-3v13h3v-5.164l4 5.164h4l-4.5-5.836 4-7.164h-3.5l-3 5.836v-5.836z',
    dribbble:
      'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.39 1.68 1.31 3.804 2.098 6.11 2.098 1.44 0 2.808-.304 4.043-.832zm-8.37-2.58c.24-.405 3.114-5.208 8.427-6.886.138-.045.28-.09.42-.128-.27-.615-.57-1.228-.885-1.83C10.12 11.865 4.976 11.825 4.488 11.815l-.012.2c0 2.28.87 4.35 2.287 5.91zm-.64-7.44c.515.014 4.964.038 8.928-1.19-1.596-2.838-3.312-5.22-3.576-5.584-2.64 1.244-4.65 3.496-5.352 6.774zM17.16 3.275c.252.352 2.01 2.748 3.57 5.668 3.398-1.274 4.83-3.205 5.004-3.46C24.1 3.907 21.217 2.316 18 2.316c-.285 0-.565.02-.84.06z',
  }
  return icons[name] ? (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden>
      <path d={icons[name]} />
    </svg>
  ) : null
}

export function Footer({ logoUrl, siteName, footer }: FooterProps) {
  const hasSocial =
    footer.showSocial && footer.social && Object.values(footer.social).some((v) => v && v.trim())

  return (
    <footer
      style={{
        borderTop: '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
        paddingBlock: '4rem 2rem',
        marginTop: '6rem',
      }}
    >
      <div className="ph-container">
        {/* Top row: logo + colonne */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: footer.columns.length > 0 ? '1fr auto' : '1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="mb-4 h-8 w-auto object-contain" />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-text)',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                {siteName}
              </span>
            )}

            {/* Social */}
            {hasSocial && (
              <div className="mt-4 flex items-center gap-3">
                {Object.entries(footer.social ?? {}).map(([platform, url]) =>
                  url ? (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="ph-hover-accent-text"
                      style={{
                        color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                      }}
                    >
                      <SocialIcon name={platform} />
                    </a>
                  ) : null,
                )}
              </div>
            )}
          </div>

          {/* Link columns */}
          {footer.columns.length > 0 && (
            <div className="flex gap-12">
              {footer.columns.map((col) => (
                <div key={col.id}>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase' as const,
                      color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                      marginBottom: '1rem',
                    }}
                  >
                    {col.title}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.href as never}
                          className="ph-hover-text"
                          style={{
                            fontSize: '0.875rem',
                            color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: copyright */}
        <div
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
            paddingTop: '1.5rem',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: 'color-mix(in srgb, var(--color-text) 35%, transparent)',
            }}
          >
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
