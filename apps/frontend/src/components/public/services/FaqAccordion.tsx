'use client'

import { useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            style={{
              borderBottom: '1px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                padding: '1.375rem 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: isOpen ? 'var(--color-accent)' : 'var(--color-text)',
                  transition: 'color 0.2s',
                  lineHeight: 1.4,
                }}
              >
                {item.question}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  border: '1.5px solid color-mix(in srgb, var(--color-text) 20%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isOpen
                    ? 'var(--color-accent)'
                    : 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                  fontSize: '1rem',
                  fontWeight: 300,
                  transition: 'transform 0.2s, color 0.2s',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              >
                +
              </span>
            </button>

            <div
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? '600px' : '0',
                transition: 'max-height 0.3s ease',
              }}
            >
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
                  lineHeight: 1.8,
                  paddingBottom: '1.375rem',
                  maxWidth: '70ch',
                }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
