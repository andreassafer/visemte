/**
 * Renames Tauri bundle output files:
 *   - Inserts OS prefix (mac/win/lin) after the version number
 *   - Replaces underscores with hyphens and lowercases
 *   - Strips WiX locale suffix from MSI  (e.g. _en-US → removed)
 *   - Strips RPM release number          (e.g. -1.x86_64 → .x86_64)
 *
 * Examples:
 *   Visemte_0.1.4_universal.dmg       →  visemte-0.1.4-mac-universal.dmg
 *   Visemte_0.1.4_aarch64.dmg         →  visemte-0.1.4-mac-aarch64.dmg
 *   Visemte_0.1.4_x64-setup.exe       →  visemte-0.1.4-win-x64-setup.exe
 *   Visemte_0.1.4_x64_en-US.msi       →  visemte-0.1.4-win-x64.msi
 *   Visemte_0.1.4_amd64.deb           →  visemte-0.1.4-lin-amd64.deb
 *   Visemte_0.1.4_amd64.AppImage      →  visemte-0.1.4-lin-amd64.appimage
 *   Visemte-0.1.4-1.x86_64.rpm        →  visemte-0.1.4-lin-x86-64.rpm
 */

import { readdirSync, renameSync, existsSync } from 'fs'
import { join } from 'path'

// Map from bundle subdirectory name → OS prefix
const DIR_TO_OS = {
  dmg:      'mac',
  nsis:     'win',
  msi:      'win',
  deb:      'lin',
  appimage: 'lin',
  rpm:      'lin',
}

const BUNDLE_DIRS = [
  // macOS
  'src-tauri/target/universal-apple-darwin/release/bundle/dmg',
  'src-tauri/target/aarch64-apple-darwin/release/bundle/dmg',
  'src-tauri/target/x86_64-apple-darwin/release/bundle/dmg',
  'src-tauri/target/release/bundle/dmg',
  // Windows
  'src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis',
  'src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi',
  'src-tauri/target/aarch64-pc-windows-msvc/release/bundle/nsis',
  'src-tauri/target/aarch64-pc-windows-msvc/release/bundle/msi',
  'src-tauri/target/release/bundle/nsis',
  'src-tauri/target/release/bundle/msi',
  // Linux
  'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb',
  'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage',
  'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/rpm',
  'src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/deb',
  'src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/appimage',
  'src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/rpm',
  'src-tauri/target/release/bundle/deb',
  'src-tauri/target/release/bundle/appimage',
  'src-tauri/target/release/bundle/rpm',
]

const EXTENSIONS = new Set(['.dmg', '.exe', '.msi', '.deb', '.appimage', '.rpm'])

function normalize(file, osPrefix) {
  let name = file.replace(/_/g, '-').toLowerCase()

  // Strip WiX locale suffix: -en-us.msi → .msi
  name = name.replace(/-[a-z]{2}-[a-z]{2}(\.msi)$/, '$1')

  // Strip RPM release number: -1.aarch64.rpm → .aarch64.rpm
  name = name.replace(/-\d+(\.[a-z0-9-]+\.rpm)$/, '$1')

  // Remove -setup from Windows installers: -x64-setup.exe → -x64.exe
  name = name.replace(/-setup(\.exe)$/, '$1')

  // Insert OS prefix after version number – handles both hyphen and dot separator
  // e.g. visemte-0.1.4-universal → visemte-0.1.4-mac-universal
  //      visemte-0.1.4.aarch64   → visemte-0.1.4-lin-aarch64
  name = name.replace(/^(visemte-\d+\.\d+\.\d+)([-\.])/, `$1-${osPrefix}-`)

  return name
}

let renamed = 0

for (const dir of BUNDLE_DIRS) {
  if (!existsSync(dir)) continue
  const bundleType = dir.split('/').pop()
  const osPrefix = DIR_TO_OS[bundleType] ?? 'unknown'

  for (const file of readdirSync(dir)) {
    const ext = '.' + file.split('.').pop().toLowerCase()
    if (!EXTENSIONS.has(ext)) continue

    const newName = normalize(file, osPrefix)
    if (newName !== file) {
      renameSync(join(dir, file), join(dir, newName))
      console.log(`  ${file}  →  ${newName}`)
      renamed++
    }
  }
}

if (renamed === 0) console.log('  No files to rename.')
