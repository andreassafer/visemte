import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface TooltipProps {
  label: string
  children: ReactNode
  side?: 'top' | 'right' | 'bottom'
  sideOffset?: number
}

const GAP = 8

export function Tooltip({ label, children, side = 'bottom', sideOffset = GAP }: TooltipProps) {
  const wrapperRef                = useRef<HTMLDivElement>(null)
  const tooltipRef                = useRef<HTMLDivElement>(null)
  const [visible, setVisible]     = useState(false)
  const [pos, setPos]             = useState<{ top: number; left: number } | null>(null)
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── top mode: follow mouse ─────────────────────────────────────────────────
  const [mouse, setMouse]         = useState<{ x: number; y: number } | null>(null)
  const [finalLeft, setFinalLeft] = useState<number | null>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (side === 'top') setMouse({ x: e.clientX, y: e.clientY })
    timerRef.current = setTimeout(() => setVisible(true), 400)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (side === 'top') { setMouse({ x: e.clientX, y: e.clientY }); setFinalLeft(null) }
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
    setMouse(null)
    setFinalLeft(null)
    setPos(null)
  }

  // ── right / bottom mode: anchor to element bounding box ───────────────────
  useLayoutEffect(() => {
    if (!visible || (side !== 'right' && side !== 'bottom') || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    if (side === 'right') {
      setPos({ top: rect.top + rect.height / 2, left: rect.right + sideOffset })
    } else {
      setPos({ top: rect.bottom + sideOffset, left: rect.left + rect.width / 2 })
    }
  }, [visible, side])

  // ── top mode: clamp horizontally within viewport ───────────────────────────
  useLayoutEffect(() => {
    if (!visible || side !== 'top' || !tooltipRef.current || !mouse) return
    const w = tooltipRef.current.getBoundingClientRect().width
    const raw = mouse.x - w / 2
    const clamped = Math.max(GAP, Math.min(raw, window.innerWidth - w - GAP))
    setFinalLeft(clamped)
  }, [visible, side, mouse])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const tooltipNode = (() => {
    if (!visible || !label) return null

    if (side === 'right' || side === 'bottom') {
      if (!pos) return null
      const transform = side === 'right' ? 'translateY(-50%)' : 'translateX(-50%)'
      return (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform,
            zIndex: 99999,
            pointerEvents: 'none',
          }}
          className="whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-md dark:bg-gray-600"
        >
          {label}
        </div>
      )
    }

    // top (default)
    if (!mouse) return null
    return (
      <div
        ref={tooltipRef}
        role="tooltip"
        style={{
          position: 'fixed',
          top: mouse.y - GAP,
          left: finalLeft ?? mouse.x,
          transform: finalLeft != null ? 'translateY(-100%)' : 'translate(-50%, -100%)',
          opacity: finalLeft != null ? 1 : 0,
          zIndex: 99999,
          pointerEvents: 'none',
        }}
        className="whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-md dark:bg-gray-600"
      >
        {label}
      </div>
    )
  })()

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {tooltipNode && createPortal(tooltipNode, document.body)}
    </div>
  )
}
