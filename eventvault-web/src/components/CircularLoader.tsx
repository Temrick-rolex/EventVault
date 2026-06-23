interface CircularLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'emerald' | 'slate' | 'red'
}

export default function CircularLoader({ size = 'md', color = 'emerald' }: CircularLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    emerald: 'border-emerald-500 border-t-transparent',
    slate: 'border-slate-500 border-t-transparent',
    red: 'border-red-500 border-t-transparent'
  }

  return (
    <div className={`flex items-center justify-center`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full border-2 animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
