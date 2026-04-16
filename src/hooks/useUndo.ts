import { useEffect } from 'react'
import { useTemplateStore } from '@/store'

export function useUndo() {
  const undo = useTemplateStore((s) => s.undo)
  const redo = useTemplateStore((s) => s.redo)
  const activeTabId = useTemplateStore((s) => s.activeTabId)
  const history = useTemplateStore((s) => s.tabHistories[s.activeTabId])

  const canUndo = (history?.past.length ?? 0) > 0
  const canRedo = (history?.future.length ?? 0) > 0

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  // Expose activeTabId so callers know which tab's history is shown
  return { undo, redo, canUndo, canRedo, activeTabId }
}
