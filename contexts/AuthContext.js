import { createContext, useContext, useState, useEffect } from 'react'
import AUTH_CONFIG from '../config/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(null)

  // Sessiya tekshirish
  useEffect(() => {
    checkSession()
    loadLoginAttempts()
  }, [])

  // Login urinishlarini yuklash
  const loadLoginAttempts = () => {
    try {
      const attempts = localStorage.getItem(AUTH_CONFIG.SECURITY.ATTEMPTS_KEY)
      const lockout = localStorage.getItem('rayhona_lockout_time')
      
      if (attempts) {
        setLoginAttempts(parseInt(attempts))
      }
      
      if (lockout) {
        const lockoutTimestamp = parseInt(lockout)
        const now = Date.now()
        
        if (now < lockoutTimestamp) {
          setIsLocked(true)
          setLockoutTime(lockoutTimestamp)
          
          // Lockout vaqtini tugaganda avtomatik ochish
          const remainingTime = lockoutTimestamp - now
          setTimeout(() => {
            setIsLocked(false)
            setLockoutTime(null)
            setLoginAttempts(0)
            localStorage.removeItem(AUTH_CONFIG.SECURITY.ATTEMPTS_KEY)
            localStorage.removeItem('rayhona_lockout_time')
          }, remainingTime)
        } else {
          // Lockout vaqti tugagan
          localStorage.removeItem(AUTH_CONFIG.SECURITY.ATTEMPTS_KEY)
          localStorage.removeItem('rayhona_lockout_time')
        }
      }
    } catch (error) {
      console.error('Login attempts yuklanmadi:', error)
    }
  }

  // Sessiya tekshirish
  const checkSession = () => {
    try {
      const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION.STORAGE_KEY)
      
      if (sessionData) {
        const { token, timestamp } = JSON.parse(sessionData)
        const now = Date.now()
        
        // Sessiya muddatini tekshirish
        if (now - timestamp < AUTH_CONFIG.SESSION.DURATION) {
          setIsAuthenticated(true)
        } else {
          // Sessiya muddati tugagan
          logout()
        }
      }
    } catch (error) {
      console.error('Sessiya tekshirilmadi:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  // Login funksiyasi
  const login = async (username, password) => {
    // Lockout tekshirish
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 60000)
      throw new Error(`${AUTH_CONFIG.MESSAGES.ACCOUNT_LOCKED} Qolgan vaqt: ${remainingTime} daqiqa`)
    }

    // Ma'lumotlarni tekshirish
    if (!username || !password) {
      throw new Error(AUTH_CONFIG.MESSAGES.FIELDS_REQUIRED)
    }

    // Login va parolni tekshirish
    if (username === AUTH_CONFIG.CREDENTIALS.username && 
        password === AUTH_CONFIG.CREDENTIALS.password) {
      
      // Muvaffaqiyatli login
      const token = generateToken()
      const sessionData = {
        token,
        timestamp: Date.now()
      }
      
      localStorage.setItem(AUTH_CONFIG.SESSION.STORAGE_KEY, JSON.stringify(sessionData))
      setIsAuthenticated(true)
      
      // Login urinishlarini tozalash
      setLoginAttempts(0)
      localStorage.removeItem(AUTH_CONFIG.SECURITY.ATTEMPTS_KEY)
      localStorage.removeItem('rayhona_lockout_time')
      
      return AUTH_CONFIG.MESSAGES.LOGIN_SUCCESS
    } else {
      // Noto'g'ri login
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      localStorage.setItem(AUTH_CONFIG.SECURITY.ATTEMPTS_KEY, newAttempts.toString())
      
      if (newAttempts >= AUTH_CONFIG.SECURITY.MAX_ATTEMPTS) {
        // Account lockout
        const lockoutTimestamp = Date.now() + AUTH_CONFIG.SECURITY.LOCKOUT_TIME
        setIsLocked(true)
        setLockoutTime(lockoutTimestamp)
        localStorage.setItem('rayhona_lockout_time', lockoutTimestamp.toString())
        
        throw new Error(AUTH_CONFIG.MESSAGES.ACCOUNT_LOCKED)
      }
      
      throw new Error(AUTH_CONFIG.MESSAGES.LOGIN_ERROR)
    }
  }

  // Logout funksiyasi
  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.SESSION.STORAGE_KEY)
    setIsAuthenticated(false)
  }

  // Token generatsiya
  const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Sessiya muddatini tekshirish
  const getSessionTimeLeft = () => {
    try {
      const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION.STORAGE_KEY)
      if (sessionData) {
        const { timestamp } = JSON.parse(sessionData)
        const timeLeft = AUTH_CONFIG.SESSION.DURATION - (Date.now() - timestamp)
        return Math.max(0, timeLeft)
      }
    } catch (error) {
      console.error('Sessiya vaqti tekshirilmadi:', error)
    }
    return 0
  }

  // Sessiya muddatini formatlash
  const formatSessionTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}d`
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    loginAttempts,
    isLocked,
    lockoutTime,
    getSessionTimeLeft,
    formatSessionTime
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
