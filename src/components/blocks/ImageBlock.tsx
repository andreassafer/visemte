import { useTranslation } from 'react-i18next'
import type { EmailBlock } from '@/types'
import { useActiveTemplate } from '@/store'
import { resolveRelativePadding } from '@/utils'

interface Props {
  block: EmailBlock
}

function resolveColor(value: string | undefined, settings: Record<string, unknown>): string | undefined {
  if (!value) return undefined
  if (value.startsWith('#') || value.startsWith('rgb')) return value
  const resolved = settings[value]
  return typeof resolved === 'string' ? resolved : undefined
}

export function ImageBlock({ block }: Props) {
  const { t } = useTranslation()
  const p = block.props as Record<string, string>
  const src = p['src'] ?? ''
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const borderRadius = p['borderRadius'] || settings.defaultBorderRadius || '4px'
  const borderWidth = p['borderWidth'] || settings.defaultBorderWidth || ''
  const borderStyle = p['borderStyle'] || settings.defaultBorderStyle || 'solid'
  const borderColor = resolveColor(p['borderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const border = borderWidth ? `${borderWidth} ${borderStyle} ${borderColor ?? ''}` : undefined

  const align = p['align'] ?? 'center'
  const imgMargin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'

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
        {src ? (
          <img
            src={src}
            alt={p['alt'] ?? ''}
            style={{ display: 'block', width: p['width'] ?? '100%', margin: imgMargin, borderRadius: p['imgBorderRadius'] ?? '0px' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: p['width'] ?? '100%',
                maxWidth: '100%',
                height: '80px',
                border: '1px dashed #d1d5db',
                borderRadius: p['imgBorderRadius'] ?? '0px',
                color: '#c4c9d4',
                fontSize: '11px',
                gap: '6px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              {t('editor.properties.imagePlaceholder')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
