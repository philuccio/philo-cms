'use server'

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface ContactResult {
  ok: boolean
  error?: string
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function sendContactEmail(data: ContactFormData): Promise<ContactResult> {
  const { name, email, subject, message } = data

  if (!name.trim()) return { ok: false, error: 'Il nome è obbligatorio.' }
  if (!email.trim() || !validateEmail(email)) return { ok: false, error: 'Email non valida.' }
  if (!message.trim() || message.trim().length < 10)
    return { ok: false, error: 'Il messaggio deve essere di almeno 10 caratteri.' }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? 'noreply@example.com'
  const to = process.env.EMAIL_TO ?? ''

  if (!to) return { ok: false, error: 'Configurazione email mancante. Riprova più tardi.' }

  const subjectLine = subject?.trim() ? subject.trim() : `Nuovo messaggio da ${name}`
  const html = `
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Oggetto:</strong> ${subjectLine}</p>
    <hr />
    <p style="white-space:pre-wrap">${message}</p>
  `

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject: subjectLine, html }),
      })
      if (!res.ok) {
        const body = await res.text()
        console.error('[contact] Resend error:', body)
        return { ok: false, error: 'Errore invio email. Riprova più tardi.' }
      }
    } catch (err) {
      console.error('[contact] fetch error:', err)
      return { ok: false, error: 'Errore di rete. Riprova più tardi.' }
    }
  } else {
    // Dev mode: log to console instead of sending
    console.info('[contact] (no RESEND_API_KEY) would send:', {
      to,
      subjectLine,
      name,
      email,
      message,
    })
  }

  return { ok: true }
}
