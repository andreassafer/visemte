import { BlockRenderer } from '@/components/blocks/BlockRenderer'
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

export function ColumnsBlock({ block }: Props) {
  const p = block.props as Record<string, unknown>
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(String(settings.padding ?? '4px'), 10)

  const secBorderRadius = String(p['secBorderRadius'] ?? '') || settings.defaultBorderRadius || '4px'
  const secBorderWidth = String(p['secBorderWidth'] ?? '') || settings.defaultBorderWidth || ''
  const secBorderStyle = String(p['secBorderStyle'] ?? '') || settings.defaultBorderStyle || 'solid'
  const secBorderColor = resolveColor(String(p['secBorderColor'] ?? 'borderColor'), settings as unknown as Record<string, unknown>)
  const secBorder = secBorderWidth ? `${secBorderWidth} ${secBorderStyle} ${secBorderColor ?? ''}` : undefined

  const count = Math.min(Math.max(Number(p['columns'] ?? 2), 1), 3)
  const columnBlocks = (p['columnBlocks'] as EmailBlock[][] | undefined) ??
    Array.from({ length: count }, (): EmailBlock[] => [])
  const rawWidths = String(p['columnWidths'] ?? '')
  const widths = rawWidths ? rawWidths.split(',').map(Number) : null

  const globalValign = String(p['verticalAlign'] ?? 'top')
  const colPropsArr = (Array.isArray(p['columnProps']) ? p['columnProps'] : []) as Record<string, string>[]
  const getColProp = (i: number, key: string, def = '') => String(colPropsArr[i]?.[key] ?? def)

  const minHeight = String(p['minHeight'] ?? '200px')
  const gridCols = widths
    ? widths.slice(0, count).map((w) => `${w}fr`).join(' ')
    : `repeat(${count}, 1fr)`

  const resolvedSectionPadding = resolveRelativePadding(String(p['outerPadding'] ?? ''), paddingBasePx) ?? settings.padding ?? '4px'

  return (
    <div
      style={{
        padding: resolvedSectionPadding,
        backgroundColor: resolveColor(String(p['sectionBg'] ?? ''), settings as unknown as Record<string, unknown>),
        borderRadius: secBorderRadius !== '0px' ? secBorderRadius : undefined,
        border: secBorder,
      }}
    >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gridAutoRows: `minmax(${minHeight}, auto)`,
            gap: '0',
          }}
        >
          {Array.from({ length: count }).map((_, colIndex) => {
            const children = columnBlocks[colIndex] ?? []
            const isEmpty = children.length === 0
            const colValign = getColProp(colIndex, 'verticalAlign', globalValign)
            const colBg  = getColProp(colIndex, 'backgroundColor', '')
            const colBr  = getColProp(colIndex, 'borderRadius', '4px')
            const colPad = getColProp(colIndex, 'padding', '0px')
            const colBw  = getColProp(colIndex, 'borderWidth', '')
            const colBc  = getColProp(colIndex, 'borderColor', '')
            const colBs  = getColProp(colIndex, 'borderStyle', 'solid')

            const justifyContent = colValign === 'middle' ? 'center' : colValign === 'bottom' ? 'flex-end' : 'flex-start'
            // 'backgroundColor' token (legacy default) means no explicit column bg
            const resolvedColBg  = colBg && colBg !== 'backgroundColor' ? resolveColor(colBg, settings as unknown as Record<string, unknown>) : undefined
            const effectiveBg    = isEmpty ? undefined : resolvedColBg
            const effectiveBorder = isEmpty
              ? '1.5px dashed #d1d5db'
              : (colBw && colBc ? `${colBw} ${colBs || 'solid'} ${colBc}` : undefined)

            return (
              <div
                key={colIndex}
                className="flex flex-col"
                style={{
                  justifyContent,
                  minHeight,
                  backgroundColor: effectiveBg,
                  borderRadius: colBr || undefined,
                  overflow: !isEmpty && colBr && colBr !== '0px' ? 'hidden' : undefined,
                  padding: !isEmpty && colPad !== '0px' ? colPad : undefined,
                  border: effectiveBorder,
                }}
              >
                {children.map((child) => (
                  <BlockRenderer key={child.id} block={child} />
                ))}
              </div>
            )
          })}
        </div>
    </div>
  )
}
