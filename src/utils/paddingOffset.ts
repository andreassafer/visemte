/**
 * Resolves a relative padding offset (e.g. '+4', '-2') against a base px value.
 * Returns undefined when the value is empty, not a relative offset, or an absolute/legacy value
 * (→ caller falls back to global settings.padding).
 * Consistent with normalizePaddingValue which also ignores absolute values in the UI.
 */
/** Absolute minimum and maximum padding values offered in the UI. */
export const PADDING_MIN_PX = 0
export const PADDING_MAX_PX = 10

export function resolveRelativePadding(
  value: string | undefined,
  basePx: number,
): string | undefined {
  if (!value) return undefined
  // Relative format: '+4', '-2'
  if (/^[+-]\d+$/.test(value)) {
    const n = parseInt(value, 10)
    return `${Math.min(PADDING_MAX_PX, Math.max(PADDING_MIN_PX, basePx + n))}px`
  }
  // All other values (legacy absolute like '8px', multi-value like '10px 25px', etc.)
  // are treated as "use global" — consistent with normalizePaddingValue in the UI.
  return undefined
}

/** Relative offset steps available in the UI (2 px steps, covers 0–12 px with default global of 4 px). */
export const PADDING_OFFSETS = ['-4', '-2', '+2', '+4', '+6', '+8'] as const
