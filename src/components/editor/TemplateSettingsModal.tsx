import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TemplateProperties } from '@/components/blocks/properties/TemplateProperties'

interface Props {
  onClose: () => void
}

export function TemplateSettingsModal({ onClose }: Props) {
  const { t } = useTranslation()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('tooltips.templateSettings')}
    >
      <div className="relative flex max-h-[85vh] w-full max-w-sm flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-white/20">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-gray-500 dark:text-gray-400"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {t('tooltips.templateSettings')}
            </span>
          </div>
          <button
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
          <TemplateProperties />
        </div>
      </div>
    </div>
  )
}
