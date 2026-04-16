import { useState, useRef } from 'react'
import { Button, Tooltip } from '@/components/ui'
import { useUndo, useBlockCopy } from '@/hooks'
import { DragDropContext } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { CanvasPreview } from './CanvasPreview'
import { ExportModal } from './ExportModal'
import { AboutModal } from './AboutModal'
import { TemplateLibraryModal } from './TemplateLibraryModal'
import { TemplateSettingsModal } from './TemplateSettingsModal'

import { BlockPalette, BlockTree, TabDropdown } from '@/components/panels/BlockTree'
import { PropertiesPanel } from '@/components/panels/PropertiesPanel'
import { SettingsModal } from '@/components/settings/SettingsModal'
import { ErrorBoundary } from '@/components/ui'
import { useTemplateStore, useEditorStore, useActiveTemplate } from '@/store'
import { saveTemplate, savePreset } from '@/services'
import { validateTemplate } from '@/utils'
import { nanoid } from 'nanoid'
import type { EmailTemplate } from '@/types'

export function EditorLayout() {
  const { t } = useTranslation()
  const { reorderBlocks, reorderBlockChildren, reorderBlocksInColumn, loadTemplate, clearHistory } = useTemplateStore()
  const { selectBlock, tabPreviewModes, setPreviewMode, markSaved, markAsPreset, presetTabIds } = useEditorStore()
  const { undo, redo, canUndo, canRedo } = useUndo()
  useBlockCopy()
  const template = useActiveTemplate()
  const activeTabId = useTemplateStore((s) => s.activeTabId)
  const previewMode = tabPreviewModes[activeTabId] ?? 'desktop'

  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showTemplateSettings, setShowTemplateSettings] = useState(false)
  const [saveToast, setSaveToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const importInputRef = useRef<HTMLInputElement>(null)

  // ── DnD ──────────────────────────────────────────────────────────────────────
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
if (!destination) return
    const srcId  = source.droppableId
    const destId = destination.droppableId

    // Tree → tree reorder
    if (srcId === 'tree' && destId === 'tree') {
      if (source.index !== destination.index) reorderBlocks(source.index, destination.index)
      selectBlock(draggableId.replace(/^tree::/, ''))
    }

    // Tree child reorder (columns / faq / accordion sub-items)
    if (srcId.startsWith('tree-child::') && srcId === destId) {
      const blockId = srcId.replace(/^tree-child::/, '')
      if (source.index !== destination.index) reorderBlockChildren(blockId, source.index, destination.index)
    }

    // Column child reorder — droppableId: tree-col-child::<blockId>::<colIndex>
    if (srcId.startsWith('tree-col-child::') && srcId === destId) {
      const parts = srcId.split('::')
      const blockId = parts[1]
      const colIndex = Number(parts[2])
      if (source.index !== destination.index) reorderBlocksInColumn(blockId, colIndex, source.index, destination.index)
    }
  }

  const isPresetTab = presetTabIds.has(activeTabId)

  // ── Handle manual save ────────────────────────────────────────────────────────
  const handleSave = () => {
    if (isPresetTab) savePreset(template)
    else saveTemplate(template)
    markSaved(activeTabId, template.updatedAt)
    showToast(t('editor.toolbar.saveSuccess'), 'success')
  }

  // ── Import JSON ──────────────────────────────────────────────────────────────
  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const raw: unknown = JSON.parse(e.target?.result as string)
        const result = validateTemplate(raw)
        if (!result.success) {
          showToast(t('errors.invalidTemplate'), 'error')
          return
        }
        const now = new Date().toISOString()
        handleLoadTemplate({ ...result.data, id: nanoid(), createdAt: now, updatedAt: now })
        showToast('Template importiert', 'success')
      } catch {
        showToast(t('errors.invalidTemplate'), 'error')
      }
    }
    reader.readAsText(file)
  }

  // ── Load template ────────────────────────────────────────────────────────────
  const handleLoadTemplate = (tpl: EmailTemplate) => {
    loadTemplate(tpl)
    selectBlock(null)
    clearHistory(tpl.id)
    markSaved(tpl.id, tpl.updatedAt)
  }

  // ── Edit preset ──────────────────────────────────────────────────────────────
  const handleEditPreset = (tpl: EmailTemplate) => {
    loadTemplate(tpl)
    markAsPreset(tpl.id)
    selectBlock(null)
    clearHistory(tpl.id)
  }

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: 'success' | 'error') => {
    setSaveToast({ msg, type })
    setTimeout(() => setSaveToast(null), 2500)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Hidden file input for JSON import */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImportFile(file)
          e.target.value = ''
        }}
      />

      <div className="flex h-screen overflow-hidden">
          <BlockPalette />
          <BlockTree />
          <ErrorBoundary label="Einstellungen">
            <PropertiesPanel />
          </ErrorBoundary>

          {/* Preview column with control bar on top */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-shrink-0 items-center justify-center border-b border-gray-200 bg-white px-2 py-[6.5px] dark:border-gray-700 dark:bg-gray-900">

              <div className="flex items-center gap-1">

                {/* Logo / about */}
                <Tooltip label={t('tooltips.about')} side="bottom">
                  <button
                    onClick={() => setShowAbout(true)}
                    aria-label="About Visemte"
                    className="flex items-center justify-center rounded"
                  >
                    <div className="flex h-[27px] w-[27px] flex-shrink-0 items-center justify-center rounded-[5px]" style={{ backgroundColor: 'var(--accent)' }}>
                      <svg className="h-4 w-4 text-white" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style={{ fillRule: 'evenodd', clipRule: 'evenodd' }} aria-hidden="true" fill="currentColor">
                        <g transform="matrix(2.334498,0,0,2.334498,-673.638579,-683.797019)">
                          <path d="M445.719,556.423C434.918,525.93 394.053,408.072 393.886,407.428C393.237,404.934 395.184,405.708 458.62,382.888C461.431,381.876 461.915,385.927 468.044,403.665C507.505,517.884 507.796,517.666 511.056,527.646C512.452,531.921 510.98,531.961 501.729,559.577C494.996,579.679 485.641,606.341 484.217,610.399C482.621,614.949 478.602,613.917 468.493,613.701C465.431,613.636 465.22,612.383 458.338,592.556C452.042,574.416 452.008,574.522 445.719,556.423Z"/>
                          <path d="M596.893,399.618C601.501,386.107 601.378,383.104 606.506,383.124C636.506,383.241 636.987,382.988 637.53,383.462C639.122,384.85 637.743,385.356 572.695,574.567C559.418,613.187 559.116,613.496 557.536,613.757C557.248,613.805 524.596,613.819 524.402,613.765C522.139,613.128 523.627,611.95 532.768,585.591C545.1,550.032 595.675,403.32 596.893,399.618Z"/>
                          <path d="M377.885,359.464C377.886,356.577 377.891,336.683 398.64,329.936C404.738,327.953 429.382,315.006 444.023,335.831C447.379,340.604 456.64,367.964 455.652,369.645C455.475,369.945 390.629,392.956 389.44,392.737C388.149,392.499 378.802,365.972 377.885,359.464Z"/>
                          <path d="M509.598,658.842C512.095,658.334 512.059,657.973 513.525,658.397C520.185,660.322 529.147,663.077 530.503,663.494C532.647,664.153 531.428,666.183 531.304,666.389C525.647,675.804 514.075,699.304 512.383,700.101C510.752,700.87 511.219,699.594 509.069,695.74C492.431,665.919 490.809,664.469 493.51,663.522C501.472,660.728 501.568,661.266 509.598,658.842Z"/>
                        </g>
                      </svg>
                    </div>
                  </button>
                </Tooltip>

                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
                <Tooltip label={t('tooltips.undo')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => undo()} disabled={!canUndo} aria-label={t('editor.toolbar.undo')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                  </Button>
                </Tooltip>

                <Tooltip label={t('tooltips.redo')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => redo()} disabled={!canRedo} aria-label={t('editor.toolbar.redo')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                    </svg>
                  </Button>
                </Tooltip>

                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

                <Tooltip label={t('tooltips.save')} side="bottom">
                  <Button variant="ghost" size="md" onClick={handleSave} aria-label={t('editor.toolbar.save')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                  </Button>
                </Tooltip>

                <TabDropdown />

                <Tooltip label={t('tooltips.templateSettings')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => setShowTemplateSettings(true)} aria-label={t('tooltips.templateSettings')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </Button>
                </Tooltip>

                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

                <Tooltip label={t('editor.toolbar.open')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => setShowTemplates(true)} aria-label={t('editor.toolbar.open')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </Button>
                </Tooltip>

                <Tooltip label={t('templates.import')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => importInputRef.current?.click()} aria-label={t('templates.import')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </Button>
                </Tooltip>

                <Tooltip label={t('editor.toolbar.export')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => setShowExport(true)} aria-label={t('editor.toolbar.export')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </Button>
                </Tooltip>

                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

                <Tooltip label={t('tooltips.desktop')} side="bottom">
                  <Button variant={previewMode === 'desktop' ? 'primary' : 'ghost'} size="md"
                    onClick={() => { setPreviewMode(activeTabId, 'desktop'); selectBlock(null) }} aria-pressed={previewMode === 'desktop'}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                    </svg>
                  </Button>
                </Tooltip>

                <Tooltip label={t('tooltips.mobile')} side="bottom">
                  <Button variant={previewMode === 'mobile' ? 'primary' : 'ghost'} size="md"
                    onClick={() => { setPreviewMode(activeTabId, 'mobile'); selectBlock(null) }} aria-pressed={previewMode === 'mobile'}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="0.5" fill="currentColor" />
                    </svg>
                  </Button>
                </Tooltip>
                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

                {/* Settings */}
                <Tooltip label={t('tooltips.settings')} side="bottom">
                  <Button variant="ghost" size="md" onClick={() => setShowSettings(true)} aria-label={t('editor.toolbar.settings')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </Button>
                </Tooltip>

              </div>

            </div>

            <ErrorBoundary label="Vorschau">
              <CanvasPreview template={template} previewMode={previewMode} />
            </ErrorBoundary>
          </div>
      </div>

      {showExport   && <ExportModal template={template} onClose={() => setShowExport(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAbout    && <AboutModal onClose={() => setShowAbout(false)} />}
      {showTemplates && <TemplateLibraryModal onLoad={handleLoadTemplate} onEdit={handleEditPreset} onClose={() => setShowTemplates(false)} />}
      {showTemplateSettings && <TemplateSettingsModal onClose={() => setShowTemplateSettings(false)} />}

      {saveToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 right-4 rounded-md px-4 py-2 text-sm text-white shadow-lg transition-all ${
            saveToast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {saveToast.msg}
        </div>
      )}
    </DragDropContext>
  )
}
