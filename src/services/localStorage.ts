import type { EmailTemplate } from '@/types'

const TEMPLATES_KEY = 'visemte-templates'
const PRESETS_KEY = 'visemte-presets'

// ── Preset templates (seeded once from built-in defaults) ─────────────────────

export function initPresets(defaults: EmailTemplate[]): void {
  const existing = listPresets()
  const existingIds = new Set(existing.map((p) => p.id))
  const toAdd = defaults.filter((d) => !existingIds.has(d.id))
  if (toAdd.length === 0 && existing.length > 0) return
  const merged = existing.length === 0 ? defaults : [...existing, ...toAdd]
  localStorage.setItem(PRESETS_KEY, JSON.stringify(merged))
}

export function listPresets(): EmailTemplate[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY)
    return raw ? (JSON.parse(raw) as EmailTemplate[]) : []
  } catch {
    return []
  }
}

export function deletePreset(id: string): void {
  const presets = listPresets().filter((p) => p.id !== id)
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}

export function savePreset(template: EmailTemplate): void {
  const presets = listPresets()
  const index = presets.findIndex((p) => p.id === template.id)
  if (index >= 0) {
    presets[index] = template
  } else {
    presets.push(template)
  }
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}


export function saveTemplate(template: EmailTemplate): void {
  const templates = listTemplates()
  const index = templates.findIndex((t) => t.id === template.id)
  if (index >= 0) {
    templates[index] = template
  } else {
    templates.push(template)
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

export function loadTemplate(id: string): EmailTemplate | null {
  const templates = listTemplates()
  return templates.find((t) => t.id === id) ?? null
}

export function listTemplates(): EmailTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY)
    return raw ? (JSON.parse(raw) as EmailTemplate[]) : []
  } catch {
    return []
  }
}

export function deleteTemplate(id: string): void {
  const templates = listTemplates().filter((t) => t.id !== id)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}
