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

export function HeroBlock({ block }: Props) {
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

  const heroStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: p['height'] ?? '400px',
    backgroundColor: p['backgroundColor'] ? p['backgroundColor'] : 'transparent',
    backgroundImage: p['src'] ? `url(${p['src']})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: p['backgroundPosition'] ?? 'center center',
    backgroundRepeat: 'no-repeat',
    borderRadius: p['borderRadius'] ?? '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems:
      p['textAlign'] === 'left'
        ? 'flex-start'
        : p['textAlign'] === 'right'
          ? 'flex-end'
          : 'center',
    justifyContent:
      p['verticalAlign'] === 'top'
        ? 'flex-start'
        : p['verticalAlign'] === 'bottom'
          ? 'flex-end'
          : 'center',
    padding: p['padding'] ?? '40px 25px',
    textAlign: (p['textAlign'] as React.CSSProperties['textAlign']) ?? 'center',
    boxSizing: 'border-box',
  }

  const line1Style: React.CSSProperties = {
    color: p['line1Color'] || settings.fontColor,
    fontSize: resolveRelativeFontSize(p['line1FontSize'], basePx, 40) || `${basePx + 18}px`,
    fontFamily: p['line1FontFamily'] || undefined,
    fontWeight: (p['line1FontStyle'] || settings.fontStyle) === 'bold' ? 'bold' : undefined,
    fontStyle: (p['line1FontStyle'] || settings.fontStyle) === 'italic' ? 'italic' : undefined,
    margin: '0 0 12px',
    lineHeight: 1.2,
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
    maxWidth: '100%',
  }

  const line2Style: React.CSSProperties = {
    color: p['line2Color'] || settings.fontColor,
    fontSize: resolveRelativeFontSize(p['line2FontSize'], basePx) || `${basePx + 4}px`,
    fontFamily: p['line2FontFamily'] || undefined,
    fontWeight: p['line2FontStyle'] === 'bold' ? 'bold' : undefined,
    fontStyle: p['line2FontStyle'] === 'italic' ? 'italic' : undefined,
    margin: 0,
    lineHeight: 1.5,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    maxWidth: '100%',
  }

  return (
    <div style={{ boxSizing: 'border-box', width: '100%', padding: `0 ${outerPadding}` }}>
      <div
        style={{
          backgroundColor: resolveColor(p['sectionBg'], settings as unknown as Record<string, unknown>),
          borderRadius: secBorderRadius !== '0px' ? secBorderRadius : undefined,
          border: secBorder,
          padding: p['innerPadding'] ?? '6px 15px',
        }}
      >
        <div style={heroStyle}>
          <p style={line1Style}>{p['line1Text'] || t('editor.blocks.heroLine1')}</p>
          <p style={line2Style}>{p['line2Text'] || t('editor.blocks.heroLine2')}</p>
        </div>
      </div>
    </div>
  )
}
