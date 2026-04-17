import type { EmailTemplate } from '@/types'
import type { ITemplateStorage } from './ITemplateStorage'
import {
  listTemplates as lsListTemplates,
  saveTemplate as lsSaveTemplate,
  loadTemplate as lsLoadTemplate,
  deleteTemplate as lsDeleteTemplate,
  listPresets as lsListPresets,
  savePreset as lsSavePreset,
  deletePreset as lsDeletePreset,
  initPresets as lsInitPresets,
} from '../localStorage'

/**
 * Thin async wrapper around the synchronous localStorage implementation.
 * Used in regular browsers / web deployments.
 */
export class LocalStorageAdapter implements ITemplateStorage {
  listTemplates(): Promise<EmailTemplate[]> {
    return Promise.resolve(lsListTemplates())
  }

  saveTemplate(template: EmailTemplate): Promise<void> {
    lsSaveTemplate(template)
    return Promise.resolve()
  }

  loadTemplate(id: string): Promise<EmailTemplate | null> {
    return Promise.resolve(lsLoadTemplate(id))
  }

  deleteTemplate(id: string): Promise<void> {
    lsDeleteTemplate(id)
    return Promise.resolve()
  }

  listPresets(): Promise<EmailTemplate[]> {
    return Promise.resolve(lsListPresets())
  }

  savePreset(template: EmailTemplate): Promise<void> {
    lsSavePreset(template)
    return Promise.resolve()
  }

  deletePreset(id: string): Promise<void> {
    lsDeletePreset(id)
    return Promise.resolve()
  }

  initPresets(defaults: EmailTemplate[]): Promise<void> {
    lsInitPresets(defaults)
    return Promise.resolve()
  }
}
