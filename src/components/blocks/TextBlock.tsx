import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { EmailBlock } from '@/types'
import { useActiveTemplate } from '@/store'
import { resolveRelativeFontSize, resolveRelativePadding } from '@/utils'

interface Props {
  block: EmailBlock
}

function resolveColor(value: string | undefined, settings: Record<string, unknown>): string | undefined {
  if (!value) return undefined
  if (value.startsWith('#') || value.startsWith('rgb')) return value
  const resolved = settings[value]
  return typeof resolved === 'string' ? resolved : undefined
}

export function TextBlock({ block }: Props) {
  const { t } = useTranslation()
  const p = block.props as Record<string, string>
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const borderRadius = p['borderRadius'] || settings.defaultBorderRadius || '4px'
  const borderWidth = p['borderWidth'] || settings.defaultBorderWidth || ''
  const borderStyle = p['borderStyle'] || settings.defaultBorderStyle || 'solid'
  const borderColor = resolveColor(p['borderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const border = borderWidth ? `${borderWidth} ${borderStyle} ${borderColor ?? ''}` : undefined

  return (
    <div style={{ boxSizing: 'border-box', width: '100%', padding: `0 ${outerPadding}` }}>
      <div
        style={{
          backgroundColor: resolveColor(p['sectionBg'], settings as unknown as Record<string, unknown>),
          borderRadius: borderRadius !== '0px' ? borderRadius : undefined,
          border,
          padding: p['innerPadding'] ?? p['padding'] ?? '8px',
        }}
      >
        <div
          style={{
            textAlign: (p['align'] as React.CSSProperties['textAlign']) ?? 'left',
            color: p['color'] || settings.fontColor,
            fontSize: resolveRelativeFontSize(p['fontSize'], settings.fontSize ?? 14) || `${settings.fontSize ?? 14}px`,
            fontFamily: p['fontFamily'] || settings.fontFamily,
            fontWeight: p['fontStyle'] === 'bold' ? 'bold' : settings.fontStyle === 'bold' ? 'bold' : undefined,
            fontStyle: p['fontStyle'] === 'italic' ? 'italic' : settings.fontStyle === 'italic' ? 'italic' : undefined,
            width: p['width'] ?? '100%',
            margin: '0 auto',
          }}
          dangerouslySetInnerHTML={{ __html: p['content'] || t('editor.blocks.textPlaceholder') }}
        />
      </div>
    </div>
  )
}
