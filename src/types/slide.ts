export interface SlideFrontmatter {
  layout?: 'cover' | 'default' | 'two-col' | 'blank'
  background?: string
  label?: string
  transition?: 'slide' | 'fade' | 'none'
  [key: string]: unknown
}

export interface SlideData {
  index: number
  title: string
  html: string
  frontmatter: SlideFrontmatter
  rawMarkdown: string
  notes?: string
}

export interface PresentationMeta {
  title?: string
  theme?: string
  [key: string]: unknown
}
