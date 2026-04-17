import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { storage } from '@/services'
import { PRESET_TEMPLATES } from '@/templates'

function AppLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400 dark:bg-gray-900">
      <svg
        className="animate-spin"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}

function AppContent() {
  useTheme()
  const { t } = useTranslation()
  useEffect(() => {
    document.title = __APP_NAME__
    storage.initPresets(PRESET_TEMPLATES).catch((e: unknown) => {
      console.error('[storage] initPresets failed:', e)
    })
  }, [t])
  return <EditorLayout />
}

export default function App() {
  return (
    <Suspense fallback={<AppLoader />}>
      <AppContent />
    </Suspense>
  )
}
