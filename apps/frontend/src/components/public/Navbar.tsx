'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { NavItem } from '@/app/actions/site-config'

interface NavbarProps {
  logoUrl: string | null
  siteName: string
  nav: NavItem[]
}

export function Navbar({ logoUrl, siteName, nav }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.3s, backdrop-filter 0.3s',
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--color-bg) 90%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled
          ? '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)'
          : '1px solid transparent',
      }}
    >
      <div className="ph-container flex items-center justify-between" style={{ height: '4.5rem' }}>
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3" aria-label="Homepage">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {siteName}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        {nav.length > 0 && (
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigazione principale">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href as never}
                target={item.target ?? '_self'}
                style={{
                  color: 'color-mix(in srgb, var(--color-text) 70%, transparent)',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                  fontWeight: 500,
                }}
                className="hover:opacity-100"
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-text)')}
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    'color-mix(in srgb, var(--color-text) 70%, transparent)')
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile menu toggle */}
        {nav.length > 0 && (
          <button
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuOpen}
          >
            <span
              style={{
                display: 'block',
                width: '1.25rem',
                height: '1px',
                backgroundColor: 'var(--color-text)',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '1.25rem',
                height: '1px',
                backgroundColor: 'var(--color-text)',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '1.25rem',
                height: '1px',
                backgroundColor: 'var(--color-text)',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && nav.length > 0 && (
        <nav
          style={{
            backgroundColor: 'var(--color-bg)',
            borderTop: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
            padding: '1.5rem',
          }}
          aria-label="Menu mobile"
        >
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href as never}
                target={item.target ?? '_self'}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'var(--color-text)',
                  fontSize: '1.125rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
