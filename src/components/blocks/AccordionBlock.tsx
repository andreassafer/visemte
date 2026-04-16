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

export function AccordionBlock({ block }: Props) {
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

  const count = Math.min(Math.max(Number(p['faqCount'] ?? 3), 1), 8)
  const items = Array.from({ length: count }, (_, i) => ({
    question: p[`faq${i + 1}Question`] || `${t('editor.blocks.accordionQuestion')} ${i + 1}`,
    answer: p[`faq${i + 1}Answer`] || `${t('editor.blocks.accordionAnswer')} ${i + 1}`,
  }))

  const itemColor = resolveColor(p['color'] ?? 'fontColor', settings as unknown as Record<string, unknown>) || '#1f2937'
  const itemFontSize = resolveRelativeFontSize(p['fontSize'], basePx) || undefined
  const fontFamily = p['fontFamily'] || settings.fontFamily || undefined
  const questionFontStyle = p['questionFontStyle'] || undefined
  const answerFontStyle = p['answerFontStyle'] || undefined
  const accordionBorderColor = resolveColor(p['accordionBorderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>) || '#e5e7eb'
  const accordionBorderWidth = p['accordionBorderWidth'] ?? '1px'
  const accordionBorderStyle = p['accordionBorderStyle'] ?? 'solid'

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
        <div style={{ padding: p['padding'] ?? '10px 25px' }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                borderBottom: `${accordionBorderWidth} ${accordionBorderStyle} ${accordionBorderColor}`,
                paddingBottom: '12px',
                marginBottom: i < items.length - 1 ? '12px' : '0',
              }}
            >
              <div
                style={{
                  fontWeight: questionFontStyle === 'bold' ? 'bold' : undefined,
                  fontStyle: questionFontStyle === 'italic' ? 'italic' : undefined,
                  fontFamily,
                  fontSize: itemFontSize,
                  color: itemColor,
                  marginBottom: '6px',
                }}
              >
                {item.question}
              </div>
              <div
                style={{
                  fontWeight: answerFontStyle === 'bold' ? 'bold' : undefined,
                  fontStyle: answerFontStyle === 'italic' ? 'italic' : undefined,
                  fontFamily,
                  fontSize: itemFontSize,
                  color: itemColor,
                  lineHeight: 1.5,
                }}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
