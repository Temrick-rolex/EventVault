import { useState, useEffect } from 'react'
import CircularLoader from './CircularLoader'

interface DashboardEntryTransitionProps {
  isLoading: boolean
  children: React.ReactNode
}

export default function DashboardEntryTransition({ isLoading, children }: DashboardEntryTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isLoading])

  return (
    <div className="relative min-h-[200px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularLoader size="lg" color="emerald" />
        </div>
      )}
      <div
        className={`transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
