import { AlertTriangle, RefreshCw } from 'lucide-react'
import { extractErrorMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  error: unknown
  className?: string
  onRetry?: () => void
}

const ErrorMessage = ({ error, className, onRetry }: ErrorMessageProps) => {
  const message = extractErrorMessage(error)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center',
        className
      )}
      role="alert"
    >
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div>
        <p className="font-semibold text-sm text-destructive">Something went wrong</p>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
