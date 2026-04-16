import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store'
import { SUPPORTED_LANGUAGES, LANGUAGE_AUTO, ACCENT_PRESETS, DEFAULT_ACCENT_COLOR } from '@/constants'
import type { ThemeMode } from '@/types'

interface Props {
  onClose: () => void
}

const THEME_OPTIONS: { value: ThemeMode; labelKey: string }[] = [
  { value: 'light', labelKey: 'settings.themeLight' },
  { value: 'auto',  labelKey: 'settings.themeAuto'  },
  { value: 'dark',  labelKey: 'settings.themeDark'  },
]

export function SettingsModal({ onClose }: Props) {
  const { t, i18n } = useTranslation()
  const {
    language, theme, accentColor,
    setLanguage, setTheme, setAccentColor,
  } = useSettingsStore()

  const currentAccent = accentColor ?? DEFAULT_ACCENT_COLOR

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    if (value === LANGUAGE_AUTO) {
      localStorage.removeItem('visemte-language')
      void i18n.changeLanguage(undefined)
    } else {
      void i18n.changeLanguage(value)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={t('settings.title')}
    >
      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 dark:ring-white/20 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 dark:text-gray-400">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t('settings.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={t('common.close')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5">

          {/* Language */}
          <section>
            <h3 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border-l-2 border-gray-400 dark:border-gray-500 pl-1.5" style={{ borderColor: 'var(--accent)' }}>
              {t('settings.language')}
            </h3>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              aria-label={t('settings.language')}
            >
              <option value={LANGUAGE_AUTO}>{t('settings.languageAuto')}</option>
              <option disabled>──────────</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </section>

          {/* Accent color */}
          <section>
            <h3 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border-l-2 border-gray-400 dark:border-gray-500 pl-1.5" style={{ borderColor: 'var(--accent)' }}>
              {t('settings.accentColor')}
            </h3>
            <div className="grid grid-cols-9 gap-2">
              {ACCENT_PRESETS.map((preset) => {
                const isActive = currentAccent === preset.hex
                return (
                  <button
                    key={preset.id}
                    onClick={() => setAccentColor(preset.hex)}
                    className="relative aspect-square w-full rounded-full transition-transform hover:scale-110 focus:outline-none"
                    style={{ backgroundColor: preset.hex }}
                    aria-label={preset.id}
                    aria-pressed={isActive}
                    title={preset.id}
                  >
                    {isActive && (
                      <svg className="absolute inset-0 m-auto" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Theme */}
          <section>
            <h3 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border-l-2 border-gray-400 dark:border-gray-500 pl-1.5" style={{ borderColor: 'var(--accent)' }}>
              {t('settings.theme')}
            </h3>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 ${
                    theme === opt.value
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                  aria-pressed={theme === opt.value}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
