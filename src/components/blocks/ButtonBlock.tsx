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

export function ButtonBlock({ block }: Props) {
  const { t } = useTranslation()
  const p = block.props as Record<string, string>
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const secBorderRadius = p['secBorderRadius'] || settings.defaultBorderRadius || '4px'
  const secBorderWidth = p['secBorderWidth'] || settings.defaultBorderWidth || ''
  const secBorderStyle = p['secBorderStyle'] || settings.defaultBorderStyle || 'solid'
  const secBorderColor = resolveColor(p['secBorderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const secBorder = secBorderWidth ? `${secBorderWidth} ${secBorderStyle} ${secBorderColor ?? ''}` : undefined

  return (
    <div style={{ boxSizing: 'border-box', width: '100%', padding: `0 ${outerPadding}` }}>
      <div
        style={{
          backgroundColor: resolveColor(p['sectionBg'], settings as unknown as Record<string, unknown>),
          borderRadius: secBorderRadius !== '0px' ? secBorderRadius : undefined,
          border: secBorder,
          padding: p['secInnerPadding'] ?? '6px 15px',
        }}
      >
        <div
          style={{
            textAlign: (p['align'] as React.CSSProperties['textAlign']) ?? 'center',
            padding: p['padding'] ?? '10px 25px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              backgroundColor: p['backgroundColor'] ?? '#3b82f6',
              color: p['color'] || '#ffffff',
              fontSize: resolveRelativeFontSize(p['fontSize'], basePx) || undefined,
              fontFamily: p['fontFamily'] || undefined,
              padding: p['innerPadding'] ?? '10px 25px',
              borderRadius: p['borderRadius'] ?? '3px',
              border: p['borderWidth'] && p['borderColor'] ? `${p['borderWidth']} ${p['borderStyle'] || 'solid'} ${p['borderColor']}` : undefined,
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            {p['text'] || t('editor.properties.buttonTextPlaceholder')}
          </span>
        </div>
      </div>
    </div>
  )
}
