import { create } from 'zustand'
import type { PreviewMode } from '@/types'

export type ViewMode = 'editor' | 'preview'

interface EditorState {
  selectedBlockId: string | null
  selectedChildIndex: number | null
  selectedColumnIndex: number | null
  tabPreviewModes: Record<string, PreviewMode>
  tabSavedAt: Record<string, string>
  presetTabIds: Set<string>
  expandedColumnIds: Set<string>
  draggingSourceId: string | null
  draggingBlockType: string | null
  // Actions
  selectBlock: (id: string | null) => void
  selectChild: (index: number | null) => void
  selectColumn: (blockId: string, colIndex: number) => void
  setPreviewMode: (tabId: string, mode: PreviewMode) => void
  markSaved: (tabId: string, updatedAt: string) => void
  markAsPreset: (tabId: string) => void
  unmarkAsPreset: (tabId: string) => void
  toggleColumnExpand: (id: string) => void
  setDragging: (sourceId: string | null, blockType: string | null) => void
}

export const useEditorStore = create<EditorState>()((set) => ({
  selectedBlockId: null,
  selectedChildIndex: null,
  selectedColumnIndex: null,
  tabPreviewModes: {},
  tabSavedAt: {},
  presetTabIds: new Set(),
  expandedColumnIds: new Set(),
  draggingSourceId: null,
  draggingBlockType: null,

  selectBlock: (id) => {
    set({ selectedBlockId: id, selectedChildIndex: null, selectedColumnIndex: null })
  },
  selectChild: (index) => {
    set({ selectedChildIndex: index, selectedColumnIndex: null })
  },
  selectColumn: (blockId, colIndex) => {
    set({ selectedBlockId: blockId, selectedChildIndex: colIndex, selectedColumnIndex: colIndex })
  },
  setDragging: (sourceId, blockType) => {
    set({ draggingSourceId: sourceId, draggingBlockType: blockType })
  },

  setPreviewMode: (tabId, mode) => {
    set((state) => ({ tabPreviewModes: { ...state.tabPreviewModes, [tabId]: mode } }))
  },

  markSaved: (tabId, updatedAt) => {
    set((state) => ({ tabSavedAt: { ...state.tabSavedAt, [tabId]: updatedAt } }))
  },

  markAsPreset: (tabId) => {
    set((state) => ({ presetTabIds: new Set([...state.presetTabIds, tabId]) }))
  },

  unmarkAsPreset: (tabId) => {
    set((state) => {
      const next = new Set(state.presetTabIds)
      next.delete(tabId)
      return { presetTabIds: next }
    })
  },

  toggleColumnExpand: (id) => {
    set((state) => {
      const next = new Set(state.expandedColumnIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { expandedColumnIds: next }
    })
  },
}))
