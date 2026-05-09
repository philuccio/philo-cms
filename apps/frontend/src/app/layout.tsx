import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'PHILO CMS',
    template: '%s | PHILO',
  },
  description: 'CMS per Agenzie di Comunicazione, Web Agency e Freelance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
