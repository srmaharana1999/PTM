import { useEffect, useRef } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Trap escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onCancel}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          {isDestructive && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 border border-destructive/30">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          )}
          <h2 id="confirm-dialog-title" className="text-base font-semibold text-foreground">
            {title}
          </h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors disabled:opacity-50',
              isDestructive
                ? 'bg-destructive text-white hover:bg-destructive/80'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            )}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
