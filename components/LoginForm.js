import { useState } from 'react'
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle, Crown, Gem } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const { login, isLocked, lockoutTime } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await login(username, password)
      setMessage(result)
      setMessageType('success')
      
      // 2 soniya kutib, asosiy sahifaga o'tish
      setTimeout(() => {
        onLoginSuccess()
      }, 2000)
      
    } catch (error) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const getRemainingLockoutTime = () => {
    if (!isLocked || !lockoutTime) return 0
    const remaining = Math.ceil((lockoutTime - Date.now()) / 60000)
    return Math.max(0, remaining)
  }

  const remainingTime = getRemainingLockoutTime()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Theme and Language Toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* Salon Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative group">
              {/* Beautiful salon logo - responsive sizing */}
              <div className="relative p-4 sm:p-6 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 dark:from-pink-600 dark:via-rose-600 dark:to-purple-700 shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                <div className="relative z-10 group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex items-center justify-center">
                    <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} fill="currentColor" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Salon Title - responsive text sizing */}
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-rose-400 dark:to-purple-500 bg-clip-text text-transparent mb-2 sm:mb-3 tracking-tight">
              Rayhona
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-semibold bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent tracking-wide">
              Go'zallik Saloni
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 dark:border-slate-600/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {t('loginTitle')}
            </h1>
            <p className="text-sm sm:text-base text-white/80">
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  {t('username')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('enterUsername')}
                  disabled={isLoading || isLocked}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-slate-200/50 dark:border-slate-600/50 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPassword')}
                    disabled={isLoading || isLocked}
                    className="w-full p-3 sm:p-4 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border-2 border-slate-200/50 dark:border-slate-600/50 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isLocked}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 ${
                  messageType === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  {messageType === 'success' ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${
                    messageType === 'success' 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {message}
                  </span>
                </div>
              )}

              {/* Lockout Message */}
              {isLocked && remainingTime > 0 && (
                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {t('accountLocked')} {remainingTime} {t('minutes')}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isLocked || !username || !password}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-base">{t('loggingIn')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-base">{t('login')}</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/40 dark:border-slate-600/60">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
              {t('copyright')}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                {t('platformCreator')}
              </span>
              <a 
                href="https://github.com/NodirUstoz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                @NodirUstoz
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
