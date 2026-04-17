import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { EmailTemplate, EmailBlock, BlockType, TemplateSettings } from '@/types'
import { DEFAULT_TEMPLATE_SETTINGS, DEFAULT_BLOCK_PROPS } from '@/constants'
import i18n from '@/i18n'

// ── Per-tab undo/redo history ──────────────────────────────────────────────────

interface TabHistory {
  past: EmailTemplate[]
  future: EmailTemplate[]
}

const HISTORY_LIMIT = 50

/** Snapshot the active tab into its history stack before a mutation. */
const recordHistory = (state: TemplateState): Record<string, TabHistory> => {
  const activeTab = state.tabs.find((t) => t.id === state.activeTabId)
  if (!activeTab) return state.tabHistories
  const old = state.tabHistories[state.activeTabId] ?? { past: [], future: [] }
  return {
    ...state.tabHistories,
    [state.activeTabId]: {
      past: [...old.past.slice(-(HISTORY_LIMIT - 1)), activeTab],
      future: [],
    },
  }
}

// ── Store interface ────────────────────────────────────────────────────────────

interface TemplateState {
  tabs: EmailTemplate[]
  activeTabId: string
  tabHistories: Record<string, TabHistory>

  // Tab management
  openNewTab: () => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  reorderTabs: (startIndex: number, endIndex: number) => void

  // Undo / redo
  undo: () => void
  redo: () => void
  clearHistory: (tabId?: string) => void

  // Template mutations (always on the active tab; all record history)
  setTemplateName: (name: string) => void
  updateSettings: (settings: Partial<TemplateSettings>) => void
  addBlock: (type: BlockType, index?: number) => void
  clearBlocks: () => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, updates: Partial<Omit<EmailBlock, 'id' | 'type'>>) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  addBlockToColumn: (
    columnBlockId: string,
    columnIndex: number,
    type: BlockType,
    index?: number,
  ) => void
  removeBlockFromColumn: (columnBlockId: string, columnIndex: number, blockId: string) => void
  reorderBlocksInColumn: (
    columnBlockId: string,
    columnIndex: number,
    startIndex: number,
    endIndex: number,
  ) => void
  moveBlockBetweenColumns: (
    columnBlockId: string,
    srcColIndex: number,
    srcIndex: number,
    destColIndex: number,
    destIndex: number,
  ) => void
  moveBlockToColumn: (
    canvasIndex: number,
    columnBlockId: string,
    columnIndex: number,
    insertIdx: number,
  ) => void
  moveBlockFromColumn: (
    columnBlockId: string,
    columnIndex: number,
    blockIndex: number,
    canvasIndex: number,
  ) => void
  reorderBlockChildren: (blockId: string, startIndex: number, endIndex: number) => void
  duplicateBlockChild: (blockId: string, index: number) => void
  toggleBlockChildDisabled: (blockId: string, index: number) => void
  removeBlockChild: (blockId: string, index: number) => void
  toggleBlockDisabled: (id: string) => void
  duplicateBlock: (id: string, newId: string) => void
  pasteBlock: (block: EmailBlock, afterId: string | null) => void
  loadTemplate: (template: EmailTemplate) => void
  resetTemplate: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

let templateCounter = 1

const createDefaultTemplate = (): EmailTemplate => ({
  id: nanoid(),
  name: `${i18n.t('common.template')} ${templateCounter++}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: { ...DEFAULT_TEMPLATE_SETTINGS },
  blocks: [],
})

const initialTemplate = createDefaultTemplate()

const buildBlockProps = (type: BlockType): Record<string, unknown> => {
  const props: Record<string, unknown> = {
    ...(DEFAULT_BLOCK_PROPS[type] as Record<string, unknown>),
  }
  if (type === 'columns') {
    const count = Math.min(Math.max(Number(props['columns'] ?? 2), 1), 3)
    props['columnBlocks'] = Array.from({ length: count }, (): EmailBlock[] => [])
  }
  if (type === 'text') props['content'] = i18n.t('editor.blocks.textPlaceholder')
  if (type === 'hero') {
    props['line1Text'] = i18n.t('editor.properties.heroHeadlinePlaceholder')
    props['line2Text'] = i18n.t('editor.properties.heroSubheadlinePlaceholder')
  }
  if (type === 'button') props['text'] = i18n.t('editor.properties.buttonTextPlaceholder')
  if (type === 'quote') {
    props['text'] = i18n.t('editor.properties.quotePlaceholder')
    props['author'] = i18n.t('editor.properties.authorPlaceholder')
  }
  if (type === 'countdown') {
    props['labelDays'] = i18n.t('editor.blocks.countdownDays')
    props['labelHours'] = i18n.t('editor.blocks.countdownHours')
    props['labelMinutes'] = i18n.t('editor.blocks.countdownMinutes')
    props['labelSeconds'] = i18n.t('editor.blocks.countdownSeconds')
  }
  if (type === 'accordion') {
    const q = i18n.t('editor.blocks.accordionQuestion')
    const a = i18n.t('editor.blocks.accordionAnswer')
    props['items'] = JSON.stringify([
      { question: `${q} 1`, answer: `${a} 1` },
      { question: `${q} 2`, answer: `${a} 2` },
    ])
  }
  return props
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useTemplateStore = create<TemplateState>()((set) => ({
  tabs: [initialTemplate],
  activeTabId: initialTemplate.id,
  tabHistories: {},

  // ── Tab management ──────────────────────────────────────────────────────────

  openNewTab: () => {
    set((state) => {
      const t = createDefaultTemplate()
      return { tabs: [...state.tabs, t], activeTabId: t.id }
    })
  },

  closeTab: (id) => {
    set((state) => {
      if (state.tabs.length <= 1) return state
      const idx = state.tabs.findIndex((t) => t.id === id)
      const newTabs = state.tabs.filter((t) => t.id !== id)
      const newActiveId =
        state.activeTabId === id
          ? (newTabs[Math.max(0, idx - 1)]?.id ?? newTabs[0].id)
          : state.activeTabId
      const { [id]: __removed, ...newHistories } = state.tabHistories
      return { tabs: newTabs, activeTabId: newActiveId, tabHistories: newHistories }
    })
  },

  setActiveTab: (id) => {
    set({ activeTabId: id })
  },

  reorderTabs: (startIndex, endIndex) => {
    set((state) => {
      const tabs = [...state.tabs]
      const [removed] = tabs.splice(startIndex, 1)
      if (removed) tabs.splice(endIndex, 0, removed)
      return { tabs }
    })
  },

  // ── Undo / redo ─────────────────────────────────────────────────────────────

  undo: () => {
    set((state) => {
      const history = state.tabHistories[state.activeTabId]
      if (!history?.past.length) return state
      const past = [...history.past]
      const prevTab = past.pop()!
      const currentTab = state.tabs.find((t) => t.id === state.activeTabId)!
      return {
        tabs: state.tabs.map((t) => (t.id === state.activeTabId ? prevTab : t)),
        tabHistories: {
          ...state.tabHistories,
          [state.activeTabId]: { past, future: [currentTab, ...history.future] },
        },
      }
    })
  },

  redo: () => {
    set((state) => {
      const history = state.tabHistories[state.activeTabId]
      if (!history?.future.length) return state
      const future = [...history.future]
      const nextTab = future.shift()!
      const currentTab = state.tabs.find((t) => t.id === state.activeTabId)!
      return {
        tabs: state.tabs.map((t) => (t.id === state.activeTabId ? nextTab : t)),
        tabHistories: {
          ...state.tabHistories,
          [state.activeTabId]: { past: [...history.past, currentTab], future },
        },
      }
    })
  },

  clearHistory: (tabId) => {
    set((state) => ({
      tabHistories: {
        ...state.tabHistories,
        [tabId ?? state.activeTabId]: { past: [], future: [] },
      },
    }))
  },

  // ── Template mutations ──────────────────────────────────────────────────────

  setTemplateName: (name) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) =>
        t.id === state.activeTabId ? { ...t, name, updatedAt: new Date().toISOString() } : t,
      ),
    }))
  },

  updateSettings: (settings) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) =>
        t.id === state.activeTabId
          ? { ...t, settings: { ...t.settings, ...settings }, updatedAt: new Date().toISOString() }
          : t,
      ),
    }))
  },

  addBlock: (type, index) => {
    set((state) => {
      const newBlock: EmailBlock = { id: nanoid(), type, props: buildBlockProps(type) }
      return {
        tabHistories: recordHistory(state),
        tabs: state.tabs.map((t) => {
          if (t.id !== state.activeTabId) return t
          const blocks = [...t.blocks]
          if (index !== undefined) blocks.splice(index, 0, newBlock)
          else blocks.push(newBlock)
          return { ...t, blocks, updatedAt: new Date().toISOString() }
        }),
      }
    })
  },

  toggleBlockDisabled: (id) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => (b.id === id ? { ...b, disabled: !b.disabled } : b)),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  clearBlocks: () => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) =>
        t.id !== state.activeTabId ? t : { ...t, blocks: [], updatedAt: new Date().toISOString() },
      ),
    }))
  },

  removeBlock: (id) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        if (t.blocks.some((b) => b.id === id)) {
          return {
            ...t,
            blocks: t.blocks.filter((b) => b.id !== id),
            updatedAt: new Date().toISOString(),
          }
        }
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.type !== 'columns') return b
            const cols = b.props['columnBlocks'] as EmailBlock[][] | undefined
            if (!cols) return b
            return {
              ...b,
              props: {
                ...b.props,
                columnBlocks: cols.map((col) => col.filter((cb) => cb.id !== id)),
              },
            }
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        if (t.blocks.some((b) => b.id === id)) {
          return {
            ...t,
            blocks: t.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
            updatedAt: new Date().toISOString(),
          }
        }
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.type !== 'columns') return b
            const cols = b.props['columnBlocks'] as EmailBlock[][] | undefined
            if (!cols) return b
            return {
              ...b,
              props: {
                ...b.props,
                columnBlocks: cols.map((col) =>
                  col.map((cb) => (cb.id === id ? { ...cb, ...updates } : cb)),
                ),
              },
            }
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  reorderBlocks: (startIndex, endIndex) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        const blocks = [...t.blocks]
        const [removed] = blocks.splice(startIndex, 1)
        if (removed) blocks.splice(endIndex, 0, removed)
        return { ...t, blocks, updatedAt: new Date().toISOString() }
      }),
    }))
  },

  addBlockToColumn: (columnBlockId, columnIndex, type, index) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== columnBlockId) return b
            const colCount = Math.min(Math.max(Number(b.props['columns'] ?? 2), 1), 3)
            const existing =
              (b.props['columnBlocks'] as EmailBlock[][] | undefined) ??
              Array.from({ length: colCount }, (): EmailBlock[] => [])
            const cols = existing.map((col) => [...col])
            const newBlock: EmailBlock = { id: nanoid(), type, props: buildBlockProps(type) }
            const col = cols[columnIndex] ?? []
            if (index !== undefined) col.splice(index, 0, newBlock)
            else col.push(newBlock)
            cols[columnIndex] = col
            return { ...b, props: { ...b.props, columnBlocks: cols } }
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  removeBlockFromColumn: (columnBlockId, columnIndex, blockId) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== columnBlockId) return b
            const cols = (b.props['columnBlocks'] as EmailBlock[][]).map((col, i) =>
              i === columnIndex ? col.filter((cb) => cb.id !== blockId) : col,
            )
            return { ...b, props: { ...b.props, columnBlocks: cols } }
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  reorderBlocksInColumn: (columnBlockId, columnIndex, startIndex, endIndex) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== columnBlockId) return b
            const cols = (b.props['columnBlocks'] as EmailBlock[][]).map((col, i) => {
              if (i !== columnIndex) return col
              const next = [...col]
              const [removed] = next.splice(startIndex, 1)
              if (removed) next.splice(endIndex, 0, removed)
              return next
            })
            return { ...b, props: { ...b.props, columnBlocks: cols } }
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  reorderBlockChildren: (blockId, startIndex, endIndex) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== blockId) return b
            if (b.type === 'accordion') {
              let items: unknown[]
              try {
                items = JSON.parse(String(b.props['items'] ?? '[]')) as unknown[]
              } catch {
                items = []
              }
              const next = [...items]
              const [removed] = next.splice(startIndex, 1)
              if (removed !== undefined) next.splice(endIndex, 0, removed)
              return { ...b, props: { ...b.props, items: JSON.stringify(next) } }
            }
            if (b.type === 'columns') {
              const cols = ((b.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []).map(
                (col) => [...col],
              )
              const colProps = (
                (Array.isArray(b.props['columnProps']) ? b.props['columnProps'] : []) as Record<
                  string,
                  string
                >[]
              ).map((p) => ({ ...p }))
              const [removedCol] = cols.splice(startIndex, 1)
              const [removedProps] = colProps.splice(startIndex, 1)
              if (removedCol) cols.splice(endIndex, 0, removedCol)
              if (removedProps) colProps.splice(endIndex, 0, removedProps)
              return { ...b, props: { ...b.props, columnBlocks: cols, columnProps: colProps } }
            }
            return b
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  duplicateBlockChild: (blockId, index) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== blockId) return b
            if (b.type === 'accordion') {
              let items: unknown[]
              try {
                items = JSON.parse(String(b.props['items'] ?? '[]')) as unknown[]
              } catch {
                items = []
              }
              const next = [...items]
              next.splice(index + 1, 0, { ...(items[index] as object) })
              return { ...b, props: { ...b.props, items: JSON.stringify(next) } }
            }
            if (b.type === 'columns') {
              const cols = ((b.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []).map(
                (col) => [...col],
              )
              const colProps = (
                (Array.isArray(b.props['columnProps']) ? b.props['columnProps'] : []) as Record<
                  string,
                  string
                >[]
              ).map((p) => ({ ...p }))
              if (cols[index]) cols.splice(index + 1, 0, [...cols[index]])
              if (colProps[index]) {
                // cols already had the duplicate spliced in, so subtract 1 to get the pre-duplication count
                const usedCols = new Set(
                  colProps
                    .slice(0, cols.length - 1)
                    .map((cp) => cp['col'])
                    .filter(Boolean),
                )
                let n = 1
                while (usedCols.has(String(n))) n++
                colProps.splice(index + 1, 0, { ...colProps[index], col: String(n) })
              }
              const newCount = Math.min(cols.length, 3)
              return {
                ...b,
                props: {
                  ...b.props,
                  columns: String(newCount),
                  columnBlocks: cols.slice(0, newCount),
                  columnProps: colProps.slice(0, newCount),
                },
              }
            }
            return b
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  toggleBlockChildDisabled: (blockId, index) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== blockId) return b
            if (b.type === 'accordion') {
              let items: { disabled?: boolean }[]
              try {
                items = JSON.parse(String(b.props['items'] ?? '[]')) as { disabled?: boolean }[]
              } catch {
                items = []
              }
              const next = items.map((it, i) =>
                i === index ? { ...it, disabled: !it.disabled } : it,
              )
              return { ...b, props: { ...b.props, items: JSON.stringify(next) } }
            }
            if (b.type === 'columns') {
              const colProps = (
                (Array.isArray(b.props['columnProps']) ? b.props['columnProps'] : []) as Record<
                  string,
                  string
                >[]
              ).map((p) => ({ ...p }))
              const next = colProps.map((p, i) =>
                i === index ? { ...p, disabled: p['disabled'] === 'true' ? '' : 'true' } : p,
              )
              return { ...b, props: { ...b.props, columnProps: next } }
            }
            return b
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  removeBlockChild: (blockId, index) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== blockId) return b
            if (b.type === 'accordion') {
              let items: unknown[]
              try {
                items = JSON.parse(String(b.props['items'] ?? '[]')) as unknown[]
              } catch {
                items = []
              }
              return {
                ...b,
                props: { ...b.props, items: JSON.stringify(items.filter((_, i) => i !== index)) },
              }
            }
            if (b.type === 'columns') {
              const cols = ((b.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []).map(
                (col) => [...col],
              )
              const colProps = (
                (Array.isArray(b.props['columnProps']) ? b.props['columnProps'] : []) as Record<
                  string,
                  string
                >[]
              ).map((p) => ({ ...p }))
              cols.splice(index, 1)
              colProps.splice(index, 1)
              const newCount = Math.max(cols.length, 1)
              return {
                ...b,
                props: {
                  ...b.props,
                  columns: String(newCount),
                  columnBlocks: cols,
                  columnProps: colProps,
                },
              }
            }
            return b
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  moveBlockBetweenColumns: (columnBlockId, srcColIndex, srcIndex, destColIndex, destIndex) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.id !== columnBlockId) return b
            const cols = (b.props['columnBlocks'] as EmailBlock[][]).map((col) => [...col])
            const srcCol = cols[srcColIndex] ?? []
            const [moved] = srcCol.splice(srcIndex, 1)
            if (!moved) return b
            cols[srcColIndex] = srcCol
            const destCol = cols[destColIndex] ?? []
            destCol.splice(destIndex, 0, moved)
            cols[destColIndex] = destCol
            return { ...b, props: { ...b.props, columnBlocks: cols } }
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  moveBlockToColumn: (canvasIndex, columnBlockId, columnIndex, insertIdx) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        const blocks = [...t.blocks]
        const [moved] = blocks.splice(canvasIndex, 1)
        if (!moved) return t
        const newBlocks = blocks.map((b) => {
          if (b.id !== columnBlockId) return b
          const cols = ((b.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []).map(
            (col) => [...col],
          )
          const col = cols[columnIndex] ?? []
          col.splice(insertIdx, 0, moved)
          cols[columnIndex] = col
          return { ...b, props: { ...b.props, columnBlocks: cols } }
        })
        return { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() }
      }),
    }))
  },

  moveBlockFromColumn: (columnBlockId, columnIndex, blockIndex, canvasIndex) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        let moved: EmailBlock | undefined
        const blocks = t.blocks.map((b) => {
          if (b.id !== columnBlockId) return b
          const cols = ((b.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []).map(
            (col) => [...col],
          )
          const col = cols[columnIndex] ?? []
          ;[moved] = col.splice(blockIndex, 1)
          cols[columnIndex] = col
          return { ...b, props: { ...b.props, columnBlocks: cols } }
        })
        if (!moved) return t
        const newBlocks = [...blocks]
        newBlocks.splice(canvasIndex, 0, moved)
        return { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() }
      }),
    }))
  },

  loadTemplate: (template) => {
    set((state) => {
      const exists = state.tabs.some((t) => t.id === template.id)
      if (exists) return { activeTabId: template.id }
      return { tabs: [...state.tabs, template], activeTabId: template.id }
    })
  },

  duplicateBlock: (id, newId) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        // Top-level block
        const idx = t.blocks.findIndex((b) => b.id === id)
        if (idx !== -1) {
          const orig = t.blocks[idx]
          const copy: EmailBlock = {
            ...orig,
            id: newId,
            props:
              orig.type === 'columns'
                ? {
                    ...orig.props,
                    columnBlocks:
                      (orig.props['columnBlocks'] as EmailBlock[][] | undefined)?.map((col) =>
                        col.map((cb) => ({ ...cb, id: nanoid(), props: { ...cb.props } })),
                      ) ?? [],
                  }
                : { ...orig.props },
          }
          const blocks = [...t.blocks]
          blocks.splice(idx + 1, 0, copy)
          return { ...t, blocks, updatedAt: new Date().toISOString() }
        }
        // Block inside a column
        return {
          ...t,
          blocks: t.blocks.map((b) => {
            if (b.type !== 'columns') return b
            const cols = b.props['columnBlocks'] as EmailBlock[][] | undefined
            if (!cols) return b
            let changed = false
            const newCols = cols.map((col) => {
              const ci = col.findIndex((cb) => cb.id === id)
              if (ci === -1) return col
              changed = true
              const copy: EmailBlock = { ...col[ci], id: newId, props: { ...col[ci].props } }
              const next = [...col]
              next.splice(ci + 1, 0, copy)
              return next
            })
            return changed ? { ...b, props: { ...b.props, columnBlocks: newCols } } : b
          }),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  pasteBlock: (block, afterId) => {
    set((state) => ({
      tabHistories: recordHistory(state),
      tabs: state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t
        // afterId is a top-level block
        const topIdx = afterId ? t.blocks.findIndex((b) => b.id === afterId) : -1
        if (topIdx !== -1) {
          const blocks = [...t.blocks]
          blocks.splice(topIdx + 1, 0, block)
          return { ...t, blocks, updatedAt: new Date().toISOString() }
        }
        // afterId is inside a column
        if (afterId) {
          let pasted = false
          const blocks = t.blocks.map((b) => {
            if (b.type !== 'columns' || pasted) return b
            const cols = b.props['columnBlocks'] as EmailBlock[][] | undefined
            if (!cols) return b
            let changed = false
            const newCols = cols.map((col) => {
              const ci = col.findIndex((cb) => cb.id === afterId)
              if (ci === -1) return col
              changed = true
              pasted = true
              const next = [...col]
              next.splice(ci + 1, 0, block)
              return next
            })
            return changed ? { ...b, props: { ...b.props, columnBlocks: newCols } } : b
          })
          if (pasted) return { ...t, blocks, updatedAt: new Date().toISOString() }
        }
        // Fallback: append to end of canvas
        return { ...t, blocks: [...t.blocks, block], updatedAt: new Date().toISOString() }
      }),
    }))
  },

  resetTemplate: () => {
    set((state) => {
      const blank = createDefaultTemplate()
      return {
        tabHistories: recordHistory(state),
        tabs: state.tabs.map((t) =>
          t.id === state.activeTabId
            ? { ...blank, id: t.id, name: t.name, createdAt: t.createdAt }
            : t,
        ),
      }
    })
  },
}))

// ── Selectors ──────────────────────────────────────────────────────────────────

/** Reactive selector – returns the currently active template. */
export const useActiveTemplate = () =>
  useTemplateStore((state) => state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0])

/** Non-reactive getter for use inside callbacks/timeouts. */
export const getActiveTemplate = () => {
  const state = useTemplateStore.getState()
  return state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0]
}
