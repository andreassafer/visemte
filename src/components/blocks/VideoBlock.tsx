import type React from 'react'
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

export function VideoBlock({ block }: Props) {
  const { t } = useTranslation()
  const p = block.props as Record<string, string>
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'
  const thumbnailSrc = p['thumbnailSrc'] ?? ''

  const secBorderRadius = p['secBorderRadius'] || settings.defaultBorderRadius || '4px'
  const secBorderWidth = p['secBorderWidth'] || settings.defaultBorderWidth || ''
  const secBorderStyle = p['secBorderStyle'] || settings.defaultBorderStyle || 'solid'
  const secBorderColor = resolveColor(p['secBorderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const secBorder = secBorderWidth ? `${secBorderWidth} ${secBorderStyle} ${secBorderColor ?? ''}` : undefined

  const showPlayButton = (p['showPlayButton'] ?? 'true') !== 'false'

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
        <div
          style={{
            textAlign: (p['align'] as React.CSSProperties['textAlign']) ?? 'center',
            padding: p['padding'] ?? '10px 25px',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              position: 'relative',
              maxWidth: '100%',
              borderRadius: p['borderRadius'] ?? '4px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={p['alt'] ?? ''}
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  borderRadius: p['borderRadius'] ?? '4px',
                }}
              />
            ) : (
              <div
                style={{
                  width: '400px',
                  maxWidth: '100%',
                  height: '225px',
                  background: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  color: '#9ca3af',
                  fontSize: '14px',
                  borderRadius: p['borderRadius'] ?? '4px',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="#6b7280" stroke="none" />
                </svg>
                {t('editor.blocks.video')}
              </div>
            )}

            {showPlayButton && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '56px',
                  height: '56px',
                  background: 'rgba(0,0,0,0.65)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="8 5 19 12 8 19 8 5" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
