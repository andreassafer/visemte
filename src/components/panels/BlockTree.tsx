import React, { useState, useRef, useEffect, useCallback } from 'react'
import { List as VirtualList } from 'react-window'
import type { RowComponentProps } from 'react-window'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { useTemplateStore, useEditorStore, useActiveTemplate } from '@/store'
import { Tooltip } from '@/components/ui'
import type { BlockType, EmailBlock } from '@/types'
import type { DraggableProvided } from '@hello-pangea/dnd'

// ── Block icons ────────────────────────────────────────────────────────────────

export function BlockIcon({
  type,
  size = 14,
  strokeWidth,
}: {
  type: BlockType
  size?: number
  strokeWidth?: string
}) {
  const s = size
  const sw = strokeWidth ?? (s <= 14 ? '1.5' : '1.25')
  switch (type) {
    case 'text':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="8 7 2 12 8 17" />
          <polyline points="16 7 22 12 16 17" />
          <path d="M4 4V1h16v3M9 17h6M12 1v16" />
        </svg>
      )
    case 'image':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      )
    case 'button':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="2" y="7" width="20" height="10" rx="3" />
          <path d="M8 12h8" />
        </svg>
      )
    case 'divider':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <line x1="3" y1="8" x2="3" y2="16" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="21" y1="8" x2="21" y2="16" />
        </svg>
      )
    case 'columns':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      )
    case 'social':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="2" y="7" width="8" height="10" rx="1" />
          <rect x="14" y="7" width="8" height="10" rx="1" />
        </svg>
      )
    case 'navbar':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 12h2M11 12h2M16 12h2" />
        </svg>
      )
    case 'hero':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M8 15h8M10 12h4" />
        </svg>
      )
    case 'video':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'countdown':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    case 'accordion':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    case 'quote':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      )
    default:
      return (
        <span style={{ fontSize: s * 0.6 }} className="font-bold">
          {(type as string)[0]?.toUpperCase()}
        </span>
      )
  }
}

// ── Shared palette items list ──────────────────────────────────────────────────

const PALETTE_ITEMS: { type: BlockType; labelKey: string }[] = [
  { type: 'columns', labelKey: 'editor.blocks.columns' },
  { type: 'text', labelKey: 'editor.blocks.text' },
  { type: 'divider', labelKey: 'editor.blocks.divider' },
  { type: 'image', labelKey: 'editor.blocks.image' },
  { type: 'hero', labelKey: 'editor.blocks.hero' },
  { type: 'video', labelKey: 'editor.blocks.video' },
  { type: 'button', labelKey: 'editor.blocks.button' },
  { type: 'navbar', labelKey: 'editor.blocks.navbar' },
  { type: 'social', labelKey: 'editor.blocks.social' },
  { type: 'countdown', labelKey: 'editor.blocks.countdown' },
  { type: 'accordion', labelKey: 'editor.blocks.accordion' },
  { type: 'quote', labelKey: 'editor.blocks.quote' },
]

// ── Shared add-block helper ────────────────────────────────────────────────────

function useAddBlock() {
  const { addBlock } = useTemplateStore()
  const { selectBlock } = useEditorStore()
  return (type: BlockType) => {
    addBlock(type)
    const newBlock = useTemplateStore
      .getState()
      .tabs.find((tab) => tab.id === useTemplateStore.getState().activeTabId)
      ?.blocks.at(-1)
    if (newBlock) selectBlock(newBlock.id)
  }
}

// ── 1. Spalte: Blöcke-Palette ─────────────────────────────────────────────────

const PALETTE_ITEM_HEIGHT = 28 // h-7
const VIRTUALIZE_THRESHOLD = 20 // activate react-window only above this count

export function BlockPalette() {
  const { t } = useTranslation()
  const handleAdd = useAddBlock()
  const [wide, setWide] = useState(true)
  const [listHeight, setListHeight] = useState(400)
  const listContainerRef = useRef<HTMLDivElement>(null)
  const { selectBlock } = useEditorStore()

  const toggle = () => {
    selectBlock(null)
    setWide((prev) => !prev)
  }

  // Measure available height for the virtualized list
  useEffect(() => {
    const el = listContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setListHeight(el.offsetHeight)
    })
    ro.observe(el)
    setListHeight(el.offsetHeight)
    return () => {
      ro.disconnect()
    }
  }, [])

  const renderItem = useCallback(
    ({ index, style }: RowComponentProps) => {
      const item = PALETTE_ITEMS[index]
      return (
        <div style={style}>
          {wide ? (
            <button
              onClick={() => {
                handleAdd(item.type)
              }}
              className="flex h-7 w-full items-center gap-2.5 rounded px-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                <BlockIcon type={item.type} size={16} />
              </span>
              <span className="truncate">{t(item.labelKey)}</span>
            </button>
          ) : (
            <Tooltip label={t(item.labelKey)} side="right" sideOffset={4}>
              <button
                onClick={() => {
                  handleAdd(item.type)
                }}
                className="flex h-7 w-full items-center justify-center rounded px-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800"
              >
                <BlockIcon type={item.type} size={16} />
              </button>
            </Tooltip>
          )}
        </div>
      )
    },
    [wide, handleAdd, t],
  )

  const shouldVirtualize = PALETTE_ITEMS.length > VIRTUALIZE_THRESHOLD

  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-900 ${wide ? 'w-40' : 'w-12'}`}
      aria-label={t('editor.palette.title')}
    >
      <div
        className={`flex flex-shrink-0 items-center gap-1.5 bg-gray-100 dark:bg-gray-800 ${wide ? 'px-3 py-2.5' : 'justify-center py-[13px]'}`}
      >
        <Tooltip label={!wide ? t('editor.palette.title') : ''} side="right" sideOffset={12}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
            style={{ color: 'var(--accent)' }}
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </Tooltip>
        {wide && (
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {t('editor.palette.title')}
          </span>
        )}
      </div>
      <div
        ref={listContainerRef}
        className={`flex flex-1 flex-col py-1 overflow-hidden ${wide ? 'items-stretch px-1' : 'items-center'}`}
      >
        {shouldVirtualize ? (
          <VirtualList
            rowComponent={renderItem}
            rowCount={PALETTE_ITEMS.length}
            rowHeight={PALETTE_ITEM_HEIGHT}
            defaultHeight={listHeight}
            rowProps={{}}
            style={{ overflowX: 'hidden' }}
          />
        ) : (
          PALETTE_ITEMS.map((item) =>
            wide ? (
              <button
                key={item.type}
                onClick={() => {
                  handleAdd(item.type)
                }}
                className="flex h-7 items-center gap-2.5 rounded px-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                  <BlockIcon type={item.type} size={16} />
                </span>
                <span className="truncate">{t(item.labelKey)}</span>
              </button>
            ) : (
              <Tooltip key={item.type} label={t(item.labelKey)} side="right" sideOffset={4}>
                <button
                  onClick={() => {
                    handleAdd(item.type)
                  }}
                  className="flex h-7 items-center justify-center rounded px-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800"
                >
                  <BlockIcon type={item.type} size={16} />
                </button>
              </Tooltip>
            ),
          )
        )}
      </div>

      {/* Width toggle */}
      <div className={`flex flex-shrink-0 py-1 ${wide ? 'justify-end px-1' : 'justify-center'}`}>
        <Tooltip
          label={wide ? t('editor.tree.collapse') : t('editor.tree.expand')}
          side="right"
          sideOffset={4}
        >
          <button
            onClick={toggle}
            aria-label={wide ? t('editor.tree.collapse') : t('editor.tree.expand')}
            className="flex items-center justify-center rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {wide ? (
                <>
                  <polyline points="15 18 9 12 15 6" />
                </>
              ) : (
                <>
                  <polyline points="9 18 15 12 9 6" />
                </>
              )}
            </svg>
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}

// ── Tree row ───────────────────────────────────────────────────────────────────

interface TreeRowProps {
  block: EmailBlock
  index: number
  wide: boolean
  selectedBlockId: string | null
  hasChildSelected?: boolean
  onSelect: (id: string | null) => void
  onDuplicate: (id: string) => void
  onToggleDisabled: (id: string) => void
  onDelete: (id: string) => void
  children?: React.ReactNode
}

function TreeRow({
  block,
  index,
  wide,
  selectedBlockId,
  hasChildSelected,
  onSelect,
  onDuplicate,
  onToggleDisabled,
  onDelete,
  children,
}: TreeRowProps) {
  const { t } = useTranslation()
  const isSelected = selectedBlockId === block.id && !hasChildSelected
  const isDisabled = block.disabled === true

  const rowClass = `group flex items-center cursor-grab active:cursor-grabbing transition-colors rounded ${
    isDisabled
      ? 'text-gray-300 dark:text-gray-600'
      : isSelected
        ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
  }`

  return (
    <Draggable draggableId={`tree::${block.id}`} index={index}>
      {(dp, ds) => (
        <div ref={dp.innerRef} {...dp.draggableProps} data-tree-item>
          {!wide ? (
            <Tooltip label={t(`editor.blocks.${block.type}`)} side="right">
              <div
                {...dp.dragHandleProps}
                className={`${rowClass} h-7 pl-3 pr-1 ${ds.isDragging ? 'shadow-md ring-1 ring-[var(--accent-ring)] bg-white dark:bg-gray-900' : ''}`}
                onClick={() => {
                  onSelect(
                    hasChildSelected ? block.id : selectedBlockId === block.id ? null : block.id,
                  )
                }}
              >
                <span
                  className={`flex-shrink-0 ${isDisabled ? 'opacity-40' : 'text-gray-400 dark:text-gray-500'}`}
                >
                  <BlockIcon type={block.type} />
                </span>
              </div>
            </Tooltip>
          ) : (
            <div
              {...dp.dragHandleProps}
              className={`${rowClass} gap-1 px-1 py-1 ${ds.isDragging ? 'shadow-md ring-1 ring-[var(--accent-ring)] bg-white dark:bg-gray-900' : ''}`}
              onClick={() => {
                onSelect(
                  hasChildSelected ? block.id : selectedBlockId === block.id ? null : block.id,
                )
              }}
            >
              <span
                className={`flex-shrink-0 ${isDisabled ? 'opacity-40' : 'text-gray-400 dark:text-gray-500'}`}
              >
                <BlockIcon type={block.type} />
              </span>
              <span
                className={`flex-1 truncate text-sm ${isDisabled ? 'line-through opacity-50' : ''}`}
              >
                {t(`editor.blocks.${block.type}`)}
              </span>
              <Tooltip label={t('common.duplicate')} side="bottom">
                <button
                  className="flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(block.id)
                  }}
                  aria-label={t('common.duplicate')}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="9" y="9" width="14" height="14" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </Tooltip>
              <Tooltip
                label={isDisabled ? t('editor.tree.enableBlock') : t('editor.tree.disableBlock')}
                side="bottom"
              >
                <button
                  className={`flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 transition-colors ${
                    isDisabled
                      ? 'text-[var(--accent)] hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleDisabled(block.id)
                  }}
                  aria-label={
                    isDisabled ? t('editor.tree.enableBlock') : t('editor.tree.disableBlock')
                  }
                >
                  {isDisabled ? (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </Tooltip>
              <Tooltip label={t('editor.tree.deleteBlock')} side="bottom">
                <button
                  className="flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-400 dark:text-gray-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(block.id)
                  }}
                  aria-label={t('editor.tree.deleteBlock')}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          )}
          {children}
        </div>
      )}
    </Draggable>
  )
}

// ── Column child block row (draggable) ────────────────────────────────────────

function ColumnChildRow({
  block,
  index,
  colBlockId,
  colIndex,
  wide,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: EmailBlock
  index: number
  colBlockId: string
  colIndex: number
  wide: boolean
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const cls = `group flex items-center rounded py-0.5 cursor-grab active:cursor-grabbing transition-colors ${
    isSelected
      ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
  } ${wide ? 'ml-6 gap-1 pl-1 pr-0.5' : 'pl-10 pr-1'}`
  return (
    <Draggable
      draggableId={`tree-col-child::${colBlockId}::${colIndex}::${block.id}`}
      index={index}
    >
      {(dp, ds) => (
        <Tooltip label={!wide ? t(`editor.blocks.${block.type}`) : ''} side="right">
          <div
            ref={dp.innerRef}
            {...dp.draggableProps}
            {...dp.dragHandleProps}
            className={`${cls} ${ds.isDragging ? 'shadow-md ring-1 ring-[var(--accent-ring)] bg-white dark:bg-gray-900' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
              <BlockIcon type={block.type} />
            </span>
            {wide && (
              <>
                <span className="flex-1 truncate text-sm">{t(`editor.blocks.${block.type}`)}</span>
                <Tooltip label={t('editor.tree.deleteBlock')} side="bottom">
                  <button
                    className="flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-400 dark:text-gray-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                    aria-label={t('editor.tree.deleteBlock')}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </Tooltip>
      )}
    </Draggable>
  )
}

// ── Inline add-block-to-column button (icon in row action bar) ───────────────

const COLUMN_CHILD_TYPES: BlockType[] = ['text', 'image', 'button', 'divider']

function InlineAddToColumnButton({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [open])

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <Tooltip label={t('editor.tree.integrate')} side="bottom">
        <button
          className="hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation()
            setOpen((v) => !v)
          }}
          aria-label={t('editor.tree.integrate')}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </Tooltip>
      {open && (
        <div className="absolute right-0 z-50 mt-0.5 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {COLUMN_CHILD_TYPES.map((type) => (
            <button
              key={type}
              className="flex h-7 w-full items-center gap-2 px-2 text-left text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation()
                onAdd(type)
                setOpen(false)
              }}
            >
              <span className="text-gray-400 dark:text-gray-500">
                <BlockIcon type={type} size={12} />
              </span>
              {t(`editor.blocks.${type}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Child rows (non-draggable sub-items) ──────────────────────────────────────

function TreeChildRows({ block, wide }: { block: EmailBlock; wide: boolean }) {
  const { t } = useTranslation()
  const { selectedBlockId, selectedChildIndex, selectBlock, selectChild, selectColumn } =
    useEditorStore()
  const {
    duplicateBlockChild,
    toggleBlockChildDisabled,
    removeBlockChild,
    addBlockToColumn,
    removeBlockFromColumn,
  } = useTemplateStore()

  const isParentSelected = selectedBlockId === block.id

  const handleChildClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation()
    if (block.type === 'columns') {
      selectColumn(block.id, i)
    } else {
      selectBlock(block.id)
      selectChild(i)
    }
  }

  const childRowCls = (i: number, isDisabled = false) => {
    const isSelected = isParentSelected && selectedChildIndex === i
    return `group flex items-center gap-1.5 rounded py-1 cursor-pointer transition-colors ${
      isDisabled
        ? 'text-gray-300 dark:text-gray-600'
        : isSelected
          ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    } ${wide ? 'ml-3 px-1' : 'pl-6 pr-1'}`
  }

  const colIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="2" width="16" height="20" rx="1" />
    </svg>
  )

  const renderRow = (
    i: number,
    icon: React.ReactNode,
    label: string,
    dp: DraggableProvided,
    isDragging: boolean,
    isDisabled = false,
    extraActions?: React.ReactNode,
  ) => (
    <Tooltip label={!wide ? label : ''} side="right">
      <div
        ref={dp.innerRef}
        {...dp.draggableProps}
        {...dp.dragHandleProps}
        className={`${childRowCls(i, isDisabled)} ${isDragging ? 'shadow-md ring-1 ring-[var(--accent-ring)] bg-white dark:bg-gray-900' : ''}`}
        onClick={(e) => {
          handleChildClick(e, i)
        }}
      >
        <span
          className={`flex-shrink-0 ${isDisabled ? 'opacity-40 text-gray-400 dark:text-gray-500' : 'text-gray-400 dark:text-gray-500'}`}
        >
          {icon}
        </span>
        {wide && (
          <span
            className={`flex-1 truncate text-sm ${isDisabled ? 'line-through opacity-50' : ''}`}
          >
            {label}
          </span>
        )}
        {wide && (
          <div className="flex items-center gap-1">
            {extraActions}
            <Tooltip label={t('common.duplicate')} side="bottom">
              <button
                className="flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation()
                  duplicateBlockChild(block.id, i)
                }}
                aria-label={t('common.duplicate')}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="9" y="9" width="14" height="14" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </Tooltip>
            <Tooltip
              label={isDisabled ? t('editor.tree.enableBlock') : t('editor.tree.disableBlock')}
              side="bottom"
            >
              <button
                className={`flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 transition-colors ${
                  isDisabled
                    ? 'text-[var(--accent)] hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBlockChildDisabled(block.id, i)
                }}
                aria-label={
                  isDisabled ? t('editor.tree.enableBlock') : t('editor.tree.disableBlock')
                }
              >
                {isDisabled ? (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </Tooltip>
            <Tooltip label={t('editor.tree.deleteBlock')} side="bottom">
              <button
                className="flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-400 dark:text-gray-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  removeBlockChild(block.id, i)
                }}
                aria-label={t('editor.tree.deleteBlock')}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </Tooltip>
  )

  if (block.type === 'columns') {
    const count = Math.min(Math.max(Number(block.props['columns'] ?? 2), 1), 3)
    const colPropsArr = (
      Array.isArray(block.props['columnProps']) ? block.props['columnProps'] : []
    ) as Record<string, string>[]
    const columnBlocks = (block.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []
    return (
      <Droppable droppableId={`tree-child::${block.id}`} type="child">
        {(dp) => (
          <div ref={dp.innerRef} {...dp.droppableProps}>
            {Array.from({ length: count }, (_, i) => (
              <React.Fragment key={i}>
                <Draggable draggableId={`tree-child::${block.id}::${i}`} index={i}>
                  {(dp2, ds) =>
                    renderRow(
                      i,
                      colIcon,
                      `${t('editor.tree.column')} ${colPropsArr[i]?.col ?? i + 1}`,
                      dp2,
                      ds.isDragging,
                      block.disabled === true || colPropsArr[i]?.disabled === 'true',
                      wide ? (
                        <InlineAddToColumnButton
                          onAdd={(type) => {
                            addBlockToColumn(block.id, i, type)
                            const newCols = (
                              useTemplateStore
                                .getState()
                                .tabs.find(
                                  (tab) => tab.id === useTemplateStore.getState().activeTabId,
                                )
                                ?.blocks.find((b) => b.id === block.id)?.props['columnBlocks'] as
                                | EmailBlock[][]
                                | undefined
                            )?.[i]
                            const newBlock = newCols?.at(-1)
                            if (newBlock) selectBlock(newBlock.id)
                          }}
                        />
                      ) : undefined,
                    )
                  }
                </Draggable>
                <Droppable
                  droppableId={`tree-col-child::${block.id}::${i}`}
                  type={`col-child-${block.id}-${i}`}
                >
                  {(colDp) => (
                    <div ref={colDp.innerRef} {...colDp.droppableProps}>
                      {(columnBlocks[i] ?? []).map((childBlock, ci) => (
                        <ColumnChildRow
                          key={childBlock.id}
                          block={childBlock}
                          index={ci}
                          colBlockId={block.id}
                          colIndex={i}
                          wide={wide}
                          isSelected={selectedBlockId === childBlock.id}
                          onSelect={() => {
                            selectBlock(selectedBlockId === childBlock.id ? null : childBlock.id)
                          }}
                          onDelete={() => {
                            removeBlockFromColumn(block.id, i, childBlock.id)
                          }}
                        />
                      ))}
                      {colDp.placeholder}
                    </div>
                  )}
                </Droppable>
              </React.Fragment>
            ))}
            {dp.placeholder}
          </div>
        )}
      </Droppable>
    )
  }

  return null
}

// ── Tab-Dropdown ───────────────────────────────────────────────────────────────

export function TabDropdown() {
  const { t } = useTranslation()
  const { tabs, activeTabId, openNewTab, closeTab, setActiveTab } = useTemplateStore()
  const { selectBlock, tabSavedAt, presetTabIds, unmarkAsPreset } = useEditorStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [open])

  const activeTab = tabs.find((t) => t.id === activeTabId)

  const isDirty = (tab: { id: string; updatedAt: string }) => {
    const saved = tabSavedAt[tab.id]
    return saved ? tab.updatedAt !== saved : false
  }

  const handleSwitch = (id: string) => {
    setOpen(false)
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

  const handleNew = () => {
    setOpen(false)
    openNewTab()
    selectBlock(null)
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <Tooltip label={open ? '' : t('templates.presets')} side="bottom">
        <button
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            open
              ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => {
            setOpen((v) => !v)
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="flex-shrink-0"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="max-w-[140px] truncate">{activeTab?.name || t('editor.untitled')}</span>
          {activeTab && isDirty(activeTab) && (
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
          )}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </Tooltip>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-1.5 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {/* Tab list */}
          <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <div
                  role="option"
                  aria-selected={tab.id === activeTabId}
                  onClick={() => {
                    handleSwitch(tab.id)
                  }}
                  className={`group flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors ${
                    tab.id === activeTabId
                      ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {presetTabIds.has(tab.id) ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0 opacity-60"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0 opacity-50"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  <span className="flex-1 truncate font-medium">
                    {tab.name || t('editor.untitled')}
                  </span>
                  {isDirty(tab) && (
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)] opacity-80" />
                  )}
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        handleClose(e, tab.id)
                      }}
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded opacity-0 transition-all hover:bg-red-100 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
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
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="border-t border-gray-100 p-1 dark:border-gray-800">
            <button
              onClick={handleNew}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t('templates.newTab')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── 2. Spalte: Block-Baum ─────────────────────────────────────────────────────

export function BlockTree() {
  const { t } = useTranslation()
  const { removeBlock, duplicateBlock, toggleBlockDisabled, clearBlocks } = useTemplateStore()
  const { selectedBlockId, selectedChildIndex, selectBlock } = useEditorStore()
  const template = useActiveTemplate()
  const [wide, setWide] = useState(true)

  const handleAdd = useAddBlock()
  const handleDuplicate = (id: string) => {
    duplicateBlock(id, nanoid())
  }
  const handleDelete = (id: string) => {
    removeBlock(id)
    if (selectedBlockId === id) selectBlock(null)
  }
  const toggle = () => {
    selectBlock(null)
    setWide((prev) => !prev)
  }

  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-900 ${wide ? 'w-56' : 'w-20'}`}
      aria-label={t('editor.tree.title')}
    >
      {/* Header */}
      <div
        className={`flex flex-shrink-0 items-center gap-1.5 bg-gray-100 dark:bg-gray-800 ${wide ? 'px-3 py-2.5' : 'justify-center py-[13px]'}`}
      >
        <Tooltip label={!wide ? t('editor.tree.title') : ''} side="right" sideOffset={12}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
            style={{ color: 'var(--accent)' }}
          >
            <rect x="9" y="2" width="6" height="4" rx="1" />
            <rect x="2" y="17" width="6" height="4" rx="1" />
            <rect x="16" y="17" width="6" height="4" rx="1" />
            <path d="M12 6v5M12 11H5v6M12 11h7v6" />
          </svg>
        </Tooltip>
        {wide && (
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {t('editor.tree.title')}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-y-auto pb-4 pt-1 ${wide ? 'px-2' : 'px-1'}`}
        onClick={(e) => {
          if (
            !(e.target as HTMLElement).closest('[data-tree-item]') &&
            !(e.target as HTMLElement).closest('[data-tree-root]')
          )
            selectBlock(null)
        }}
      >
        {/* Root node */}
        {wide ? (
          <div
            className={`group flex cursor-pointer items-center gap-1 rounded px-1 py-1 text-sm transition-colors ${
              selectedBlockId === '__template__'
                ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            data-tree-root
            onClick={() => {
              selectBlock(selectedBlockId === '__template__' ? null : '__template__')
            }}
          >
            <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
              </svg>
            </span>
            <span className="flex-1 truncate text-sm">{template.name || t('editor.untitled')}</span>
            {template.blocks.length > 0 && (
              <Tooltip label={t('editor.tree.clearBlocks')} side="bottom">
                <button
                  className="flex-shrink-0 hidden group-hover:flex items-center justify-center rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-400 dark:text-gray-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearBlocks()
                    selectBlock(null)
                  }}
                  aria-label={t('editor.tree.clearBlocks')}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="9" />
                    <rect x="4" y="9" width="16" height="3" rx="1" />
                    <line x1="6" y1="12" x2="5" y2="20" />
                    <line x1="9" y1="12" x2="8.5" y2="20" />
                    <line x1="12" y1="12" x2="12" y2="20" />
                    <line x1="15" y1="12" x2="15.5" y2="20" />
                    <line x1="18" y1="12" x2="19" y2="20" />
                  </svg>
                </button>
              </Tooltip>
            )}
          </div>
        ) : (
          <Tooltip label={template.name || t('editor.untitled')} side="right">
            <div
              className={`flex h-7 cursor-pointer items-center rounded px-2 transition-colors ${
                selectedBlockId === '__template__'
                  ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
                  : 'text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800'
              }`}
              data-tree-root
              onClick={() => {
                selectBlock(selectedBlockId === '__template__' ? null : '__template__')
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
              </svg>
            </div>
          </Tooltip>
        )}

        {/* Block rows */}
        <Droppable droppableId="tree" type="block">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`transition-colors ${wide ? 'ml-4' : 'ml-2'} ${snapshot.isDraggingOver ? 'bg-[color-mix(in_srgb,var(--accent)_4%,transparent)]' : ''}`}
            >
              {template.blocks.map((block, index) => (
                <TreeRow
                  key={block.id}
                  block={block}
                  index={index}
                  wide={wide}
                  selectedBlockId={selectedBlockId}
                  hasChildSelected={selectedChildIndex !== null && selectedBlockId === block.id}
                  onSelect={selectBlock}
                  onDuplicate={handleDuplicate}
                  onToggleDisabled={toggleBlockDisabled}
                  onDelete={handleDelete}
                >
                  <TreeChildRows block={block} wide={wide} />
                </TreeRow>
              ))}
              {template.blocks.length === 0 &&
                !snapshot.isDraggingOver &&
                (wide ? (
                  <button
                    onClick={() => {
                      handleAdd(PALETTE_ITEMS[0].type)
                    }}
                    className="mx-1 mt-1 w-[calc(100%-8px)] cursor-pointer rounded-lg border border-dashed border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] px-3 py-4 text-center transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                      {t('editor.tree.empty')}
                    </p>
                  </button>
                ) : (
                  <Tooltip label={t('editor.tree.empty')} side="right">
                    <button
                      onClick={() => {
                        handleAdd(PALETTE_ITEMS[0].type)
                      }}
                      className="mx-1 mt-1 flex w-[calc(100%-8px)] cursor-pointer items-center justify-center rounded-lg border border-dashed border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] py-3 text-gray-400 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] dark:text-gray-500"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </Tooltip>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Toggle button */}
      <div className={`flex flex-shrink-0 py-1 ${wide ? 'justify-end px-1' : 'justify-center'}`}>
        <Tooltip label={wide ? t('editor.tree.collapse') : t('editor.tree.expand')} side="right">
          <button
            onClick={toggle}
            aria-label={wide ? t('editor.tree.collapse') : t('editor.tree.expand')}
            className="flex items-center justify-center rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {wide ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
            </svg>
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
