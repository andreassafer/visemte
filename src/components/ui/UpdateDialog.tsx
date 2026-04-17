import { createPortal } from 'react-dom'
import { Button } from './Button'

interface UpdateDialogProps {
  message: string
  kind: 'info' | 'error' | 'confirm'
  okLabel?: string
  cancelLabel?: string
  onOk: () => void
  onCancel?: () => void
}

export function UpdateDialog({
  message,
  kind,
  okLabel = 'OK',
  cancelLabel,
  onOk,
  onCancel,
}: UpdateDialogProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel ?? onOk} />
      <div className="relative w-72 rounded-2xl bg-gray-900 px-6 py-5 text-center shadow-2xl dark:bg-gray-800">
        <p className="mb-5 text-sm leading-snug text-white">{message}</p>
        <div className={`flex flex-col gap-2`}>
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center rounded-xl"
            onClick={onOk}
          >
            {okLabel}
          </Button>
          {kind === 'confirm' && cancelLabel && onCancel && (
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-center rounded-xl text-white hover:bg-white/10 dark:hover:bg-white/10"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
