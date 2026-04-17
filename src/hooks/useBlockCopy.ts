import { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useEditorStore, useTemplateStore } from '@/store'
import type { EmailBlock } from '@/types'

// Module-level clipboard — persists across tab switches within the same app session
let clipboardBlock: EmailBlock | null = null

function deepCopyWithNewIds(block: EmailBlock): EmailBlock {
  if (block.type === 'columns') {
    return {
      ...block,
      id: nanoid(),
      props: {
        ...block.props,
        columnBlocks:
          (block.props['columnBlocks'] as EmailBlock[][] | undefined)?.map((col) =>
            col.map((cb) => ({ ...cb, id: nanoid(), props: { ...cb.props } })),
          ) ?? [],
      },
    }
  }
  return { ...block, id: nanoid(), props: { ...block.props } }
}

function isEditableTarget(): boolean {
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

function findBlock(
  tabs: ReturnType<typeof useTemplateStore.getState>['tabs'],
  activeTabId: string,
  id: string,
): EmailBlock | undefined {
  const activeTab = tabs.find((t) => t.id === activeTabId)
  if (!activeTab) return undefined
  const top = activeTab.blocks.find((b) => b.id === id)
  if (top) return top
  for (const b of activeTab.blocks) {
    if (b.type !== 'columns') continue
    const cols = b.props['columnBlocks'] as EmailBlock[][] | undefined
    if (!cols) continue
    for (const col of cols) {
      const found = col.find((cb) => cb.id === id)
      if (found) return found
    }
  }
  return undefined
}

export function useBlockCopy() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId)
  const pasteBlock = useTemplateStore((s) => s.pasteBlock)
  const removeBlock = useTemplateStore((s) => s.removeBlock)
  const updateBlock = useTemplateStore((s) => s.updateBlock)
  const tabs = useTemplateStore((s) => s.tabs)
  const activeTabId = useTemplateStore((s) => s.activeTabId)
  const selectBlock = useEditorStore((s) => s.selectBlock)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (isEditableTarget()) return

      if (e.key === 'c') {
        if (!selectedBlockId) return
        const found = findBlock(tabs, activeTabId, selectedBlockId)
        if (found) {
          clipboardBlock = found
          e.preventDefault()
        }
      }

      if (e.key === 'v') {
        if (!clipboardBlock) return
        e.preventDefault()
        const copy = deepCopyWithNewIds(clipboardBlock)
        pasteBlock(copy, selectedBlockId)
        selectBlock(copy.id)
      }

      if (e.key === 'x') {
        if (!selectedBlockId) return
        const found = findBlock(tabs, activeTabId, selectedBlockId)
        if (found) {
          clipboardBlock = found
          e.preventDefault()
          selectBlock(null)
          removeBlock(selectedBlockId)
        }
      }

      if (e.key === 'i') {
        if (!selectedBlockId) return
        e.preventDefault()
        const found = findBlock(tabs, activeTabId, selectedBlockId)
        if (found) updateBlock(selectedBlockId, { disabled: !found.disabled })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedBlockId, tabs, activeTabId, pasteBlock, removeBlock, updateBlock, selectBlock])
}
