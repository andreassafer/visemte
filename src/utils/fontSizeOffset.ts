/**
 * Resolves a relative font-size offset (e.g. '+3', '-2') against a base px value.
 * Returns undefined when the stored value is empty (→ use global) or not a valid offset.
 */
export const FONT_SIZE_MIN_PX = 10
export const FONT_SIZE_MAX_PX = 26

export function resolveRelativeFontSize(
  offset: string | undefined,
  basePx: number,
  maxPx = FONT_SIZE_MAX_PX,
): string | undefined {
  if (!offset) return undefined
  // Relative format: '+3', '-2'
  if (/^[+-]\d+$/.test(offset)) {
    const abs = basePx + parseInt(offset, 10)
    return `${Math.min(maxPx, Math.max(FONT_SIZE_MIN_PX, abs))}px`
  }
  // Legacy absolute format: '16px'
  const legacy = parseInt(offset, 10)
  if (!isNaN(legacy)) {
    return `${Math.min(maxPx, Math.max(FONT_SIZE_MIN_PX, legacy))}px`
  }
  return undefined
}

/** Kept for potential external use; the UI now derives offsets from fixed ABS_VALUES. */
export const FONT_SIZE_OFFSETS = ['-4', '-3', '-2', '-1', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8'] as const
