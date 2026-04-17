import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@/components/ui'
import { useClipboard } from '@/hooks'
import { compileMjml } from '@/services'
import { templateToMjml, formatHtml } from '@/utils'
import type { EmailTemplate } from '@/types'

interface Props {
  template: EmailTemplate
  onClose: () => void
}

type CopyKey = 'json' | 'mjml' | 'html' | 'ts'

// ── TypeScript source generator ───────────────────────────────────────────────

function toVarName(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map((word, i) =>
        i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('') + 'Template'
  )
}

function templateToTs(template: EmailTemplate): string {
  const varName = toVarName(template.name) || 'presetTemplate'
  const id = template.id.startsWith('preset-') ? template.id : `preset-${template.id}`

  // Temporarily replace date strings with a sentinel so we can swap them with
  // new Date().toISOString() calls in the final source (avoids hardcoded dates).
  const data = { ...template, id, createdAt: '__TS_DATE__', updatedAt: '__TS_DATE__' }
  const body = JSON.stringify(data, null, 2).replace(/"__TS_DATE__"/g, 'new Date().toISOString()')

  return `import type { EmailTemplate } from '@/types'\n\nexport const ${varName}: EmailTemplate = ${body}\n`
}

export function ExportModal({ template, onClose }: Props) {
  const { t } = useTranslation()
  const { copy } = useClipboard()
  const [html, setHtml] = useState<string | null>(null)
  const [mjml, setMjml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<CopyKey | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = (key: CopyKey, text: string) => {
    void copy(text)
    if (timerRef.current) clearTimeout(timerRef.current)
    setCopiedKey(key)
    timerRef.current = setTimeout(() => {
      setCopiedKey(null)
    }, 500)
  }

  const compile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const mjmlCode = templateToMjml(template)
      setMjml(mjmlCode)
      const result = await compileMjml(mjmlCode)
      if (result.errors.length > 0) {
        setError(result.errors.map((e) => e.message).join('\n'))
      }
      setHtml(formatHtml(result.html))
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errors.mjmlCompile'))
    } finally {
      setLoading(false)
    }
  }, [template, t])

  useEffect(() => {
    void compile()
  }, [compile])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadMjml = () => {
    if (!mjml) return
    const blob = new Blob([mjml], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.mjml`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadTs = () => {
    const ts = templateToTs(template)
    const blob = new Blob([ts], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${toVarName(template.name) || 'preset'}.ts`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadHtml = () => {
    if (!html) return
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const CheckIcon = () => (
    <span className="h-4 inline-flex items-center">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  )

  const CopyIcon = () => (
    <span className="h-4 inline-flex items-center">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </span>
  )

  const FileIcon = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )

  const CopyButton = ({
    copyKey,
    onClick,
    disabled,
  }: {
    copyKey: CopyKey
    onClick: () => void
    disabled?: boolean
  }) => {
    const copied = copiedKey === copyKey
    return (
      <Tooltip label={t('export.copy')} side="bottom">
        <button
          onClick={onClick}
          disabled={disabled}
          aria-label={t('export.copy')}
          className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </Tooltip>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('editor.toolbar.export')}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-gray-200 dark:ring-white/20 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500 dark:text-gray-400"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {t('editor.toolbar.export')}
            </h2>
          </div>
          <button
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {/* JSON */}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">JSON</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('export.descJson')}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                copyKey="json"
                onClick={() => {
                  handleCopy('json', JSON.stringify(template, null, 2))
                }}
              />
              <Tooltip label={t('export.downloadJson')} side="bottom">
                <button
                  onClick={downloadJson}
                  aria-label={t('export.downloadJson')}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FileIcon /> .json
                </button>
              </Tooltip>
            </div>
          </div>

          {/* MJML */}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">MJML</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('export.descMjml')}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                copyKey="mjml"
                onClick={() => {
                  if (mjml) handleCopy('mjml', mjml)
                }}
                disabled={loading || !mjml}
              />
              <Tooltip label={t('export.downloadMjml')} side="bottom">
                <button
                  onClick={downloadMjml}
                  disabled={loading || !mjml}
                  aria-label={t('export.downloadMjml')}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FileIcon /> .mjml
                </button>
              </Tooltip>
            </div>
          </div>

          {/* TypeScript – dev preset source */}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">TypeScript</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('export.descTs')}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                copyKey="ts"
                onClick={() => {
                  handleCopy('ts', templateToTs(template))
                }}
              />
              <Tooltip label={t('export.downloadTs')} side="bottom">
                <button
                  onClick={downloadTs}
                  aria-label={t('export.downloadTs')}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FileIcon /> .ts
                </button>
              </Tooltip>
            </div>
          </div>

          {/* HTML */}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">HTML</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('export.descHtml')}</p>
            </div>
            {error && (
              <p className="rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="flex items-center gap-2">
              <CopyButton
                copyKey="html"
                onClick={() => {
                  if (html) handleCopy('html', html)
                }}
                disabled={loading || !html}
              />
              <Tooltip label={t('export.download')} side="bottom">
                <button
                  onClick={downloadHtml}
                  disabled={loading || !html}
                  aria-label={t('export.download')}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FileIcon /> {loading ? t('common.loading') : '.html'}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
