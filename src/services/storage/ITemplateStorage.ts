import type { EmailTemplate } from '@/types'

/**
 * Platform-agnostic interface for template persistence.
 *
 * All methods are async so both file-system-based adapters (Tauri, server)
 * and synchronous adapters (localStorage wrapper) can implement the same
 * contract without special casing at the call site.
 */
export interface ITemplateStorage {
  // ── User templates ──────────────────────────────────────────────────────────
  listTemplates(): Promise<EmailTemplate[]>
  saveTemplate(template: EmailTemplate): Promise<void>
  loadTemplate(id: string): Promise<EmailTemplate | null>
  deleteTemplate(id: string): Promise<void>

  // ── Preset / Schablonen ─────────────────────────────────────────────────────
  listPresets(): Promise<EmailTemplate[]>
  savePreset(template: EmailTemplate): Promise<void>
  deletePreset(id: string): Promise<void>

  /**
   * Seeds built-in presets on first launch.
   * Existing presets (by id) are never overwritten.
   */
  initPresets(defaults: EmailTemplate[]): Promise<void>
}
