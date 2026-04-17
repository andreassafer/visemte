import { useTranslation } from 'react-i18next'
import { useTemplateStore, useEditorStore } from '@/store'

export function TabBar() {
  const { t } = useTranslation()
  const { tabs, activeTabId, openNewTab, closeTab, setActiveTab } = useTemplateStore()
  const { selectBlock, tabSavedAt, presetTabIds, unmarkAsPreset } = useEditorStore()

  const isDirty = (tab: { id: string; updatedAt: string; blocks: unknown[] }) => {
    const saved = tabSavedAt[tab.id]
    return saved ? tab.updatedAt !== saved : tab.blocks.length > 0
  }

  const handleSwitch = (id: string) => {
    if (id === activeTabId) return
    setActiveTab(id)
    selectBlock(null)
  }

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const wasActive = id === activeTabId
    closeTab(id)
    unmarkAsPreset(id)
    if (wasActive) selectBlock(null)
  }

  const handleNewTab = () => {
    openNewTab()
    selectBlock(null)
  }

  return (
    <div className="flex items-center justify-center border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTabId}
            onClick={() => {
              handleSwitch(tab.id)
            }}
            className={`group flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-sm whitespace-nowrap select-none transition-colors ${
              tab.id === activeTabId
                ? 'bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:bg-white hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200'
            }`}
            style={tab.id === activeTabId ? { borderColor: 'var(--accent)' } : undefined}
          >
            {presetTabIds.has(tab.id) && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="flex-shrink-0 opacity-50"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
            <span className="max-w-36 truncate">{tab.name || t('editor.untitled')}</span>
            {isDirty(tab) && (
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-50"
                aria-hidden="true"
              />
            )}
            {tabs.length > 1 && (
              <button
                onMouseDown={(e) => {
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  handleClose(e, tab.id)
                }}
                className="flex h-4 w-4 items-center justify-center rounded opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700"
                aria-label={t('common.close')}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleNewTab}
        className="ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        title={t('templates.newTab')}
        aria-label={t('templates.newTab')}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
