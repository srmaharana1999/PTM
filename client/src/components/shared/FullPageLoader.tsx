import LoadingSpinner from './LoadingSpinner'

/**
 * Full-screen loader — used during initAuth() resolution.
 * Blocks the whole viewport so there's no route flicker.
 */
const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/5 shadow-xl backdrop-blur-lg">
          <span className="text-2xl font-bold bg-linear-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent select-none">
            P
          </span>
          <span className="absolute inset-0 rounded-2xl ring-2 ring-violet-500/30 animate-pulse" />
        </div>
        <LoadingSpinner size="md" label="Loading PTM..." />
      </div>
    </div>
  )
}

export default FullPageLoader
