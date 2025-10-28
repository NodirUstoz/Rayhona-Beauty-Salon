import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme)
    toggleTheme()
  }

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className="group relative overflow-hidden bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-600/20 backdrop-blur-xl border border-white/30 dark:border-gray-600/50 rounded-2xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:rotate-3"
        aria-label="Toggle theme"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 dark:from-yellow-500/20 dark:via-orange-500/20 dark:to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
        
        {/* Icon container with rotation */}
        <div className="relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
          {theme === 'light' ? (
            <div className="relative">
              <Moon className="w-6 h-6 text-slate-700 dark:text-slate-300 transition-all duration-500 group-hover:text-purple-600" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
            </div>
          ) : (
            <div className="relative">
              <Sun className="w-6 h-6 text-yellow-500 transition-all duration-500 group-hover:text-yellow-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
              {/* Sparkle effects */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
              <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-orange-300 rounded-full animate-ping opacity-0 group-hover:opacity-100 animation-delay-300"></div>
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500 animation-delay-200"></div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </button>
    </div>
  )
}
