/**
 * Renames Tauri bundle output files – replaces underscores with hyphens
 * and lowercases the filename for all supported bundle types:
 *
 *   macOS:    Visemte_0.1.23_universal.dmg       →  visemte-0.1.23-universal.dmg
 *             Visemte_0.1.23_aarch64.dmg          →  visemte-0.1.23-aarch64.dmg
 *             Visemte_0.1.23_x86_64.dmg           →  visemte-0.1.23-x86_64.dmg
 *   Windows:  Visemte_0.1.23_x64-setup.exe       →  visemte-0.1.23-x64-setup.exe
 *             Visemte_0.1.23_arm64-setup.exe      →  visemte-0.1.23-arm64-setup.exe
 *             Visemte_0.1.23_x64_en-US.msi        →  visemte-0.1.23-x64-en-us.msi
 *   Linux:    visemte_0.1.23_amd64.deb            →  visemte-0.1.23-amd64.deb
 *             Visemte_0.1.23_amd64.AppImage       →  visemte-0.1.23-amd64.appimage
 */

import { readdirSync, renameSync, existsSync } from 'fs'
import { join } from 'path'

// Tauri output directories per platform and target
const BUNDLE_DIRS = [
  // macOS – universal
  'src-tauri/target/universal-apple-darwin/release/bundle/dmg',
  // macOS – aarch64
  'src-tauri/target/aarch64-apple-darwin/release/bundle/dmg',
  // macOS – x86_64
  'src-tauri/target/x86_64-apple-darwin/release/bundle/dmg',
  // macOS – default (release without explicit target)
  'src-tauri/target/release/bundle/dmg',
  // Windows – x64
  'src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis',
  'src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi',
  // Windows – arm64
  'src-tauri/target/aarch64-pc-windows-msvc/release/bundle/nsis',
  'src-tauri/target/aarch64-pc-windows-msvc/release/bundle/msi',
  // Windows – default
  'src-tauri/target/release/bundle/nsis',
  'src-tauri/target/release/bundle/msi',
  // Linux – x86_64
  'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb',
  'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage',
  // Linux – aarch64
  'src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/deb',
  'src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/appimage',
  // Linux – default
  'src-tauri/target/release/bundle/deb',
  'src-tauri/target/release/bundle/appimage',
]

const EXTENSIONS = new Set(['.dmg', '.exe', '.msi', '.deb', '.appimage'])

let renamed = 0

for (const dir of BUNDLE_DIRS) {
  if (!existsSync(dir)) continue
  for (const file of readdirSync(dir)) {
    const lower = file.toLowerCase()
    const ext = EXTENSIONS.has('.' + lower.split('.').pop()) ? '.' + lower.split('.').pop() : null
    if (!ext) continue

    const newName = file.replace(/_/g, '-').toLowerCase()
    if (newName !== file) {
      renameSync(join(dir, file), join(dir, newName))
      console.log(`  ${file}  →  ${newName}`)
      renamed++
    }
  }
}

if (renamed === 0) console.log('  No files to rename.')
