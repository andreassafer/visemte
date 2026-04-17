import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const GITHUB_REPO = 'andreassafer/visemte'
const CURRENT_VERSION = __APP_VERSION__

function parseVersion(v: string): number[] {
  return v.replace(/^v/, '').split('.').map(Number)
}

function isNewer(latest: string, current: string): boolean {
  const a = parseVersion(latest)
  const b = parseVersion(current)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0)
    if (diff !== 0) return diff > 0
  }
  return false
}

async function checkForUpdates(t: (key: string, opts?: Record<string, string>) => string) {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`)
    if (!res.ok) throw new Error('Network error')
    const data = (await res.json()) as { tag_name: string; html_url: string }
    const latest = data.tag_name.replace(/^v/, '')

    const { ask, message } = await import('@tauri-apps/plugin-dialog')

    if (isNewer(latest, CURRENT_VERSION)) {
      const go = await ask(t('updates.available', { latest, current: CURRENT_VERSION }), {
        title: 'Visemte',
        kind: 'info',
        okLabel: t('updates.downloadBtn'),
        cancelLabel: t('updates.cancelBtn'),
      })
      if (go) {
        const { open } = await import('@tauri-apps/plugin-shell')
        await open(data.html_url)
      }
    } else {
      await message(t('updates.upToDate', { current: CURRENT_VERSION }), {
        title: 'Visemte',
        kind: 'info',
      })
    }
  } catch {
    const { message } = await import('@tauri-apps/plugin-dialog')
    await message(t('updates.error'), { title: 'Visemte', kind: 'error' })
  }
}

export function useUpdateCheck() {
  const { t } = useTranslation()

  useEffect(() => {
    // Only active in Tauri context
    if (!('__TAURI_INTERNALS__' in window || '__TAURI__' in window)) return

    import('@tauri-apps/api/event')
      .then(({ listen }) => {
        const unlisten = listen('menu:check-updates', () => {
          void checkForUpdates(t)
        })
        return () => {
          void unlisten.then((fn) => {
            fn()
          })
        }
      })
      .catch(() => {
        /* not in Tauri */
      })
  }, [t])
}
