import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

const LoadingSpinner = ({ size = 'md', className, label }: LoadingSpinnerProps) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      role="status"
      aria-label={label ?? 'Loading'}
    >
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeMap[size])} />
      {label && <span className="text-sm text-muted-foreground animate-pulse">{label}</span>}
    </div>
  )
}

export default LoadingSpinner
