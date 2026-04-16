import { Select } from './FormField'
import { useTranslation } from 'react-i18next'

/** Fixed absolute padding values offered in the UI (0–10 px, 1 px steps). */
const ABS_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

/**
 * Normalizes a stored relative padding offset to the nearest valid option value
 * for the given basePx. Handles cases where the global padding was changed after
 * the block value was set, which would leave an offset that maps outside [0, 12].
 */
function normalizePaddingValue(stored: string, basePx: number): string {
  if (!stored) return ''
  if (!/^[+-]\d+$/.test(stored)) return ''
  const abs = basePx + parseInt(stored, 10)
  const clamped = Math.min(10, Math.max(0, abs))
  const offset = clamped - basePx
  return offset === 0 ? '' : offset > 0 ? `+${offset}` : `${offset}`
}

interface OptionsProps {
  basePx: number
  globalLabel: string
}

/**
 * Renders exactly 7 <option> elements (0–12 px in 2 px steps) for use inside a <Select>.
 * "Global" is placed at the position matching the current base value.
 */
function PaddingOptions({ basePx, globalLabel }: OptionsProps) {
  return (
    <>
      {ABS_VALUES.map((abs) => {
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
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

/**
 * Full padding select control. Wraps <Select> + <PaddingOptions> and normalizes
 * the stored offset so the correct option is always highlighted even when the
 * global padding has been changed since the block value was last set.
 */
export function PaddingSelect({ id, value, basePx, onChange }: SelectProps) {
  const { t } = useTranslation()
  const effectiveValue = normalizePaddingValue(value, basePx)

  return (
    <Select id={id} value={effectiveValue} onChange={onChange}>
      <PaddingOptions basePx={basePx} globalLabel={t('common.global')} />
    </Select>
  )
}
