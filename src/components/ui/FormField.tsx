import { useState, useRef, useEffect, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface FormFieldProps {
  label: string
  children: ReactNode
  htmlFor?: string
}

export function FormField({ label, children, htmlFor }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-gray-500 dark:text-gray-400"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Reusable styled inputs ──────────────────────────────────────────────────

const inputClass =
  'w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-800 outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_var(--accent-ring)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'

type InputProps = InputHTMLAttributes<HTMLInputElement>
export function Input({ className, ...props }: InputProps) {
  return <input className={`${inputClass} ${className ?? ''}`} {...props} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={`${inputClass} ${className ?? ''}`} {...props}>
      {children}
    </select>
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={`${inputClass} min-h-20 resize-y ${className ?? ''}`} {...props} />
}

// ─── Format buttons (B / I / U / S) for textarea fields ──────────────────────

const FORMAT_ITEMS = [
  { open: '<strong>', close: '</strong>', label: 'B', titleKey: 'editor.properties.bold',          cls: 'font-bold' },
  { open: '<em>',     close: '</em>',     label: 'I', titleKey: 'editor.properties.italic',        cls: 'italic' },
  { open: '<u>',      close: '</u>',      label: 'U', titleKey: 'editor.properties.underline',     cls: 'underline' },
  { open: '<s>',      close: '</s>',      label: 'S', titleKey: 'editor.properties.strikethrough', cls: 'line-through' },
] as const

interface FormatButtonsProps {
  id: string
  onWrap: (newValue: string) => void
}

export function FormatButtons({ id, onWrap }: FormatButtonsProps) {
  const { t } = useTranslation()

  const handle = (open: string, close: string) => {
    const el = document.getElementById(id) as HTMLTextAreaElement | null
    if (!el) return
    const s = el.selectionStart, e = el.selectionEnd
    const newVal = el.value.slice(0, s) + open + el.value.slice(s, e) + close + el.value.slice(e)
    onWrap(newVal)
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = s + open.length
      el.selectionEnd   = e + open.length
    })
  }

  return (
    <div className="flex gap-0.5">
      {FORMAT_ITEMS.map(({ open, close, label, titleKey, cls }) => (
        <button
          key={label}
          type="button"
          title={t(titleKey)}
          onMouseDown={(ev) => { ev.preventDefault(); handle(open, close) }}
          className={`flex h-5 w-5 items-center justify-center rounded text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 ${cls}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** Select that prepends a "-Global-" option (value = ''), with optional custom label */
interface InheritSelectProps extends SelectProps {
  inheritLabel?: string
}
export function InheritSelect({ className, inheritLabel, children, ...props }: InheritSelectProps) {
  const { t } = useTranslation()
  return (
    <Select className={className} {...props}>
      <option value="">{inheritLabel ?? t('common.global')}</option>
      {children}
    </Select>
  )
}

/**
 * ColorInput that can be "unset" (empty string = inherit global).
 * Shows an activate-button when empty, shows picker + reset button when set.
 */
interface OptionalColorInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  activateLabel?: string
}
export function OptionalColorInput({ id, value, onChange, activateLabel }: OptionalColorInputProps) {
  const { t } = useTranslation()
  const label = activateLabel ?? t('common.global')
  if (!value) {
    return (
      <button
        type="button"
        onClick={() => onChange('#000000')}
        className="w-full rounded border border-dashed border-gray-200 py-1 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 dark:border-gray-600 dark:hover:border-gray-500"
      >
        {label}
      </button>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <ColorInput
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={() => onChange('')}
        className="shrink-0 rounded px-1.5 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        title={label}
      >
        ↩ {label}
      </button>
    </div>
  )
}

// ─── Color picker utilities ───────────────────────────────────────────────────

function isValidHex(s: string): s is string { return /^#[0-9a-fA-F]{6}$/.test(s) }

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  const v = max, s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return [h * 360, s, v]
}

function hsvToHex(h: number, s: number, v: number): string {
  const hi = Math.floor(h / 60) % 6, f = h / 60 - Math.floor(h / 60)
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s)
  const parts = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][hi]
  return '#' + parts.map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

// ─── Custom color picker ──────────────────────────────────────────────────────

export function ColorInput({ value, onChange, id }: InputProps) {
  const hexValue = typeof value === 'string' && isValidHex(value) ? value : '#000000'
  const [open, setOpen] = useState(false)
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(hexValue))
  const [textVal, setTextVal] = useState(hexValue)
  const popRef = useRef<HTMLDivElement>(null)
  const sbRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const draggingSb = useRef(false)
  const draggingHue = useRef(false)

  useEffect(() => {
    if (typeof value === 'string' && isValidHex(value)) {
      setHsv(hexToHsv(value))
      setTextVal(value)
    }
  }, [value])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const emit = (hex: string) => {
    setTextVal(hex)
    onChange?.({ target: { value: hex } } as ChangeEvent<HTMLInputElement>)
  }

  const applyHsv = (next: [number, number, number]) => { setHsv(next); emit(hsvToHex(...next)) }

  const getSb = (e: { clientX: number; clientY: number }) => {
    if (!sbRef.current) return
    const r = sbRef.current.getBoundingClientRect()
    applyHsv([hsv[0], Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height))])
  }
  const getHue = (e: { clientX: number }) => {
    if (!hueRef.current) return
    const r = hueRef.current.getBoundingClientRect()
    applyHsv([Math.max(0, Math.min(360, ((e.clientX - r.left) / r.width) * 360)), hsv[1], hsv[2]])
  }

  const currentHex = hsvToHex(...hsv)
  const hueHex = hsvToHex(hsv[0], 1, 1)

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="h-7 w-7 shrink-0 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: currentHex }}
        aria-label="Farbe wählen"
      />
      <Input
        id={id}
        type="text"
        value={textVal}
        placeholder="#000000"
        className="flex-1 font-mono"
        onChange={(e) => {
          setTextVal(e.target.value)
          if (isValidHex(e.target.value)) {
            setHsv(hexToHsv(e.target.value))
            onChange?.({ target: { value: e.target.value } } as ChangeEvent<HTMLInputElement>)
          }
        }}
      />

      {open && (
        <div
          ref={popRef}
          className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border border-gray-200 bg-white p-2.5 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        >
          {/* Saturation–Value area */}
          <div
            ref={sbRef}
            className="relative mb-2.5 h-36 w-full cursor-crosshair select-none overflow-hidden rounded-lg"
            style={{ background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,${hueHex})` }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); draggingSb.current = true; getSb(e) }}
            onPointerMove={(e) => { if (draggingSb.current) getSb(e) }}
            onPointerUp={() => { draggingSb.current = false }}
          >
            <div
              className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${hsv[1] * 100}%`, top: `${(1 - hsv[2]) * 100}%` }}
            />
          </div>

          {/* Hue slider */}
          <div
            ref={hueRef}
            className="relative mb-2.5 h-3 w-full cursor-pointer select-none overflow-visible rounded-full"
            style={{ background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); draggingHue.current = true; getHue(e) }}
            onPointerMove={(e) => { if (draggingHue.current) getHue(e) }}
            onPointerUp={() => { draggingHue.current = false }}
          >
            <div
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${(hsv[0] / 360) * 100}%`, backgroundColor: hueHex }}
            />
          </div>

          {/* Hex input */}
          <Input
            type="text"
            value={textVal}
            placeholder="#000000"
            className="font-mono text-xs"
            onChange={(e) => {
              setTextVal(e.target.value)
              if (isValidHex(e.target.value)) {
                setHsv(hexToHsv(e.target.value))
                onChange?.({ target: { value: e.target.value } } as ChangeEvent<HTMLInputElement>)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
