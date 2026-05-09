import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding PHILO CMS...')

  // Site
  const site = await prisma.site.upsert({
    where: { domain: 'localhost' },
    update: {},
    create: {
      name: 'PHILO Demo',
      domain: 'localhost',
    },
  })

  console.log(`✓ Site: ${site.name} (${site.id})`)

  // Theme — Dark Luxury preset
  await prisma.theme.upsert({
    where: { siteId: site.id },
    update: {},
    create: {
      siteId: site.id,
      primaryColor: '#0a0a0a',
      secondaryColor: '#f5f2ed',
      accentColor: '#c9a84c',
      bgColor: '#0a0a0a',
      textColor: '#f5f2ed',
      fontDisplay: 'Cormorant Garamond',
      fontBody: 'DM Sans',
      presetName: 'Dark Luxury',
    },
  })

  console.log('✓ Theme: Dark Luxury')

  // GalleryConfig
  await prisma.galleryConfig.upsert({
    where: { siteId: site.id },
    update: {},
    create: {
      siteId: site.id,
      layoutType: 'GRID',
      cols: 3,
      hasFilters: true,
      hasLightbox: true,
      defaultDepth: 'CARD',
    },
  })

  console.log('✓ GalleryConfig')

  // Admin user
  const adminPassword = await hash('philo-admin-2025', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@philo.local' },
    update: {},
    create: {
      email: 'admin@philo.local',
      password: adminPassword,
      name: 'Admin PHILO',
      role: 'SUPER_ADMIN',
      siteId: site.id,
    },
  })

  console.log(`✓ User: ${admin.email} (SUPER_ADMIN)`)

  // Categorie demo
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { siteId_slug: { siteId: site.id, slug: 'branding' } },
      update: {},
      create: { siteId: site.id, name: 'Branding', slug: 'branding', color: '#c9a84c' },
    }),
    prisma.category.upsert({
      where: { siteId_slug: { siteId: site.id, slug: 'web-design' } },
      update: {},
      create: { siteId: site.id, name: 'Web Design', slug: 'web-design', color: '#4a90d9' },
    }),
    prisma.category.upsert({
      where: { siteId_slug: { siteId: site.id, slug: 'editorial' } },
      update: {},
      create: { siteId: site.id, name: 'Editorial', slug: 'editorial', color: '#e85d4a' },
    }),
  ])

  console.log(`✓ Categories: ${categories.map((c) => c.name).join(', ')}`)

  // Pagina Home demo
  await prisma.page.upsert({
    where: { siteId_slug: { siteId: site.id, slug: 'home' } },
    update: {},
    create: {
      siteId: site.id,
      slug: 'home',
      title: 'Home',
      status: 'PUBLISHED',
      layoutConfig: JSON.stringify({
        sections: [],
        template: 'fullscreen',
        containerWidth: 'full',
      }),
      metaTitle: 'PHILO — Agenzia di Comunicazione',
      metaDesc: 'Progettiamo identità visive e strategie di comunicazione per brand ambiziosi.',
    },
  })

  console.log('✓ Page: Home')

  console.log('\n✅ Seed completato!')
  console.log(`\n  Site ID: ${site.id}`)
  console.log('  Aggiungi NEXT_PUBLIC_SITE_ID nel tuo .env.local\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
