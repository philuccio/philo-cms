'use client'

import { useEffect, useRef, useState } from 'react'

interface KpiCounterProps {
  value: string
  label: string
  delta?: string | null
  unit?: string | null
}

function parseNumeric(value: string): { prefix: string; number: number; suffix: string } {
  const match = value.match(/^([^0-9-]*)(-?[\d.,]+)(.*)$/)
  if (!match) return { prefix: '', number: 0, suffix: value }
  return {
    prefix: match[1] ?? '',
    number: parseFloat((match[2] ?? '0').replace(',', '.')),
    suffix: match[3] ?? '',
  }
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function KpiCounter({ value, label, delta, unit }: KpiCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState('0')
  const [visible, setVisible] = useState(false)
  const animated = useRef(false)

  const { prefix, number, suffix } = parseNumeric(value)
  const isNumeric = !isNaN(number) && value !== suffix

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !animated.current) {
          animated.current = true
          setVisible(true)
          if (!isNumeric) {
            setDisplayed(value)
            return
          }
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = easeOutExpo(progress)
            const current = number * eased
            const formatted = number % 1 === 0 ? Math.round(current).toString() : current.toFixed(1)
            setDisplayed(prefix + formatted + suffix)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isNumeric, number, prefix, suffix, value])

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          color: 'var(--color-accent)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {isNumeric ? displayed : value}
      </div>
      {unit && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
            marginTop: '0.375rem',
          }}
        >
          {unit}
        </div>
      )}
      <div
        style={{
          fontSize: '0.9375rem',
          color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
          marginTop: '0.5rem',
        }}
      >
        {label}
      </div>
      {delta && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: delta.startsWith('+') ? '#22c55e' : '#ef4444',
            marginTop: '0.25rem',
          }}
        >
          {delta}
        </div>
      )}
    </div>
  )
}
