import { getTheme } from '@/app/actions/theme'
import { getSiteConfig } from '@/app/actions/site-config'
import { prisma } from '@/lib/prisma'
import { LenisProvider } from '@/components/public/LenisProvider'
import { ThemeProvider } from '@/components/public/ThemeProvider'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

async function getSiteInfo() {
  const site = await prisma.site.findFirst({ select: { name: true } })
  return site?.name ?? 'PHILO'
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [theme, config, siteName] = await Promise.all([getTheme(), getSiteConfig(), getSiteInfo()])

  return (
    <div
      data-theme="dark"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}
    >
      <ThemeProvider theme={theme} />
      <LenisProvider>
        <Navbar logoUrl={config.logoUrl} siteName={siteName} nav={config.nav} />
        <div style={{ paddingTop: '4.5rem' }}>{children}</div>
        <Footer logoUrl={config.logoUrl} siteName={siteName} footer={config.footer} />
      </LenisProvider>
    </div>
  )
}
