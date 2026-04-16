import type React from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'
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

export function NavbarBlock({ block }: Props) {
  const { t } = useTranslation()
  const template = useActiveTemplate()
  const p = block.props as Record<string, string>
  const { settings } = template
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const borderRadius = p['borderRadius'] || settings.defaultBorderRadius || '4px'
  const borderWidth = p['borderWidth'] || settings.defaultBorderWidth || ''
  const borderStyle = p['borderStyle'] || settings.defaultBorderStyle || 'solid'
  const borderColor = resolveColor(p['borderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const border = borderWidth ? `${borderWidth} ${borderStyle} ${borderColor ?? ''}` : undefined

  const count = Math.min(Math.max(Number(p['linkCount'] ?? 3), 1), 6)
  const separator = p['separator'] ?? ' | '
  const linkColor = p['color'] || settings.fontColor || '#374151'

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
        <div
          style={{
            textAlign: (p['align'] as React.CSSProperties['textAlign']) ?? 'center',
            padding: p['padding'] ?? '10px 25px',
            fontSize: resolveRelativeFontSize(p['fontSize'], basePx) || undefined,
            fontFamily: p['fontFamily'] || undefined,
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <span key={i}>
              {i > 0 && (
                <span style={{ color: linkColor, opacity: 0.4 }}>{separator}</span>
              )}
              <span
                className="hover:underline"
                style={{
                  color: linkColor,
                  cursor: 'pointer',
                }}
              >
                {p[`link${i + 1}Text`] || t('editor.properties.linkNumber', { n: i + 1 })}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
