import { useLanguage } from '../contexts/LanguageContext'
import { Globe, ChevronDown, Sparkle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const languages = [
    { 
      code: 'uz-latin', 
      label: 'O\'z', 
      name: 'O\'zbek (Lotin)',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      code: 'uz-cyrillic', 
      label: 'Ўз', 
      name: 'Ўзбек (Кирилл)',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      code: 'ru', 
      label: 'Ру', 
      name: 'Русский',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="fixed top-4 left-4 z-50" ref={dropdownRef}>
      <div className="relative">
        {/* Main dropdown button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-600/20 backdrop-blur-xl border border-white/30 dark:border-gray-600/50 rounded-2xl px-6 py-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 flex items-center gap-3"
        >
          {/* Globe icon */}
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Globe className="w-3 h-3 text-white" />
          </div>
          
          {/* Current language */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-slate-700 dark:text-slate-300">
              {currentLanguage?.label}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
        </button>

        {/* Dropdown menu */}
        <div className={`absolute top-full left-0 mt-2 w-64 bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-600/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 dark:border-slate-600/50 overflow-hidden transition-all duration-300 z-50 ${
          isOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-2'
        }`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
          
          {/* Dropdown header */}
          <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-600/50">
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Tilni tanlang
              </span>
            </div>
          </div>
          
          {/* Language options */}
          <div className="py-2">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Language clicked:', lang.code, lang.name)
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`group/option relative w-full px-4 py-3 text-left transition-all duration-300 hover:bg-white/20 dark:hover:bg-slate-700/50 cursor-pointer ${
                  language === lang.code 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20' 
                    : ''
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Language indicator */}
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${lang.gradient} ${
                      language === lang.code ? 'animate-pulse' : ''
                    }`}></div>
                    
                    {/* Language name */}
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                        {lang.label}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {lang.name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {language === lang.code && (
                    <div className="w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
                  )}
                </div>
                
                {/* Hover effect - positioned behind content */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover/option:opacity-100 transition-all duration-300 rounded-lg -z-10"></div>
              </button>
            ))}
          </div>
          
          {/* Dropdown footer */}
          <div className="px-4 py-2 border-t border-slate-200/50 dark:border-slate-600/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Zamonaviy til tanlash
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
