/**
 * Tauri v2 file-system adapter.
 *
 * Templates are stored as individual JSON files under the app's data directory:
 *
 *   $APPDATA/
 *     templates/
 *       <id>.json    ← user-saved templates
 *     presets/
 *       <id>.json    ← preset / Schablonen templates
 *
 * The exact path on each OS:
 *   macOS   ~/Library/Application Support/<bundle-id>/
 *   Windows %APPDATA%\<bundle-id>\
 *   Linux   ~/.local/share/<bundle-id>/
 *
 * ── Required Tauri setup ────────────────────────────────────────────────────
 *
 * 1. Cargo.toml  →  add the plugin:
 *      [dependencies]
 *      tauri-plugin-fs = "2"
 *
 * 2. src-tauri/src/main.rs  →  register the plugin:
 *      .plugin(tauri_plugin_fs::init())
 *
 * 3. src-tauri/capabilities/default.json  →  grant permissions + scope:
 *      {
 *        "permissions": [
 *          "fs:allow-mkdir",
 *          "fs:allow-read-dir",
 *          "fs:allow-read-file",
 *          "fs:allow-write-file",
 *          "fs:allow-remove",
 *          "fs:allow-exists",
 *          {
 *            "identifier": "fs:scope-appdata-recursive",
 *            "allow": [{ "path": "$APPDATA/**" }]
 *          }
 *        ]
 *      }
 * ────────────────────────────────────────────────────────────────────────────
 */

import { mkdir, readTextFile, writeTextFile, readDir, remove, exists } from '@tauri-apps/plugin-fs'
import { BaseDirectory } from '@tauri-apps/api/path'
import type { EmailTemplate } from '@/types'
import type { ITemplateStorage } from './ITemplateStorage'

const BASE = BaseDirectory.AppLocalData
const TEMPLATES_DIR = 'templates'
const PRESETS_DIR = 'presets'

// ── Helpers ──────────────────────────────────────────────────────────────────

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { baseDir: BASE, recursive: true })
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    const text = await readTextFile(path, { baseDir: BASE })
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeTextFile(path, JSON.stringify(data, null, 2), { baseDir: BASE })
}

/**
 * Returns the names of all `.json` files inside a directory.
 * Returns an empty array if the directory does not exist yet.
 */
async function listJsonFiles(dir: string): Promise<string[]> {
  const dirExists = await exists(dir, { baseDir: BASE })
  if (!dirExists) return []
  try {
    const entries = await readDir(dir, { baseDir: BASE })
    return entries.filter((e) => e.isFile && e.name.endsWith('.json')).map((e) => e.name)
  } catch {
    return []
  }
}

// ── Adapter ──────────────────────────────────────────────────────────────────

export class TauriAdapter implements ITemplateStorage {
  // ── User templates ──────────────────────────────────────────────────────────

  async listTemplates(): Promise<EmailTemplate[]> {
    const files = await listJsonFiles(TEMPLATES_DIR)
    const results = await Promise.all(
      files.map((f) => readJson<EmailTemplate>(`${TEMPLATES_DIR}/${f}`)),
    )
    return results.filter((t): t is EmailTemplate => t !== null)
  }

  async saveTemplate(template: EmailTemplate): Promise<void> {
    await ensureDir(TEMPLATES_DIR)
    await writeJson(`${TEMPLATES_DIR}/${template.id}.json`, template)
  }

  async loadTemplate(id: string): Promise<EmailTemplate | null> {
    return readJson<EmailTemplate>(`${TEMPLATES_DIR}/${id}.json`)
  }

  async deleteTemplate(id: string): Promise<void> {
    const path = `${TEMPLATES_DIR}/${id}.json`
    const fileExists = await exists(path, { baseDir: BASE })
    if (fileExists) await remove(path, { baseDir: BASE })
  }

  // ── Presets / Schablonen ────────────────────────────────────────────────────

  async listPresets(): Promise<EmailTemplate[]> {
    const files = await listJsonFiles(PRESETS_DIR)
    const results = await Promise.all(
      files.map((f) => readJson<EmailTemplate>(`${PRESETS_DIR}/${f}`)),
    )
    return results.filter((t): t is EmailTemplate => t !== null)
  }

  async savePreset(template: EmailTemplate): Promise<void> {
    await ensureDir(PRESETS_DIR)
    await writeJson(`${PRESETS_DIR}/${template.id}.json`, template)
  }

  async deletePreset(id: string): Promise<void> {
    const path = `${PRESETS_DIR}/${id}.json`
    const fileExists = await exists(path, { baseDir: BASE })
    if (fileExists) await remove(path, { baseDir: BASE })
  }

  /**
   * Seeds built-in presets once.
   * - On a fresh install: writes all defaults.
   * - On subsequent launches: only adds presets whose id is not yet on disk.
   *   Existing presets (potentially modified by the user) are never overwritten.
   */
  async initPresets(defaults: EmailTemplate[]): Promise<void> {
    await ensureDir(PRESETS_DIR)
    const existing = await this.listPresets()
    const existingIds = new Set(existing.map((p) => p.id))
    const toAdd = defaults.filter((d) => !existingIds.has(d.id))
    // If every default is already present → nothing to do
    if (toAdd.length === 0 && existing.length > 0) return
    // First launch: write all defaults; subsequent: write only new ones
    const toWrite = existing.length === 0 ? defaults : toAdd
    await Promise.all(toWrite.map((p) => this.savePreset(p)))
  }
}
