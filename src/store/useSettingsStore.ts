import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode } from '@/types'
import { DEFAULT_APP_SETTINGS } from '@/constants'

interface SettingsState {
  language: string
  theme: ThemeMode
  accentColor: string
  setLanguage: (language: string) => void
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (accentColor: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_APP_SETTINGS,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    {
      name: 'visemte-settings',
      migrate: (stored: unknown) => {
        if (stored && typeof stored === 'object' && 'themeId' in stored && !('theme' in stored)) {
          const old = stored as { themeId?: string }
          const isDark = old.themeId?.includes('dark') ?? false
          return { ...stored, theme: isDark ? 'dark' : 'auto' }
        }
        return stored
      },
      version: 3,
    },
  ),
)
