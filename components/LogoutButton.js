import { useState, useEffect } from 'react'
import { LogOut, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function LogoutButton() {
  const [showSessionInfo, setShowSessionInfo] = useState(false)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0)
  
  const { logout, getSessionTimeLeft, formatSessionTime } = useAuth()
  const { t } = useLanguage()

  // Sessiya vaqtini kuzatish
  useEffect(() => {
    const updateSessionTime = () => {
      const timeLeft = getSessionTimeLeft()
      setSessionTimeLeft(timeLeft)
      
      // Agar sessiya tugagan bo'lsa, avtomatik logout
      if (timeLeft <= 0) {
        logout()
      }
    }

    // Dastlabki tekshirish
    updateSessionTime()
    
    // Har minut tekshirish
    const interval = setInterval(updateSessionTime, 60000)
    
    return () => clearInterval(interval)
  }, [getSessionTimeLeft, logout])

  const handleLogout = () => {
    logout()
  }

  const toggleSessionInfo = () => {
    setShowSessionInfo(!showSessionInfo)
  }

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours} ${t('hours')} ${minutes} ${t('minutesShort')}`
    }
    return `${minutes} ${t('minutesShort')}`
  }

  return (
    <div className="relative">
      {/* Session Info Toggle */}
      <button
        onClick={toggleSessionInfo}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
        title={t('sessionTimeLeft')}
      >
        <Clock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {formatTime(sessionTimeLeft)}
        </span>
      </button>

      {/* Session Info Dropdown */}
      {showSessionInfo && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 p-4 z-50">
          <div className="space-y-3">
            {/* Session Status */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                sessionTimeLeft > 60 * 60 * 1000 ? 'bg-green-500' : 
                sessionTimeLeft > 30 * 60 * 1000 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('sessionTimeLeft')}
              </span>
            </div>
            
            {/* Time Display */}
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {formatTime(sessionTimeLeft)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {sessionTimeLeft > 60 * 60 * 1000 ? 'Sessiya faol' : 
                 sessionTimeLeft > 30 * 60 * 1000 ? 'Sessiya tugayapti' : 'Sessiya tez orada tugaydi'}
              </div>
            </div>

            {/* Warning for low time */}
            {sessionTimeLeft <= 30 * 60 * 1000 && sessionTimeLeft > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs text-yellow-800 dark:text-yellow-200">
                  Sessiya tez orada tugaydi. Ma'lumotlarni saqlang!
                </span>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showSessionInfo && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSessionInfo(false)}
        />
      )}
    </div>
  )
}
