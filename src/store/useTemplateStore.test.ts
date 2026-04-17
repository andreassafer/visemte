import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/i18n', () => ({
  default: { t: (key: string) => key },
}))

import { useTemplateStore } from './useTemplateStore'
import type { EmailTemplate, EmailBlock } from '@/types'

// Reset store state before each test
const resetStore = () => {
  useTemplateStore.setState({
    tabs: [],
    activeTabId: '',
    tabHistories: {},
  })
  useTemplateStore.getState().openNewTab()
  const state = useTemplateStore.getState()
  useTemplateStore.setState({ activeTabId: state.tabs[0].id })
}

const getState = () => useTemplateStore.getState()
const getActive = () => {
  const s = getState()
  return s.tabs.find((t) => t.id === s.activeTabId)!
}

describe('useTemplateStore', () => {
  beforeEach(resetStore)

  // ── Tab management ────────────────────────────────────────────────────────

  describe('tab management', () => {
    it('starts with one tab', () => {
      expect(getState().tabs).toHaveLength(1)
    })

    it('openNewTab adds a tab and activates it', () => {
      getState().openNewTab()
      const state = getState()
      expect(state.tabs).toHaveLength(2)
      expect(state.activeTabId).toBe(state.tabs[1].id)
    })

    it('setActiveTab switches the active tab', () => {
      getState().openNewTab()
      const [first] = getState().tabs
      getState().setActiveTab(first.id)
      expect(getState().activeTabId).toBe(first.id)
    })

    it('closeTab removes the tab', () => {
      getState().openNewTab()
      const idToClose = getState().activeTabId
      getState().openNewTab()
      getState().closeTab(idToClose)
      expect(getState().tabs.every((t) => t.id !== idToClose)).toBe(true)
    })

    it('closeTab does not close the last remaining tab', () => {
      const id = getState().activeTabId
      getState().closeTab(id)
      expect(getState().tabs).toHaveLength(1)
    })

    it('closeTab activates the previous tab when closing the active one', () => {
      const firstId = getState().activeTabId
      getState().openNewTab()
      const secondId = getState().activeTabId
      getState().closeTab(secondId)
      expect(getState().activeTabId).toBe(firstId)
    })

    it('closeTab cleans up history for the closed tab', () => {
      getState().addBlock('text')
      const idToClose = getState().activeTabId
      getState().openNewTab()
      getState().closeTab(idToClose)
      expect(getState().tabHistories[idToClose]).toBeUndefined()
    })

    it('reorderTabs moves a tab from startIndex to endIndex', () => {
      getState().openNewTab()
      getState().openNewTab()
      const [a, b, c] = getState().tabs
      getState().reorderTabs(0, 2)
      const reordered = getState().tabs
      expect(reordered[0].id).toBe(b.id)
      expect(reordered[1].id).toBe(c.id)
      expect(reordered[2].id).toBe(a.id)
    })
  })

  // ── Block operations ──────────────────────────────────────────────────────

  describe('addBlock', () => {
    it('appends a block to the active template', () => {
      getState().addBlock('text')
      expect(getActive().blocks).toHaveLength(1)
      expect(getActive().blocks[0].type).toBe('text')
    })

    it('inserts a block at a specified index', () => {
      getState().addBlock('text')
      getState().addBlock('image')
      getState().addBlock('button', 1)
      expect(getActive().blocks[1].type).toBe('button')
    })

    it('assigns a unique id to each block', () => {
      getState().addBlock('text')
      getState().addBlock('text')
      const ids = getActive().blocks.map((b) => b.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('only modifies the active tab', () => {
      const firstId = getState().activeTabId
      getState().openNewTab()
      getState().addBlock('divider')
      const firstTab = getState().tabs.find((t) => t.id === firstId)!
      expect(firstTab.blocks).toHaveLength(0)
    })

    it('records history before adding', () => {
      getState().addBlock('text')
      const history = getState().tabHistories[getState().activeTabId]
      expect(history?.past.length).toBeGreaterThan(0)
    })
  })

  describe('removeBlock', () => {
    it('removes a top-level block by id', () => {
      getState().addBlock('text')
      const id = getActive().blocks[0].id
      getState().removeBlock(id)
      expect(getActive().blocks).toHaveLength(0)
    })

    it('removes a block inside a columns block', () => {
      getState().addBlock('columns')
      const colBlock = getActive().blocks[0]
      getState().addBlockToColumn(colBlock.id, 0, 'text')
      const colBlocks = colBlock.props['columnBlocks'] as EmailBlock[][]
      // Re-read state after addBlockToColumn
      const updatedColBlock = getActive().blocks[0]
      const childId = (updatedColBlock.props['columnBlocks'] as EmailBlock[][])[0][0].id
      getState().removeBlock(childId)
      const finalCol = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0]
      expect(finalCol).toHaveLength(0)
      void colBlocks // used to avoid lint warning
    })
  })

  describe('updateBlock', () => {
    it('updates props of a top-level block', () => {
      getState().addBlock('text')
      const id = getActive().blocks[0].id
      getState().updateBlock(id, { props: { content: 'Updated text' } })
      expect(getActive().blocks[0].props['content']).toBe('Updated text')
    })

    it('updates props of a block inside a columns block', () => {
      getState().addBlock('columns')
      const colBlockId = getActive().blocks[0].id
      getState().addBlockToColumn(colBlockId, 0, 'text')
      const childId = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0][0].id
      getState().updateBlock(childId, { props: { content: 'Column text' } })
      const child = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0][0]
      expect(child.props['content']).toBe('Column text')
    })
  })

  describe('reorderBlocks', () => {
    it('moves a block from one position to another', () => {
      getState().addBlock('text')
      getState().addBlock('image')
      getState().addBlock('button')
      getState().reorderBlocks(0, 2)
      const blocks = getActive().blocks
      expect(blocks[0].type).toBe('image')
      expect(blocks[1].type).toBe('button')
      expect(blocks[2].type).toBe('text')
    })
  })

  describe('duplicateBlock', () => {
    it('duplicates a top-level block and inserts it after the original', () => {
      getState().addBlock('text')
      const origId = getActive().blocks[0].id
      const newId = 'new-duplicate-id'
      getState().duplicateBlock(origId, newId)
      const blocks = getActive().blocks
      expect(blocks).toHaveLength(2)
      expect(blocks[1].id).toBe(newId)
      expect(blocks[1].type).toBe('text')
    })

    it('duplicates a block inside a column', () => {
      getState().addBlock('columns')
      const colBlockId = getActive().blocks[0].id
      getState().addBlockToColumn(colBlockId, 0, 'text')
      const childId = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0][0].id
      getState().duplicateBlock(childId, 'dup-child')
      const col = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0]
      expect(col).toHaveLength(2)
      expect(col[1].id).toBe('dup-child')
    })
  })

  // ── Template mutations ────────────────────────────────────────────────────

  describe('setTemplateName', () => {
    it('updates the name of the active template', () => {
      getState().setTemplateName('My Newsletter')
      expect(getActive().name).toBe('My Newsletter')
    })
  })

  describe('updateSettings', () => {
    it('merges new settings into existing settings', () => {
      getState().updateSettings({ backgroundColor: '#123456', contentWidth: 800 })
      expect(getActive().settings.backgroundColor).toBe('#123456')
      expect(getActive().settings.contentWidth).toBe(800)
    })

    it('does not overwrite unrelated settings fields', () => {
      const originalFontFamily = getActive().settings.fontFamily
      getState().updateSettings({ backgroundColor: '#ff0000' })
      expect(getActive().settings.fontFamily).toBe(originalFontFamily)
    })
  })

  describe('resetTemplate', () => {
    it('clears all blocks', () => {
      getState().addBlock('text')
      getState().addBlock('image')
      getState().resetTemplate()
      expect(getActive().blocks).toHaveLength(0)
    })

    it('preserves the tab id and name after reset', () => {
      const originalId = getActive().id
      getState().setTemplateName('Keep me')
      getState().resetTemplate()
      expect(getActive().id).toBe(originalId)
      expect(getActive().name).toBe('Keep me')
    })
  })

  describe('loadTemplate', () => {
    it('opens a loaded template as a new tab', () => {
      const tpl: EmailTemplate = {
        id: 'loaded-id',
        name: 'Loaded Template',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        settings: {
          backgroundColor: '#ffffff',
          contentWidth: 600,
          fontFamily: 'Arial',
          fontSize: 14,
          fontColor: '#000000',
          lineHeight: 1.5,
        },
        blocks: [],
      }
      getState().loadTemplate(tpl)
      expect(getState().tabs.some((t) => t.id === 'loaded-id')).toBe(true)
      expect(getState().activeTabId).toBe('loaded-id')
    })
  })

  // ── Undo / redo ───────────────────────────────────────────────────────────

  describe('undo / redo', () => {
    it('undo restores the state before the last action', () => {
      getState().addBlock('text')
      expect(getActive().blocks).toHaveLength(1)
      getState().undo()
      expect(getActive().blocks).toHaveLength(0)
    })

    it('redo re-applies an undone action', () => {
      getState().addBlock('text')
      getState().undo()
      getState().redo()
      expect(getActive().blocks).toHaveLength(1)
    })

    it('undo does nothing when history is empty', () => {
      getState().undo()
      expect(getActive().blocks).toHaveLength(0)
    })

    it('redo does nothing when future is empty', () => {
      getState().addBlock('text')
      getState().redo()
      expect(getActive().blocks).toHaveLength(1)
    })

    it('redo is cleared after a new action following an undo', () => {
      getState().addBlock('text')
      getState().undo()
      getState().addBlock('image')
      getState().redo()
      expect(getActive().blocks[0].type).toBe('image')
    })

    it('multiple undos traverse the history stack correctly', () => {
      getState().addBlock('text')
      getState().addBlock('image')
      getState().undo()
      expect(getActive().blocks).toHaveLength(1)
      getState().undo()
      expect(getActive().blocks).toHaveLength(0)
    })

    it('clearHistory empties past and future for the active tab', () => {
      getState().addBlock('text')
      getState().clearHistory()
      getState().undo()
      expect(getActive().blocks).toHaveLength(1)
    })
  })

  // ── Column operations ─────────────────────────────────────────────────────

  describe('column operations', () => {
    it('addBlockToColumn inserts a block into the correct column', () => {
      getState().addBlock('columns')
      const colBlockId = getActive().blocks[0].id
      getState().addBlockToColumn(colBlockId, 1, 'image')
      const cols = getActive().blocks[0].props['columnBlocks'] as EmailBlock[][]
      expect(cols[0]).toHaveLength(0)
      expect(cols[1]).toHaveLength(1)
      expect(cols[1][0].type).toBe('image')
    })

    it('removeBlockFromColumn removes the correct block', () => {
      getState().addBlock('columns')
      const colBlockId = getActive().blocks[0].id
      getState().addBlockToColumn(colBlockId, 0, 'text')
      const childId = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0][0].id
      getState().removeBlockFromColumn(colBlockId, 0, childId)
      const cols = getActive().blocks[0].props['columnBlocks'] as EmailBlock[][]
      expect(cols[0]).toHaveLength(0)
    })

    it('reorderBlocksInColumn moves blocks within the same column', () => {
      getState().addBlock('columns')
      const colBlockId = getActive().blocks[0].id
      getState().addBlockToColumn(colBlockId, 0, 'text')
      getState().addBlockToColumn(colBlockId, 0, 'image')
      getState().reorderBlocksInColumn(colBlockId, 0, 0, 1)
      const col = (getActive().blocks[0].props['columnBlocks'] as EmailBlock[][])[0]
      expect(col[0].type).toBe('image')
      expect(col[1].type).toBe('text')
    })

    it('moveBlockBetweenColumns moves a block from one column to another', () => {
      getState().addBlock('columns')
      const colBlockId = getActive().blocks[0].id
      getState().addBlockToColumn(colBlockId, 0, 'text')
      getState().moveBlockBetweenColumns(colBlockId, 0, 0, 1, 0)
      const cols = getActive().blocks[0].props['columnBlocks'] as EmailBlock[][]
      expect(cols[0]).toHaveLength(0)
      expect(cols[1]).toHaveLength(1)
      expect(cols[1][0].type).toBe('text')
    })
  })
})
