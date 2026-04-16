// ─── Block Types ────────────────────────────────────────────────────────────

export type BlockType =
  | 'text'
  | 'image'
  | 'button'
  | 'divider'

  | 'columns'
  | 'social'
  | 'navbar'
  | 'hero'
  | 'video'
  | 'countdown'
  | 'accordion'
  | 'quote'

export interface EmailBlock {
  id: string
  type: BlockType
  props: Record<string, unknown>
  disabled?: boolean
}

// ─── Template ────────────────────────────────────────────────────────────────

export interface TemplateSettings {
  pageColor?: string
  backgroundColor: string
  contentWidth: number
  fontFamily: string
  fontSize: number
  fontStyle?: string
  fontColor: string
  lineHeight: number
  padding?: string
  defaultBorderRadius?: string
  defaultBorderWidth?: string
  defaultBorderStyle?: string
  bodyPadding?: string
  bodyInnerPadding?: string
  bodyBorderWidth?: string
  bodyBorderStyle?: string
  bodyBorderColor?: string
  bodyBorderRadius?: string
  bodyBackgroundColor?: string
  customCss?: string
  borderColor?: string
  primaryColor?: string
  secondaryColor?: string
  alternativeColor?: string
  designColor?: string
  brandColor?: string
}

export interface EmailTemplate {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  settings: TemplateSettings
  blocks: EmailBlock[]
  isPreset?: boolean
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface AppSettings {
  language: string
  theme: ThemeMode
  accentColor: string
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export type PreviewMode = 'desktop' | 'mobile'
