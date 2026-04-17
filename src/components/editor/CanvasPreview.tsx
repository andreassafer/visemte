import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { compileMjml } from '@/services'
import { templateToMjml } from '@/utils'
import { useEditorStore, useTemplateStore } from '@/store'
import type { EmailTemplate, EmailBlock } from '@/types'

const MOBILE_WIDTH = 375
const COMPILE_DEBOUNCE_MS = 400

// Script injected into the iframe HTML so clicks are forwarded via postMessage.
// This works reliably in Tauri's WKWebView where contentDocument access is restricted.
const CLICK_BRIDGE_SCRIPT = `
<script>
(function(){
  var COL_RE = /^col([a-zA-Z0-9]{1,10})i([0-2])$/;
  document.addEventListener('click', function(e){
    e.preventDefault();
    var el = e.target;
    while (el) {
      var classes = el.className ? el.className.split(' ') : [];
      var col = classes.find(function(c){ return COL_RE.test(c); });
      if (col) { var m = COL_RE.exec(col); window.parent.postMessage({type:'blk-col',prefix:m[1],colIndex:Number(m[2])}, '*'); return; }
      var blk = classes.find(function(c){ return c.indexOf('blk-') === 0; });
      if (blk) { window.parent.postMessage({type:'blk-click',cls:blk}, '*'); return; }
      el = el.parentElement;
    }
    window.parent.postMessage({type:'blk-deselect'}, '*');
  });
  var s = document.createElement('style');
  s.textContent = '[class*="blk-"]{cursor:pointer!important}[class*="coli"]{cursor:pointer!important}';
  document.head && document.head.appendChild(s);
})();
</script>`

interface Props {
  template: EmailTemplate
  previewMode: 'desktop' | 'mobile'
}

interface OverlayRect {
  top: number
  left: number
  width: number
  height: number
}

export function CanvasPreview({ template, previewMode }: Props) {
  const { t } = useTranslation()
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId)
  const selectedColumnIndex = useEditorStore((s) => s.selectedColumnIndex)
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debouncedTemplate, setDebouncedTemplate] = useState(template)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const iframeBodyRoRef = useRef<ResizeObserver | null>(null)
  const [containerHeight, setContainerHeight] = useState(600)
  const [overlayRect, setOverlayRect] = useState<OverlayRect | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTemplate(template)
    }, COMPILE_DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [template])

  const compile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const mjml = templateToMjml(debouncedTemplate, previewMode === 'mobile')
      const result = await compileMjml(mjml)
      if (result.errors.length > 0) setError(result.errors.map((e) => e.message).join('\n'))
      // Inject click bridge script just before </body>
      const injected = result.html.replace('</body>', `${CLICK_BRIDGE_SCRIPT}</body>`)
      setHtml(injected)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errors.mjmlCompile'))
    } finally {
      setLoading(false)
    }
  }, [debouncedTemplate, previewMode, t])

  useEffect(() => {
    void compile()
  }, [compile])

  const updateOverlay = useCallback(() => {
    if (!selectedBlockId || !iframeRef.current || !containerRef.current) {
      setOverlayRect(null)
      return
    }
    const iframeRect = iframeRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const scrollTop = containerRef.current.scrollTop
    const scrollLeft = containerRef.current.scrollLeft

    if (selectedBlockId === '__template__') {
      setOverlayRect(null)
      return
    }

    const doc = iframeRef.current.contentDocument
    if (!doc) {
      setOverlayRect(null)
      return
    }

    // Column selected → use per-column CSS class instead of block-level class
    const sanitized = selectedBlockId.replace(/[^a-zA-Z0-9]/g, '')
    const cls =
      selectedColumnIndex !== null
        ? `col${sanitized.slice(0, 10)}i${selectedColumnIndex}`
        : `blk-${sanitized}`
    const el = doc.querySelector(`.${cls}`)
    if (!el) {
      setOverlayRect(null)
      return
    }

    const blockRect = el.getBoundingClientRect()

    setOverlayRect({
      top: iframeRect.top - containerRect.top + scrollTop + blockRect.top,
      left: iframeRect.left - containerRect.left + scrollLeft + blockRect.left,
      width: blockRect.width,
      height: blockRect.height,
    })
  }, [selectedBlockId, selectedColumnIndex])

  // Handle postMessage events from the iframe click bridge
  useEffect(() => {
    const COL_CLASS_RE = /^col([a-zA-Z0-9]{1,10})i([0-2])$/

    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return
      const { type, cls, prefix, colIndex } = e.data as {
        type: string
        cls?: string
        prefix?: string
        colIndex?: number
      }

      if (type === 'blk-deselect') {
        useEditorStore.getState().selectBlock(null)
        return
      }

      if (type === 'blk-col' && prefix !== undefined && colIndex !== undefined) {
        const { tabs, activeTabId } = useTemplateStore.getState()
        const active = tabs.find((tab) => tab.id === activeTabId)
        const colBlock = active?.blocks.find(
          (b) => b.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) === prefix,
        )
        if (colBlock) {
          const { selectedBlockId, selectedColumnIndex } = useEditorStore.getState()
          if (selectedBlockId === colBlock.id && selectedColumnIndex === colIndex) {
            useEditorStore.getState().selectBlock(null)
          } else {
            useEditorStore.getState().selectColumn(colBlock.id, colIndex)
          }
        }
        return
      }

      if (type === 'blk-click' && cls) {
        // Check column class first
        const colMatch = COL_CLASS_RE.exec(cls)
        if (colMatch) {
          const { tabs, activeTabId } = useTemplateStore.getState()
          const active = tabs.find((tab) => tab.id === activeTabId)
          const colBlock = active?.blocks.find(
            (b) => b.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) === colMatch[1],
          )
          if (colBlock) {
            const { selectedBlockId, selectedColumnIndex } = useEditorStore.getState()
            if (selectedBlockId === colBlock.id && selectedColumnIndex === Number(colMatch[2])) {
              useEditorStore.getState().selectBlock(null)
            } else {
              useEditorStore.getState().selectColumn(colBlock.id, Number(colMatch[2]))
            }
          }
          return
        }

        // Block class (blk-{sanitized})
        if (cls.startsWith('blk-')) {
          const sanitized = cls.slice(4)
          const { tabs, activeTabId } = useTemplateStore.getState()
          const active = tabs.find((tab) => tab.id === activeTabId)
          const block = active?.blocks.find((b) => b.id.replace(/[^a-zA-Z0-9]/g, '') === sanitized)
          if (block) {
            const current = useEditorStore.getState().selectedBlockId
            useEditorStore.getState().selectBlock(current === block.id ? null : block.id)
            return
          }
          // Search column children
          for (const topBlock of active?.blocks ?? []) {
            if (topBlock.type !== 'columns') continue
            const columnBlocks =
              (topBlock.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []
            for (const col of columnBlocks) {
              const childBlock = col.find((b) => b.id.replace(/[^a-zA-Z0-9]/g, '') === sanitized)
              if (childBlock) {
                const current = useEditorStore.getState().selectedBlockId
                useEditorStore
                  .getState()
                  .selectBlock(current === childBlock.id ? null : childBlock.id)
                return
              }
            }
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // Update overlay when selection or compiled HTML changes
  useEffect(() => {
    const t1 = setTimeout(updateOverlay, 50)
    return () => {
      clearTimeout(t1)
    }
  }, [updateOverlay, html])

  // Scroll canvas so the selected block is visible
  useEffect(() => {
    if (!selectedBlockId || selectedBlockId === '__template__') return
    const timer = setTimeout(() => {
      const doc = iframeRef.current?.contentDocument
      if (!doc || !iframeRef.current || !containerRef.current) return
      const sanitized = selectedBlockId.replace(/[^a-zA-Z0-9]/g, '')
      const cls =
        selectedColumnIndex !== null
          ? `col${sanitized.slice(0, 10)}i${selectedColumnIndex}`
          : `blk-${sanitized}`
      const el = doc.querySelector(`.${cls}`)
      if (!el) return
      const blockRect = el.getBoundingClientRect()
      const iframeRect = iframeRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      const scrollTop = containerRef.current.scrollTop
      const pad = 24
      const blockTop = iframeRect.top - containerRect.top + scrollTop + blockRect.top
      const blockBottom = blockTop + blockRect.height
      const visibleTop = scrollTop
      const visibleBottom = scrollTop + containerRef.current.clientHeight
      if (blockTop < visibleTop + pad) {
        containerRef.current.scrollTo({ top: blockTop - pad, behavior: 'smooth' })
      } else if (blockBottom > visibleBottom - pad) {
        containerRef.current.scrollTo({
          top: blockBottom - containerRef.current.clientHeight + pad,
          behavior: 'smooth',
        })
      }
    }, 60)
    return () => {
      clearTimeout(timer)
    }
  }, [selectedBlockId, selectedColumnIndex])

  // Keep overlay in sync while scrolling
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', updateOverlay, { passive: true })
    return () => {
      el.removeEventListener('scroll', updateOverlay)
    }
  }, [updateOverlay])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      setContainerHeight(el.clientHeight)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
    }
  }, [loading])

  // Disconnect iframe body observer on unmount
  useEffect(
    () => () => {
      iframeBodyRoRef.current?.disconnect()
    },
    [],
  )

  const maxWidth = previewMode === 'mobile' ? MOBILE_WIDTH : template.settings.contentWidth

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800">
        <span className="text-sm text-gray-400">{t('common.loading')}</span>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center bg-gray-100 p-6 dark:bg-gray-800">
        <div className="max-w-lg rounded bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <strong>{t('errors.mjmlCompile')}:</strong>
          <pre className="mt-1 whitespace-pre-wrap">{error}</pre>
        </div>
      </main>
    )
  }

  return (
    <main
      ref={containerRef}
      className="relative flex-1 min-h-0 overflow-y-auto p-6 bg-[var(--preview-bg)]"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--preview-dot) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
      onClick={() => {
        useEditorStore.getState().selectBlock(null)
      }}
    >
      <div
        className="mx-auto w-full overflow-hidden shadow transition-all duration-300"
        style={{ maxWidth: `${maxWidth}px` }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={html}
          className="w-full border-0 block"
          title={t('editor.toolbar.preview')}
          sandbox="allow-same-origin allow-scripts"
          style={{ minHeight: `${containerHeight - 48}px`, overflow: 'hidden' }}
          onLoad={(e) => {
            const iframe = e.currentTarget
            const doc = iframe.contentDocument
            if (!doc) return
            const syncHeight = () => {
              const d = iframe.contentDocument
              if (d) iframe.style.height = `${d.documentElement.scrollHeight}px`
            }
            syncHeight()
            // Watch iframe body for height changes (responsive reflow when previewMode changes
            // or when content is updated without a full reload)
            iframeBodyRoRef.current?.disconnect()
            const ro = new ResizeObserver(syncHeight)
            ro.observe(doc.body)
            iframeBodyRoRef.current = ro
            updateOverlay()
          }}
        />
      </div>
      {overlayRect && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 10,
            top: overlayRect.top,
            left: overlayRect.left,
            width: overlayRect.width,
            height: overlayRect.height,
            outline: '2px solid var(--accent)',
            boxShadow: '0 0 10px 2px var(--accent-ring)',
          }}
        />
      )}
    </main>
  )
}
