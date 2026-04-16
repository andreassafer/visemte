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

export function DividerBlock({ block }: Props) {
  const p = block.props as Record<string, string>
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings.padding ?? '4px'

  const borderRadius = p['borderRadius'] || settings.defaultBorderRadius || '4px'
  const secBorderWidth = p['secBorderWidth'] || settings.defaultBorderWidth || ''
  const secBorderStyle = p['secBorderStyle'] || settings.defaultBorderStyle || 'solid'
  const secBorderColor = resolveColor(p['secBorderColor'] ?? 'borderColor', settings as unknown as Record<string, unknown>)
  const secBorder = secBorderWidth ? `${secBorderWidth} ${secBorderStyle} ${secBorderColor ?? ''}` : undefined

  // Line-specific border (renamed keys with fallback to old keys)
  const lineBorderColor = p['lineBorderColor'] ?? p['borderColor'] ?? '#333333'
  const lineBorderWidth = p['lineBorderWidth'] ?? p['borderWidth'] ?? '1px'
  const lineBorderStyle = p['lineBorderStyle'] ?? p['borderStyle'] ?? 'solid'

  return (
    <div style={{ boxSizing: 'border-box', width: '100%', padding: `0 ${outerPadding}` }}>
      <div
        style={{
          backgroundColor: resolveColor(p['sectionBg'], settings as unknown as Record<string, unknown>),
          borderRadius: borderRadius !== '0px' ? borderRadius : undefined,
          border: secBorder,
          padding: p['innerPadding'] ?? '6px 15px',
        }}
      >
        <div style={{ padding: p['padding'] ?? '10px 25px' }}>
          <hr style={{ border: 'none', borderTop: `${lineBorderWidth} ${lineBorderStyle} ${lineBorderColor}`, margin: 0, width: '100%' }} />
        </div>
      </div>
    </div>
  )
}
