import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { useTranslation } from 'react-i18next'

interface CoreProps {
  children: ReactNode
  fallback?: ReactNode
  label?: string
  // Translated strings injected by the wrapper
  titleText: string
  retryText: string
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryCore extends Component<CoreProps, State> {
  constructor(props: CoreProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary: ${this.props.label ?? 'unknown'}]`, error, info)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="font-medium text-red-700 dark:text-red-400">{this.props.titleText}</p>
            {this.state.error && (
              <p className="mt-1 font-mono text-xs text-red-500 dark:text-red-500">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.reset}
            className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-800/40 dark:text-red-400 dark:hover:bg-red-800/60"
          >
            {this.props.retryText}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

interface Props {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

export function ErrorBoundary({ children, fallback, label }: Props) {
  const { t } = useTranslation()
  const titleText = label
    ? t('errors.boundaryTitle', { label })
    : t('errors.unknownError', { defaultValue: 'Error' })
  const retryText = t('errors.boundaryRetry')

  return (
    <ErrorBoundaryCore
      fallback={fallback}
      label={label}
      titleText={titleText}
      retryText={retryText}
    >
      {children}
    </ErrorBoundaryCore>
  )
}
