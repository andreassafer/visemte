import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from './Tooltip'

interface Props {
  label: string
  onReset?: () => void
  tooltip?: string
  onDelete?: () => void
  deleteTooltip?: string
  children: React.ReactNode
  defaultOpen?: boolean
  noControls?: boolean
  noToggle?: boolean
}

export function CollapsibleSection({ label, onReset, tooltip, onDelete, deleteTooltip, children, defaultOpen = true, noControls = false, noToggle = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const { t } = useTranslation()

  return (
    <div className="flex flex-col rounded border border-gray-200 dark:border-gray-700">
      {/* Header row – click anywhere to toggle */}
      <div
        role={noControls || noToggle ? undefined : 'button'}
        tabIndex={noControls || noToggle ? undefined : 0}
        className={`flex h-9 shrink-0 select-none items-center justify-between px-2 ${noControls || noToggle ? '' : 'cursor-pointer'}`}
        onClick={noControls || noToggle ? undefined : () => setOpen((v) => !v)}
        onKeyDown={noControls || noToggle ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v) }}
        aria-expanded={noControls || noToggle ? undefined : open}
      >
        <span
          className="text-xs font-semibold text-gray-600 dark:text-gray-300 border-l-2 pl-1.5"
          style={{ borderColor: 'var(--accent)' }}
        >
          {label}
        </span>
        {!noControls && <div className="flex items-center gap-1">
          {(open || noToggle) && onDelete && deleteTooltip && (
            <Tooltip label={deleteTooltip}>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onDelete() } }}
                className="flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                aria-label={deleteTooltip}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </span>
            </Tooltip>
          )}
          {(open || noToggle) && onReset && tooltip && (
            <Tooltip label={tooltip}>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onReset() }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onReset() } }}
                className="flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label={tooltip}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </span>
            </Tooltip>
          )}
          {!noToggle && <Tooltip label={open ? t('editor.tree.collapse') : t('editor.tree.expand')}>
            <span
              role="button"
              tabIndex={-1}
              className="flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label={open ? t('editor.tree.collapse') : t('editor.tree.expand')}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
                className={`transition-transform duration-150 ${open ? '' : '-rotate-90'}`}
              >
                <polygon points="1,2 9,2 5,8" />
              </svg>
            </span>
          </Tooltip>}
        </div>}
      </div>
      {(noControls || noToggle || open) && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700" />
          <div className="flex flex-col gap-2 p-2">
            {children}
          </div>
        </>
      )}
    </div>
  )
}
