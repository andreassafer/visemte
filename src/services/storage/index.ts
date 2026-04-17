import { LocalStorageAdapter } from './LocalStorageAdapter'
import { TauriAdapter } from './TauriAdapter'
import type { ITemplateStorage } from './ITemplateStorage'

// Tauri v2 injects __TAURI_INTERNALS__ into the WebView window.
// Tauri v1 used __TAURI__ – we check both for forward/backward compat.
declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown
    __TAURI__?: unknown
  }
}

function isTauri(): boolean {
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window
}

/**
 * The singleton storage adapter, chosen at runtime:
 *  - Inside a Tauri desktop window → TauriAdapter  (files in $APPDATA)
 *  - Browser / web server          → LocalStorageAdapter
 *
 * Import `storage` everywhere instead of calling localStorage directly.
 *
 * @example
 * import { storage } from '@/services'
 * await storage.saveTemplate(template)
 * const all = await storage.listTemplates()
 */
export const storage: ITemplateStorage = isTauri() ? new TauriAdapter() : new LocalStorageAdapter()

export type { ITemplateStorage }
export { TauriAdapter, LocalStorageAdapter }
