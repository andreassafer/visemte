import { Select } from './FormField'
import { useTranslation } from 'react-i18next'

/** Fixed absolute font sizes offered in the UI — full range; components may cap via maxPx. */
const ABS_VALUES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] as const

/**
 * Normalizes a stored font-size value to the nearest valid option value
 * for the given basePx. Handles:
 * - Valid relative offset (e.g. '+3') → clamp absolute result to [10, 22]
 * - Old absolute value (e.g. '16px') → map to nearest ABS_VALUE
 * - Empty / falsy → '' (global)
 */
function normalizeFontSizeValue(stored: string, basePx: number, maxPx = 26): string {
  if (!stored) return ''

  // New relative format: '+3', '-2'
  if (/^[+-]\d+$/.test(stored)) {
    const abs = basePx + parseInt(stored, 10)
    const clamped = Math.min(maxPx, Math.max(10, abs))
    const offset = clamped - basePx
    return offset === 0 ? '' : offset > 0 ? `+${offset}` : `${offset}`
  }

  // Legacy absolute format: '16px'
  const legacy = parseInt(stored, 10)
  if (!isNaN(legacy)) {
    const clamped = Math.min(maxPx, Math.max(10, legacy))
    const offset = clamped - basePx
    return offset === 0 ? '' : offset > 0 ? `+${offset}` : `${offset}`
  }

  return ''
}

interface OptionsProps {
  basePx: number
  globalLabel: string
  maxPx?: number
}

function FontSizeOptions({ basePx, globalLabel, maxPx = 26 }: OptionsProps) {
  return (
    <>
      {ABS_VALUES.filter((abs) => abs <= maxPx).map((abs) => {
        const offset = abs - basePx
        if (offset === 0) {
          return <option key="global" value="">{globalLabel} ({basePx}px)</option>
        }
        const stored = offset > 0 ? `+${offset}` : `${offset}`
        return <option key={abs} value={stored}>{stored}px ({abs}px)</option>
      })}
    </>
  )
}

interface SelectProps {
  id: string
  value: string
  basePx: number
  maxPx?: number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function FontSizeSelect({ id, value, basePx, maxPx = 26, onChange }: SelectProps) {
  const { t } = useTranslation()
  const effectiveValue = normalizeFontSizeValue(value, basePx, maxPx)

  return (
    <Select id={id} value={effectiveValue} onChange={onChange}>
      <FontSizeOptions basePx={basePx} globalLabel={t('common.global')} maxPx={maxPx} />
    </Select>
  )
}
