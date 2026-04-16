import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@/components/ui'

interface ToolbarProps {
  onExport: () => void
  onImport: () => void
  onPresets: () => void
  onLibrary: () => void
}

export function Toolbar({ onExport, onImport, onPresets, onLibrary }: ToolbarProps) {
  const { t } = useTranslation()

  return (
    <header className="flex h-12 flex-shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">

      {/* Presets */}
      <Tooltip label={t('tooltips.presets')} side="bottom">
        <Button variant="ghost" size="sm" onClick={onPresets}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          {t('templates.presets')}
        </Button>
      </Tooltip>

      {/* Library */}
      <Tooltip label={t('tooltips.library')} side="bottom">
        <Button variant="ghost" size="sm" onClick={onLibrary}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {t('templates.library')}
        </Button>
      </Tooltip>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Tooltip label={t('tooltips.import')} side="bottom">
          <Button variant="ghost" size="sm" onClick={onImport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t('templates.import')}
          </Button>
        </Tooltip>

        <Tooltip label={t('tooltips.export')} side="bottom">
          <Button variant="ghost" size="sm" onClick={onExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {t('editor.toolbar.export')}
          </Button>
        </Tooltip>

      </div>
    </header>
  )
}
