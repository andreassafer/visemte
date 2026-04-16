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

function calcRemaining(targetDate: string): { days: number; hours: number; minutes: number; seconds: number } {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function CountdownBlock({ block }: Props) {
  const { t } = useTranslation()
  const p = block.props as Record<string, string>
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const borderRadius = p['borderRadius'] || settings.defaultBorderRadius || '4px'
  const borderWidth = p['borderWidth'] || settings.defaultBorderWidth || ''
  const borderStyle = p['borderStyle'] || settings.defaultBorderStyle || 'solid'
  const borderColor = resolveColor(p['borderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const border = borderWidth ? `${borderWidth} ${borderStyle} ${borderColor ?? ''}` : undefined

  const targetDate = p['targetDate'] ?? ''
  const { days, hours, minutes, seconds } = targetDate
    ? calcRemaining(targetDate)
    : { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const bgColor = p['bgColor'] ?? '#3b82f6'
  const textColor = p['textColor'] ?? '#ffffff'
  const labelColor = p['labelColor'] ?? '#6b7280'
  const fontSize = resolveRelativeFontSize(p['fontSize'], basePx, 40) ?? `${basePx + 18}px`
  const labelFontSize = resolveRelativeFontSize(p['labelFontSize'], basePx) ?? `${Math.max(10, basePx - 2)}px`
  const align = (p['align'] ?? 'center') as 'left' | 'center' | 'right'

  const showSeconds = (p['showSeconds'] ?? 'true') !== 'false'

  const labels = [
    { value: days,    label: p['labelDays']    ?? t('editor.properties.countdownDays') },
    { value: hours,   label: p['labelHours']   ?? t('editor.properties.countdownHours') },
    { value: minutes, label: p['labelMinutes'] ?? t('editor.properties.countdownMinutes') },
    ...(showSeconds ? [{ value: seconds, label: p['labelSeconds'] ?? t('editor.properties.countdownSeconds') }] : []),
  ]

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
            padding: p['padding'] ?? '16px 25px',
            textAlign: align,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              gap: '8px',
              alignItems: 'flex-start',
              justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            }}
          >
            {labels.map(({ value, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '64px',
                }}
              >
                <div
                  style={{
                    backgroundColor: bgColor,
                    borderRadius: '6px',
                    padding: '8px 12px',
                    minWidth: '56px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: textColor,
                      fontSize,
                      fontWeight: 'bold',
                      lineHeight: 1.1,
                      display: 'block',
                    }}
                  >
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span
                  style={{
                    color: labelColor,
                    fontSize: labelFontSize,
                    marginTop: '4px',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
