import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { Button, Tooltip } from '@/components/ui'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { listTemplates, deleteTemplate, listPresets, deletePreset, savePreset } from '@/services'
import type { EmailTemplate } from '@/types'

interface Props {
  initialTab?: 'presets' | 'saved'
  onLoad: (template: EmailTemplate) => void
  onEdit: (template: EmailTemplate) => void
  onClose: () => void
}


const THUMB_HEIGHT = 160 // matches h-40

function TemplateThumbnail({ template }: { template: EmailTemplate }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.25)
  const { settings, blocks } = template

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setScale(el.offsetWidth / settings.contentWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [settings.contentWidth])

  // Ensure the inner content always fills the full thumbnail height
  const minContentHeight = Math.ceil(THUMB_HEIGHT / scale)

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded"
      style={{ height: `${THUMB_HEIGHT}px`, backgroundColor: settings.backgroundColor }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${settings.contentWidth}px`,
          minHeight: `${minContentHeight}px`,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          backgroundColor: settings.backgroundColor,
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          color: settings.fontColor,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {blocks.map((block) => <BlockRenderer key={block.id} block={block} />)}
      </div>
    </div>
  )
}

function TemplateCard({
  template,
  onLoad,
  onEdit,
  onDelete,
  onSaveAsPreset,
}: {
  template: EmailTemplate
  onLoad: (t: EmailTemplate) => void
  onEdit?: (t: EmailTemplate) => void
  onDelete?: (id: string) => void
  onSaveAsPreset?: (t: EmailTemplate) => void
}) {
  const { t } = useTranslation()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isPreset = !!onEdit

  return (
    <div className="group relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Thumbnail preview */}
      <div className="mb-3">
        <TemplateThumbnail template={template} />
      </div>

      <h3 className="font-medium text-gray-800 dark:text-gray-100">{template.name}</h3>

      {!isPreset && (
        <p className="mt-1 text-xs text-gray-400">
          {new Date(template.updatedAt).toLocaleDateString()}
        </p>
      )}

      <div className="mt-auto pt-3">
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="flex-1 text-xs text-gray-500 dark:text-gray-400">
              {t('common.confirmDelete')}
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete!(template.id) }}
            >
              {t('common.yes')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
            >
              {t('common.no')}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onLoad(template)}
            >
              {t('templates.load')}
            </Button>
            {isPreset && onEdit && (
              <Tooltip label={t('templates.edit')} side="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onEdit(template) }}
                  aria-label={t('templates.edit')}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Button>
              </Tooltip>
            )}
            {onSaveAsPreset && (
              <Tooltip label={t('templates.saveAsPreset')} side="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onSaveAsPreset(template) }}
                  aria-label={t('templates.saveAsPreset')}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </Button>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip label={t('common.delete')} side="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
                  aria-label={t('common.delete')}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </Button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function TemplateLibraryModal({ initialTab = 'saved', onLoad, onEdit, onClose }: Props) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'presets' | 'saved'>(initialTab)
  const [savedTemplates, setSavedTemplates] = useState<EmailTemplate[]>([])
  const [presetTemplates, setPresetTemplates] = useState<EmailTemplate[]>([])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setSavedTemplates(listTemplates())
    setPresetTemplates(listPresets())
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleLoad = (template: EmailTemplate) => {
    onLoad({ ...template, id: nanoid(), updatedAt: new Date().toISOString(), isPreset: false })
    onClose()
  }

  const handleEdit = (template: EmailTemplate) => {
    onEdit({ ...template, isPreset: true })
    onClose()
  }

  const handleDeletePreset = (id: string) => {
    deletePreset(id)
    setPresetTemplates(listPresets())
  }

  const handleSaveAsPreset = (template: EmailTemplate) => {
    savePreset({ ...template, isPreset: undefined })
    setPresetTemplates(listPresets())
    setToast(t('templates.savedAsPreset'))
    setTimeout(() => setToast(null), 2500)
  }

  const handleDelete = (id: string) => {
    deleteTemplate(id)
    setSavedTemplates(listTemplates())
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
      active
        ? 'border-[var(--accent)] text-[var(--accent)]'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    }`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={t('templates.presets')}
    >
      <div className="relative flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-gray-50 shadow-2xl ring-1 ring-gray-200 dark:ring-white/20 dark:bg-gray-900">

        {/* Header + Tab bar */}
        <div className="flex flex-shrink-0 items-center border-b border-gray-200 bg-white px-5 py-2 dark:border-gray-700 dark:bg-gray-900">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <Tooltip label={t('templates.library_tooltip')}>
            <button className={tabClass(tab === 'saved')} onClick={() => setTab('saved')}>
              {t('templates.library')}
            </button>
          </Tooltip>
          <Tooltip label={t('templates.schablonen_tooltip')}>
            <button className={tabClass(tab === 'presets')} onClick={() => setTab('presets')}>
              {t('templates.schablonen')}
            </button>
          </Tooltip>
          <button
            onClick={onClose}
            className="ml-auto rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={t('common.close')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="absolute bottom-4 right-4 rounded-md bg-green-500 px-4 py-2 text-sm text-white shadow-lg"
          >
            {toast}
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'presets' && (
            presetTemplates.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p className="text-sm">{t('templates.emptyPresets')}</p>
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {presetTemplates.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  onLoad={handleLoad}
                  onEdit={handleEdit}
                  onDelete={handleDeletePreset}
                />
              ))}
            </div>
            )
          )}

          {tab === 'saved' && (
            savedTemplates.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <p className="text-sm">{t('templates.emptyDrafts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {savedTemplates.map((tpl) => (
                  <TemplateCard key={tpl.id} template={tpl} onLoad={handleLoad} onDelete={handleDelete} onSaveAsPreset={handleSaveAsPreset} />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
