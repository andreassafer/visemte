import { useEffect } from 'react'
import { useSettingsStore } from '@/store'
import { THEME_VARS, ACCENT_PRESETS, DEFAULT_ACCENT_COLOR } from '@/constants'
import type { ThemeMode } from '@/types'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === 'auto' ? getSystemTheme() : mode
  const vars = THEME_VARS[resolved]
  const root = document.documentElement
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  root.setAttribute('data-theme', resolved)
}

function applyAccent(accentColor: string) {
  const root = document.documentElement
  const preset = ACCENT_PRESETS.find((p) => p.hex === accentColor)
  if (preset) {
    root.style.setProperty('--accent', preset.hex)
    root.style.setProperty('--accent-hover', preset.hover)
    root.style.setProperty('--accent-subtle', preset.subtle)
    root.style.setProperty('--accent-ring', preset.ring)
  } else {
    root.style.setProperty('--accent', accentColor)
    root.style.setProperty('--accent-hover', accentColor)
    root.style.setProperty('--accent-subtle', accentColor + '18')
    root.style.setProperty('--accent-ring', accentColor + 'aa')
  }
}

export function useTheme() {
  const { theme, accentColor, setTheme, setAccentColor } = useSettingsStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    applyAccent(accentColor ?? DEFAULT_ACCENT_COLOR)
  }, [accentColor])

  // Listen for system theme changes when mode is 'auto'
  useEffect(() => {
    if (theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      applyTheme('auto')
    }
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
    }
  }, [theme])

  return { theme, accentColor, setTheme, setAccentColor }
}
