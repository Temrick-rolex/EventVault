import { useState, useEffect } from 'react'

export default function VaultShieldPreloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [showPreloader, setShowPreloader] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Simulate network lag (2500ms)
    const timer = setTimeout(() => {
      setIsLoading(false)
      setAnimationComplete(true)
      
      // After 600ms completion animation, start fade out
      setTimeout(() => {
        setShowPreloader(false)
      }, 600)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!showPreloader) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-500 ${
        !isLoading && animationComplete ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          className="relative"
        >
          {/* Shield Path */}
          <path
            d="M60 10 L100 25 L100 70 C100 100 80 120 60 130 C40 120 20 100 20 70 L20 25 Z"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shield-path"
            style={{
              strokeDasharray: '300',
              strokeDashoffset: isLoading ? '300' : '0',
              filter: animationComplete ? 'drop-shadow(0 0 10px #10B981) drop-shadow(0 0 20px #10B981)' : 'none',
              transition: isLoading ? 'none' : 'all 0.6s ease-out',
              transform: animationComplete ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          
          {/* Checkmark */}
          <path
            d="M40 70 L55 85 L80 55"
            fill="none"
            stroke="#34D399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="checkmark-path"
            style={{
              opacity: animationComplete ? 1 : 0,
              transform: animationComplete ? 'scale(1)' : 'scale(0)',
              filter: animationComplete ? 'drop-shadow(0 0 15px rgba(52,211,153,0.8))' : 'none',
              transition: animationComplete ? 'all 0.6s ease-out' : 'none',
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes shield-draw {
          0% {
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .shield-path {
          animation: shield-draw 2s ease-in-out infinite;
        }

        .shield-path[style*="transition: none"] {
          animation: shield-draw 2s ease-in-out infinite;
        }

        .shield-path[style*="transition: all"] {
          animation: none;
        }
      `}</style>
    </div>
  )
}
