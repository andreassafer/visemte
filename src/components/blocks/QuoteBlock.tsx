import { useTranslation } from 'react-i18next'
import { useActiveTemplate } from '@/store'
import { resolveRelativeFontSize, resolveRelativePadding } from '@/utils'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
}

function resolveColor(value: string | undefined, settings: Record<string, unknown>): string | undefined {
  if (!value) return undefined
  if (value.startsWith('#') || value.startsWith('rgb')) return value
  const resolved = settings[value]
  return typeof resolved === 'string' ? resolved : undefined
}

export function QuoteBlock({ block }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const p = block.props as Record<string, string>
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const borderRadius = p['borderRadius'] || settings.defaultBorderRadius || '4px'
  const borderWidth = p['borderWidth'] || settings.defaultBorderWidth || ''
  const borderStyle = p['borderStyle'] || settings.defaultBorderStyle || 'solid'
  const borderColor = resolveColor(p['borderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const border = borderWidth ? `${borderWidth} ${borderStyle} ${borderColor ?? ''}` : undefined

  const accentColor = p['accentColor'] ?? '#3b82f6'
  const textColor   = p['textColor']   ?? '#374151'
  const authorColor = p['authorColor'] ?? '#9ca3af'
  const fontStyleRaw = p['fontStyle'] ?? 'italic'
  const fontStyle    = fontStyleRaw === 'bold' ? 'normal' : fontStyleRaw as 'normal' | 'italic'
  const fontWeight   = fontStyleRaw === 'bold' ? 'bold' : 'normal'
  const align       = (p['align'] ?? 'left') as 'left' | 'center' | 'right'
  const quoteStyle  = p['quoteStyle']  ?? 'quotes'

  const authorFontStyleRaw = p['authorFontStyle'] || 'normal'
  const authorFontStyle    = authorFontStyleRaw === 'bold' ? 'normal' : authorFontStyleRaw as 'normal' | 'italic'
  const authorFontWeight   = authorFontStyleRaw === 'bold' ? 'bold' : 'normal'

  const resolvedFontSize = resolveRelativeFontSize(p['fontSize'], basePx)
  const resolvedAuthorFontSize = resolveRelativeFontSize(p['authorFontSize'], basePx) ?? `${basePx}px`

  const textStyle = {
    margin: '0 0 8px 0' as const,
    ...(resolvedFontSize ? { fontSize: resolvedFontSize } : {}),
    ...(p['fontFamily'] ? { fontFamily: p['fontFamily'] } : {}),
    fontStyle,
    fontWeight,
    color: textColor,
    lineHeight: 1.6,
    textAlign: align,
  }
  const authorStyle = {
    margin: 0,
    fontSize: resolvedAuthorFontSize,
    color: authorColor,
    fontStyle: authorFontStyle,
    fontWeight: authorFontWeight,
    ...(p['authorFontFamily'] ? { fontFamily: p['authorFontFamily'] } : {}),
    textAlign: align,
  }

  const content = (
    <div style={{ flex: 1 }}>
      <div style={textStyle}>
        {p['text'] || t('editor.properties.quotePlaceholder')}
      </div>
      {p['author'] && <div style={authorStyle}>{p['authorPrefix'] ?? '—'} {p['author']}</div>}
    </div>
  )

  return (
    <div style={{ boxSizing: 'border-box', width: '100%', padding: `0 ${outerPadding}` }}>
      <div
        style={{
          backgroundColor: resolveColor(p['sectionBg'], settings as unknown as Record<string, unknown>),
          borderRadius: borderRadius !== '0px' ? borderRadius : undefined,
          border,
          padding: p['innerPadding'] ?? '6px 15px',
        }}
      >
          {quoteStyle === 'quotes' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ flexShrink: 0, width: '40px', fontSize: '52px', color: accentColor, lineHeight: 0.8, display: 'flex', justifyContent: 'center' }}>&ldquo;</div>
              {content}
            </div>
          )}
          {quoteStyle === 'none' && content}
      </div>
    </div>
  )
}
