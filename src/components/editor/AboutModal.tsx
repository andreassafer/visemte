import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { invoke } from '@tauri-apps/api/core'

interface Props {
  onClose: () => void
}

const NAME = __APP_NAME__
const VERSION = __APP_VERSION__
const BUILD = __APP_BUILD__
const AUTHOR = __APP_AUTHOR__
const LICENSE = __APP_LICENSE__

function VisemteLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1024" height="1024" fill="url(#visemte-grad-about)" />
      <g transform="matrix(2.334498,0,0,2.334498,-673.638579,-683.797019)">
        <path
          d="M445.719,556.423C434.918,525.93 394.053,408.072 393.886,407.428C393.237,404.934 395.184,405.708 458.62,382.888C461.431,381.876 461.915,385.927 468.044,403.665C507.505,517.884 507.796,517.666 511.056,527.646C512.452,531.921 510.98,531.961 501.729,559.577C494.996,579.679 485.641,606.341 484.217,610.399C482.621,614.949 478.602,613.917 468.493,613.701C465.431,613.636 465.22,612.383 458.338,592.556C452.042,574.416 452.008,574.522 445.719,556.423Z"
          fill="rgb(93,128,147)"
        />
        <path
          d="M596.893,399.618C601.501,386.107 601.378,383.104 606.506,383.124C636.506,383.241 636.987,382.988 637.53,383.462C639.122,384.85 637.743,385.356 572.695,574.567C559.418,613.187 559.116,613.496 557.536,613.757C557.248,613.805 524.596,613.819 524.402,613.765C522.139,613.128 523.627,611.95 532.768,585.591C545.1,550.032 595.675,403.32 596.893,399.618Z"
          fill="rgb(21,59,89)"
        />
        <path
          d="M377.885,359.464C377.886,356.577 377.891,336.683 398.64,329.936C404.738,327.953 429.382,315.006 444.023,335.831C447.379,340.604 456.64,367.964 455.652,369.645C455.475,369.945 390.629,392.956 389.44,392.737C388.149,392.499 378.802,365.972 377.885,359.464Z"
          fill="rgb(21,60,90)"
        />
        <path
          d="M509.598,658.842C512.095,658.334 512.059,657.973 513.525,658.397C520.185,660.322 529.147,663.077 530.503,663.494C532.647,664.153 531.428,666.183 531.304,666.389C525.647,675.804 514.075,699.304 512.383,700.101C510.752,700.87 511.219,699.594 509.069,695.74C492.431,665.919 490.809,664.469 493.51,663.522C501.472,660.728 501.568,661.266 509.598,658.842Z"
          fill="rgb(95,127,144)"
        />
      </g>
      <defs>
        <linearGradient
          id="visemte-grad-about"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(1024,0,0,1024,0,512)"
        >
          <stop offset="0" stopColor="rgb(198,202,212)" />
          <stop offset="1" stopColor="rgb(114,121,138)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AboutModal({ onClose }: Props) {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  useEffect(() => {
    if ('__TAURI_INTERNALS__' in window || '__TAURI__' in window) {
      invoke<string>('app_target')
        .then(setPlatform)
        .catch(() => {
          setPlatform(null)
        })
    }
  }, [])

  const rows: { label: string; value: string }[] = [
    { label: t('about.version'), value: VERSION },
    { label: t('about.build'), value: BUILD },
    ...(platform ? [{ label: t('about.platform'), value: platform }] : []),
    { label: t('about.license'), value: LICENSE },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('about.title')}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Card */}
      <div className="relative w-72 overflow-hidden rounded-2xl bg-gray-900 shadow-2xl dark:bg-gray-800">
        {/* Logo + name */}
        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-5">
          <VisemteLogo className="h-16 w-16 rounded-2xl shadow-md overflow-hidden" />
          <div className="flex flex-col gap-1 text-center">
            <p className="text-base font-bold text-white">{NAME}</p>
            <p className="text-xs leading-relaxed text-gray-400">{t('about.description')}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="divide-y divide-white/10 border-t border-white/10">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-2.5">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-xs font-medium text-gray-300">{value}</span>
            </div>
          ))}
        </div>

        {/* Footer / close */}
        <div className="px-6 py-4 text-center">
          <p className="mb-3 text-xs text-gray-500">
            © {new Date().getFullYear()} {AUTHOR}
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent)'
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
