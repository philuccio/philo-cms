export type Role = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER'
export type Status = 'DRAFT' | 'REVIEW' | 'PUBLISHED'
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT'
export type GalleryLayout = 'GRID' | 'MASONRY' | 'FULLWIDTH' | 'FILMSTRIP'
export type Depth = 'THUMBNAIL' | 'CARD' | 'FULL'
export type ServiceLevel = 'L1_CARD' | 'L2_PAGE' | 'L3_PACKAGE'

export interface Site {
  id: string
  name: string
  domain: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string | null
  role: Role
  siteId: string
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  siteId: string
  slug: string
  title: string
  status: Status
  layoutConfig: LayoutConfig
  metaTitle?: string | null
  metaDesc?: string | null
  ogImage?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface LayoutBlock {
  id: string
  pageId: string
  type: BlockType
  order: number
  content: BlockContent
}

export type BlockType = 'hero' | 'text' | 'image' | 'quote' | 'stats' | 'cta' | 'map'

export interface LayoutConfig {
  sections: Array<{
    blockId: string
    visible: boolean
  }>
  template?: 'fullscreen' | 'split' | 'minimal'
  containerWidth?: 'full' | 'contained' | 'narrow'
}

export type BlockContent =
  | HeroBlockContent
  | TextBlockContent
  | ImageBlockContent
  | QuoteBlockContent
  | StatsBlockContent
  | CtaBlockContent
  | MapBlockContent

export interface HeroBlockContent {
  type: 'hero'
  heading: string
  subheading?: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  ctaLabel?: string
  ctaHref?: string
  variant: 'fullscreen' | 'split' | 'minimal'
}

export interface TextBlockContent {
  type: 'text'
  html: string
  align?: 'left' | 'center' | 'right'
  columns?: 1 | 2
}

export interface ImageBlockContent {
  type: 'image'
  mediaId: string
  url: string
  alt: string
  caption?: string
  width?: 'full' | 'contained' | 'narrow'
}

export interface QuoteBlockContent {
  type: 'quote'
  text: string
  author?: string
  role?: string
}

export interface StatsBlockContent {
  type: 'stats'
  items: Array<{ value: string; label: string; suffix?: string }>
}

export interface CtaBlockContent {
  type: 'cta'
  heading: string
  body?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export interface MapBlockContent {
  type: 'map'
  embedUrl: string
  address?: string
  height?: number
}

export interface Category {
  id: string
  siteId: string
  name: string
  slug: string
  color: string
}

export interface Project {
  id: string
  siteId: string
  title: string
  slug: string
  excerpt?: string | null
  body?: string | null
  status: Status
  depth: Depth
  order: number
  categoryId?: string | null
  coverId?: string | null
  year?: number | null
  client?: string | null
  tags?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProjectWithMedia extends Project {
  category?: Category | null
  media: ProjectMedia[]
}

export interface ProjectMedia {
  projectId: string
  mediaId: string
  order: number
  role: 'cover' | 'gallery' | 'detail'
  media: Media
}

export interface CaseHistory {
  id: string
  siteId: string
  title: string
  slug: string
  brief?: string | null
  challenge?: string | null
  approach?: string | null
  solution?: string | null
  results?: string | null
  status: Status
  coverId?: string | null
  projectId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CaseKPI {
  id: string
  caseId: string
  label: string
  value: string
  delta?: string | null
  unit?: string | null
  order: number
}

export interface Service {
  id: string
  siteId: string
  title: string
  slug: string
  icon?: string | null
  descShort?: string | null
  descLong?: string | null
  level: ServiceLevel
  parentId?: string | null
  order: number
  accentColor?: string | null
  status: Status
}

export interface Media {
  id: string
  siteId: string
  filename: string
  url: string
  thumbUrl?: string | null
  type: MediaType
  alt?: string | null
  width?: number | null
  height?: number | null
  size?: number | null
  mimeType?: string | null
  tags?: string | null
  folderId?: string | null
  createdAt: Date
}

export interface GalleryConfig {
  id: string
  siteId: string
  layoutType: GalleryLayout
  cols: number
  hasFilters: boolean
  hasLightbox: boolean
  defaultDepth: Depth
}
