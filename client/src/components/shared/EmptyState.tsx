import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-10 text-center',
        className
      )}
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/20">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
      )}
      <div>
        <p className="font-semibold text-sm text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
