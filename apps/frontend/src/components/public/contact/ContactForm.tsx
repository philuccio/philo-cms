'use client'

import { useState, useTransition } from 'react'
import { sendContactEmail } from '@/app/actions/contact'

type Field = 'name' | 'email' | 'subject' | 'message'

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

function validateClient(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) errors.name = 'Campo obbligatorio'
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email non valida'
  if (!message.trim() || message.trim().length < 10) errors.message = 'Minimo 10 caratteri'
  return errors
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid color-mix(in srgb, var(--color-text) 15%, transparent)',
  background: 'color-mix(in srgb, var(--color-text) 4%, transparent)',
  color: 'var(--color-text)',
  fontSize: '0.9375rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'var(--font-body)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
  marginBottom: '0.5rem',
}

const errorStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#e05252',
  marginTop: '0.375rem',
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleBlur(field: Field) {
    const errors = validateClient(name, email, message)
    if (field in errors) {
      setFieldErrors((prev) => ({ ...prev, [field]: errors[field as keyof FieldErrors] }))
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateClient(name, email, message)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setServerError(null)
    startTransition(async () => {
      const result = await sendContactEmail({ name, email, subject, message })
      if (result.ok) {
        setSuccess(true)
      } else {
        setServerError(result.error ?? 'Errore imprevisto. Riprova.')
      }
    })
  }

  if (success) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          borderRadius: '0.75rem',
          border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--color-accent) 5%, transparent)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            marginInline: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          ✓
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          Messaggio inviato
        </h3>
        <p
          style={{
            color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
            lineHeight: 1.7,
          }}
        >
          Grazie per averci scritto. Ti risponderemo il prima possibile.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle} htmlFor="contact-name">
            Nome *
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            style={{
              ...inputStyle,
              borderColor: fieldErrors.name
                ? '#e05252'
                : 'color-mix(in srgb, var(--color-text) 15%, transparent)',
            }}
            placeholder="Mario Rossi"
            autoComplete="name"
          />
          {fieldErrors.name && <p style={errorStyle}>{fieldErrors.name}</p>}
        </div>

        <div>
          <label style={labelStyle} htmlFor="contact-email">
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            style={{
              ...inputStyle,
              borderColor: fieldErrors.email
                ? '#e05252'
                : 'color-mix(in srgb, var(--color-text) 15%, transparent)',
            }}
            placeholder="mario@example.com"
            autoComplete="email"
          />
          {fieldErrors.email && <p style={errorStyle}>{fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-subject">
          Oggetto
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={inputStyle}
          placeholder="Es. Richiesta preventivo"
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-message">
          Messaggio *
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => handleBlur('message')}
          rows={6}
          style={{
            ...inputStyle,
            resize: 'vertical',
            borderColor: fieldErrors.message
              ? '#e05252'
              : 'color-mix(in srgb, var(--color-text) 15%, transparent)',
          }}
          placeholder="Descrivi il tuo progetto o la tua richiesta..."
        />
        {fieldErrors.message && <p style={errorStyle}>{fieldErrors.message}</p>}
      </div>

      {serverError && (
        <p
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'color-mix(in srgb, #e05252 10%, transparent)',
            border: '1px solid color-mix(in srgb, #e05252 30%, transparent)',
            color: '#e05252',
            fontSize: '0.875rem',
          }}
        >
          {serverError}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '0.875rem 2.5rem',
            borderRadius: '0.375rem',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9375rem',
            border: 'none',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {isPending ? 'Invio in corso…' : 'Invia messaggio'}
        </button>
      </div>
    </form>
  )
}
