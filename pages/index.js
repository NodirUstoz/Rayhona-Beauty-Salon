import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Calculator, Sparkles, User, CheckCircle, AlertCircle, DollarSign, Heart, Crown, Gem, Flower2, Sparkle, Wand2 } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import LanguageToggle from '../components/LanguageToggle'
import LoginForm from '../components/LoginForm'
import LogoutButton from '../components/LogoutButton'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

export default function SalonForm() {
  const [service, setService] = useState('')
  const [amount, setAmount] = useState('')
  const [worker, setWorker] = useState('')
  const [calculation, setCalculation] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)
  
  const { theme } = useTheme()
  const { t, language } = useLanguage()
  const { isAuthenticated, isLoading } = useAuth()
  
  // Til o'zgarganda formani tozalash
  useEffect(() => {
    setService('')
    setWorker('')
    setCalculation(null)
  }, [language])
  
  // Google Apps Script URL - set via environment variable
  // IMPORTANT: Add NEXT_PUBLIC_GOOGLE_SCRIPT_URL to your .env.local file
  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''
  
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('⚠️ NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not set. Google Sheets integration will not work.')
  }

  // Services va Workers - tilga moslashadi
  const getServices = () => {
    const translations = {
      'uz-latin': [
        'Manikyur',
        'Manikyur + qoplash',
        'Manikyur + suniy tirnok yasash',
        'Manikyur + xina',
        'Yaponskiy manikyur',
        'Yaponskiy manikyur + xina',
        'Pedikyur',
        'Pedikyur + qoplama',
        'Slojniy pedikyur',
        'Yechish',
        'Depilyatsiya qo\'ltiq',
        'Depilyatsiya biqini',
        'Depilyatsiya tizzadan pas',
        'Qosh terish',
        'Qosh bo\'yash',
        'Qosh osvetleniya',
        'Yuz terish',
        'Yuz depilyatsiya',
        'Soch kesish',
        'Soch bo\'yash',
        'Melirovka',
        'Ukladka',
        'Jingalak',
        'Prichyoska',
        'Makiyaj',
        'Makiyaj + kiprik',
        'Manikyur qoplamani yechish'
      ],
      'uz-cyrillic': [
        'Маникюр',
        'Маникюр + қоплаш',
        'Маникюр + суний тирнок ясаш',
        'Маникюр + хина',
        'Японский маникюр',
        'Японский маникюр + хина',
        'Педикюр',
        'Педикюр + қоплама',
        'Сложный педикюр',
        'Ечиш',
        'Депиляция қўлтиқ',
        'Депиляция биқини',
        'Депиляция тиззадан пас',
        'Қош териш',
        'Қош бўяш',
        'Қош освещения',
        'Юз териш',
        'Юз депиляция',
        'Соч кесиш',
        'Соч бўяш',
        'Мелировка',
        'Укладка',
        'Жингалак',
        'Причёска',
        'Макияж',
        'Макияж + киприк',
        'Маникюр қопламани ечиш'
      ],
      'ru': [
        'Маникюр',
        'Маникюр + покрытие',
        'Маникюр + искусственные ногти',
        'Маникюр + хна',
        'Японский маникюр',
        'Японский маникюр + хна',
        'Педикюр',
        'Педикюр + покрытие',
        'Сложный педикюр',
        'Снятие',
        'Депиляция подмышек',
        'Депиляция бикини',
        'Депиляция ниже колена',
        'Коррекция бровей',
        'Окрашивание бровей',
        'Осветление бровей',
        'Чистка лица',
        'Депиляция лица',
        'Стрижка',
        'Окрашивание волос',
        'Мелирование',
        'Укладка',
        'Химическая завивка',
        'Причёска',
        'Макияж',
        'Макияж + ресницы',
        'Снятие покрытия маникюра'
      ]
    }
    return translations[language] || translations['uz-latin']
  }

  const services = getServices()

  // Xodimlar ro'yxati - ismlar o'zgarmaydi, faqat type o'zgaradi
  const getWorkers = () => {
    return [
      { name: 'Rayhona', type: 'xodim' }, // Rayhona barcha xizmatlardan 100% oladi
      { name: 'Dilnoza', type: 'xodim' },
      { name: 'Mavluda', type: 'xodim' },
      { name: 'Samira', type: 'shogirt' },
      { name: 'Sarajon', type: 'shogirt' },
      { name: 'Gulmira', type: 'shogirt' }
    ]
  }
  
  const workers = getWorkers()

  // Service mapping for calculation rules
  const getServiceCalculationRule = (serviceName, currentLanguage, workerName) => {
    // Rayhona barcha xizmatlardan 100% oladi
    if (workerName === 'Rayhona') {
      return 100
    }

    // Maxsus xodimlar: Dilnoza va Mavluda
    const specialWorkers = ['Dilnoza', 'Mavluda']

    // Har bir til uchun manikyur xizmatlari (2 ta): birinchi va ikkinchi
    const manikyurServicesByLang = {
      'uz-latin': ['Manikyur', 'Manikyur + qoplash'],
      'uz-cyrillic': ['Маникюр', 'Маникюр + қоплаш'],
      'ru': ['Маникюр', 'Маникюр + покрытие']
    }

    const isSpecialWorker = specialWorkers.includes(workerName)
    const isManikyurService = (manikyurServicesByLang[currentLanguage] || []).includes(serviceName)

    if (isSpecialWorker && isManikyurService) {
      return 40
    }

    // Qolgan barcha holatlarda 50%
    return 50
  }

  const calculateShare = () => {
    console.log('calculateShare called')
    console.log('Service:', service, 'Amount:', amount, 'Worker:', worker)
    
    if (!service || !amount || !worker) {
      alert(t('fillAllFields'))
      return
    }
    
    console.log('Proceeding with calculation...')

    const sum = parseFloat(amount)
    const selectedWorker = workers.find(w => w.name === worker)
    
    if (selectedWorker.type === 'shogirt') {
      setCalculation({
        worker: worker,
        service: service,
        totalAmount: sum,
        workerShare: 0,
        salonShare: sum,
        percentage: 0,
        note: t('freeWork')
      })
      return
    }

    // Use the new service mapping system
    const percentage = getServiceCalculationRule(service, language, worker)
    const workerShare = (sum * percentage) / 100
    const salonShare = sum - workerShare

    setCalculation({
      worker: worker,
      service: service,
      totalAmount: sum,
      workerShare: workerShare,
      salonShare: salonShare,
      percentage: percentage,
      note: percentage === 100 ? t('fullAmountToWorker') : ''
    })
  }

  const saveToGoogleSheets = async () => {
    if (!calculation) {
      alert(t('calculateFirst'))
      return
    }

    setSaveStatus('loading')

    try {
      const now = new Date()
      const date = now.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ')
      const time = now.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'uz-UZ')

      // Ma'lumotlarni tayyorlash
      const data = {
        date: date,
        time: time,
        worker: calculation.worker,
        service: calculation.service,
        totalAmount: calculation.totalAmount.toString(),
        workerShare: calculation.workerShare.toString(),
        salonShare: calculation.salonShare.toString(),
        percentage: calculation.percentage.toString()
      }

      // URL parametrlarini yaratish
      const queryString = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&')

      const fullUrl = `${GOOGLE_SCRIPT_URL}?${queryString}`
      
      console.log('Sending to:', fullUrl)
      console.log('Data:', data)

      // Fetch so'rov - CORS uchun
      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        })

        console.log('Response status:', response.status)
        
        // Try to read response
        const text = await response.text()
        console.log('Response text:', text)
        
        if (text.includes('SUCCESS')) {
          console.log('✅ Ma\'lumotlar muvaffaqiyatli saqlandi!')
        }
      } catch (fetchError) {
        // CORS error bo'lsa ham ishlashga ruxsat berish
        console.log('CORS error, lekin ma\'lumotlar yuborilgan bo\'lishi mumkin:', fetchError)
      }
      
      // Muvaffaqiyatli saqlandi
      setSaveStatus('success')
      
      setTimeout(() => {
        setService('')
        setAmount('')
        setWorker('')
        setCalculation(null)
        setSaveStatus(null)
      }, 2000)

    } catch (error) {
      console.error('Xatolik:', error)
      setSaveStatus('error')
      setTimeout(() => {
        setSaveStatus(null)
      }, 3000)
    }
  }

  const formatNumber = (num) => {
    return num.toLocaleString(language === 'ru' ? 'ru-RU' : 'uz-UZ')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // Authentication check - show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => window.location.reload()} />
  }

  return (
    <>
      <Head>
        <title>{t('title')} - {t('subtitle')}</title>
        <meta name="description" content="Rayhona Go'zallik Saloni hisobot tizimi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme === 'dark' ? '#1a1a2e' : '#fff'} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </Head>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
        <LogoutButton />
      </div>

      <div className="min-h-screen relative overflow-hidden">
        {/* Beautiful starry sky background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000">
          {/* Subtle gradient overlay for light mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-purple-50/20 to-blue-50/30 dark:bg-transparent transition-all duration-1000"></div>
          
          {/* Dark mode overlay */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 transition-all duration-1000"></div>
          
          {/* Dark mode cosmic effects */}
          <div className="absolute inset-0 dark:block hidden">
            {/* Nebula effect */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            
            {/* Cosmic dust */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${20 + Math.random() * 20}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Beautiful twinkling stars */}
          <div className="absolute inset-0">
            {[...Array(150)].map((_, i) => {
              const size = Math.random() * 4 + 1
              const opacity = Math.random() * 0.9 + 0.1
              const animationDelay = Math.random() * 8
              const animationDuration = Math.random() * 4 + 1
              const starColor = Math.random() > 0.7 ? '#fbbf24' : (Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.2 ? '#a78bfa' : '#60a5fa'))
              
              return (
                <div
                  key={i}
                  className="absolute rounded-full animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: starColor,
                    opacity: opacity,
                    animationDelay: `${animationDelay}s`,
                    animationDuration: `${animationDuration}s`,
                    boxShadow: `0 0 ${size * 2}px ${starColor}80, 0 0 ${size * 4}px ${starColor}40`
                  }}
                ></div>
              )
            })}
          </div>
          
          {/* Shooting stars */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => {
              const colors = ['#fbbf24', '#a78bfa', '#60a5fa', '#ec4899', '#10b981']
              const color = colors[Math.floor(Math.random() * colors.length)]
              
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white dark:bg-current rounded-full animate-shooting-star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 15}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    color: color,
                    boxShadow: `0 0 15px ${color}90, 0 0 30px ${color}50`
                  }}
                ></div>
              )
            })}
          </div>
          
          {/* Constellation lines */}
          <div className="absolute inset-0 opacity-15">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gray-400/40 dark:bg-white/40 animate-constellation"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  height: `${Math.random() * 150 + 30}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${Math.random() * 8}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Magical sparkles */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => {
              const colors = ['#fbbf24', '#a78bfa', '#60a5fa', '#ec4899', '#10b981', '#f59e0b']
              const color = colors[Math.floor(Math.random() * colors.length)]
              
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-pink-300 dark:bg-current rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 12}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                    color: color,
                    boxShadow: `0 0 8px ${color}80, 0 0 16px ${color}40`
                  }}
                ></div>
              )
            })}
          </div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative group">
                {/* Ultra-modern beauty salon logo */}
                <div className="relative p-8 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 dark:from-pink-600 dark:via-rose-600 dark:to-purple-700 shadow-2xl transform group-hover:scale-110 transition-all duration-500 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-pink-500 before:via-rose-500 before:to-purple-600 before:blur-3xl before:opacity-70 -z-10">
                  <div className="relative z-10 group-hover:rotate-6 transition-transform duration-500">
                    {/* Beauty salon elegant logo */}
                    <div className="relative">
                      {/* Main crown shape */}
                      <div className="w-20 h-20 relative flex items-center justify-center">
                        <Crown className="w-16 h-16 text-white" strokeWidth={1.5} fill="currentColor" />
                        
                        {/* Center gem */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Gem className="w-6 h-6 text-yellow-300 animate-pulse" fill="currentColor" />
                        </div>
                      </div>
                      
                      {/* Elegant floating elements */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center animate-pulse">
                        <Sparkle className="w-3 h-3 text-white" fill="currentColor" />
                      </div>
                      
                      {/* Beauty salon accent elements */}
                      <div className="absolute -left-3 top-1/2 w-2 h-8 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full transform -translate-y-1/2 rotate-12"></div>
                      <div className="absolute -right-3 top-1/2 w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full transform -translate-y-1/2 -rotate-12"></div>
                      
                      {/* Elegant corner elements */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full animate-pulse"></div>
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full animate-pulse animation-delay-300"></div>
                      
                      {/* Beauty salon center glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full blur-sm animate-pulse"></div>
                      
                      {/* Elegant flower accents */}
                      <div className="absolute top-1 left-1 w-2 h-2 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full animate-ping opacity-60"></div>
                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full animate-ping animation-delay-1000 opacity-60"></div>
                    </div>
                  </div>
                </div>
                
                {/* Beauty salon floating orbs */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-full animate-pulse blur-sm group-hover:animate-bounce opacity-80"></div>
                <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 rounded-full animate-pulse blur-sm group-hover:animate-bounce animation-delay-300 opacity-80"></div>
                <div className="absolute top-1/2 -right-5 w-8 h-8 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full animate-ping blur-sm opacity-70"></div>
                <div className="absolute top-1/2 -left-5 w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full animate-ping blur-sm animation-delay-2000 opacity-70"></div>
                
                {/* Beauty salon rotating rings */}
                <div className="absolute inset-0 border-2 border-pink-400/30 rounded-full animate-spin-slow group-hover:animate-spin"></div>
                <div className="absolute inset-2 border border-rose-400/20 rounded-full animate-spin-slow group-hover:animate-spin animation-delay-2000"></div>
                <div className="absolute inset-4 border border-purple-400/15 rounded-full animate-spin-slow group-hover:animate-spin animation-delay-4000"></div>
              </div>
            </div>
            
            {/* Beauty salon elegant title */}
            <div className="relative">
              <h1 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-rose-400 dark:to-purple-500 bg-clip-text text-transparent mb-3 group-hover:from-pink-400 group-hover:via-rose-400 group-hover:to-purple-500 dark:group-hover:from-pink-300 dark:group-hover:via-rose-300 dark:group-hover:to-purple-400 transition-all duration-500 tracking-tight">
              {t('title')}
            </h1>
              {/* Beauty salon text glow */}
              <div className="absolute inset-0 text-6xl sm:text-7xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-rose-400 dark:to-purple-500 bg-clip-text text-transparent mb-3 blur-sm opacity-30 -z-10">
                {t('title')}
              </div>
              {/* Additional elegant glow layer */}
              <div className="absolute inset-0 text-6xl sm:text-7xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-rose-400 dark:to-purple-500 bg-clip-text text-transparent mb-3 blur-md opacity-20 -z-20">
                {t('title')}
              </div>
            </div>
            
            <p className="text-2xl sm:text-3xl text-slate-600 dark:text-slate-300 font-semibold bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent tracking-wide">
              {t('subtitle')}
            </p>
          </div>

          {/* Magical Form Card */}
          <div className="relative bg-gradient-to-br from-white/90 via-white/85 to-white/80 dark:from-slate-800/90 dark:via-slate-700/85 dark:to-slate-600/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-slate-600/60 overflow-hidden mb-6 group hover:shadow-3xl transition-all duration-500">
            {/* Magical border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 dark:from-cyan-400/25 dark:via-purple-400/25 dark:to-pink-400/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            
            {/* Magical sparkle effects */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-8 left-8 w-1 h-1 bg-pink-300 rounded-full animate-ping animation-delay-1000 opacity-70"></div>
            <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping animation-delay-2000 opacity-50"></div>
            
            {/* Professional corner elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
            <div className="p-6 sm:p-8 space-y-6">
              {/* Service Select */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {t('selectService')}
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-slate-200/50 dark:border-slate-600/50 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-base hover:bg-white/95 dark:hover:bg-slate-700/95 hover:border-amber-300 dark:hover:border-amber-500 group/select"
                >
                  <option value="">{t('selectService')}</option>
                  {services.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Worker Select */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  <User className="w-5 h-5 text-cyan-500" />
                  {t('selectWorker')}
                </label>
                <select
                  value={worker}
                  onChange={(e) => setWorker(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-slate-200/50 dark:border-slate-600/50 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-base hover:bg-white/95 dark:hover:bg-slate-700/95 hover:border-cyan-300 dark:hover:border-cyan-500"
                >
                  <option value="">{t('selectWorker')}</option>
                  <optgroup label={t('employees')}>
                    {workers.filter(w => w.type === 'xodim').map((w, idx) => (
                      <option key={idx} value={w.name}>{w.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label={t('apprentices')}>
                    {workers.filter(w => w.type === 'shogirt').map((w, idx) => (
                      <option key={idx} value={w.name}>{w.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  {t('enterAmount')}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t('placeholderAmount')}
                  className="w-full p-4 rounded-xl border-2 border-slate-200/50 dark:border-slate-600/50 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-base hover:bg-white/95 dark:hover:bg-slate-700/95 hover:border-emerald-300 dark:hover:border-emerald-500"
                />
              </div>


              {/* Calculate Button */}
              <button
                onClick={calculateShare}
                className="group relative w-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] flex items-center justify-center gap-2 overflow-hidden"
              >
                {/* Professional animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                
                {/* Professional shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                {t('calculate')}
                </div>
              </button>
            </div>
          </div>

          {/* Results Card */}
          {calculation && (
            <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-gray-600/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-600/50 overflow-hidden animate-slide-up group">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <CheckCircle className="w-7 h-7" />
                  {t('result')}
                </h2>
              </div>
              
              <div className="p-6 sm:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Xodim - Zamonaviy design */}
                  <div className="group relative overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/5 dark:via-purple-500/5 dark:to-blue-500/5 backdrop-blur-sm rounded-2xl border border-pink-300/50 dark:border-pink-500/30 hover:border-pink-400 dark:hover:border-pink-400 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('worker')}</p>
                      </div>
                      <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-purple-400">
                        {calculation.worker}
                      </p>
                    </div>
                  </div>
                  
                  {/* Xizmat - Zamonaviy design */}
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 backdrop-blur-sm rounded-2xl border border-blue-300/50 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('service')}</p>
                      </div>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                        {calculation.service}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">{t('totalAmount')}</p>
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                    {formatNumber(calculation.totalAmount)} {t('of')}
                  </p>
                </div>

                {calculation.note ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600 p-4 rounded-xl">
                    <p className="text-yellow-800 dark:text-yellow-200 font-semibold text-center">
                      {calculation.note}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">
                        {t('workerShare')} ({calculation.percentage}%)
                      </p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatNumber(calculation.workerShare)} {t('of')}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-5 rounded-xl border border-pink-200 dark:border-pink-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">
                        {t('salonShare')}
                      </p>
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {formatNumber(calculation.salonShare)} {t('of')}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={saveToGoogleSheets}
                  disabled={saveStatus === 'loading'}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg ${
                    saveStatus === 'success' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : saveStatus === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saveStatus === 'loading' && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>}
                  {saveStatus === 'success' && <CheckCircle className="w-6 h-6" />}
                  {saveStatus === 'error' && <AlertCircle className="w-6 h-6" />}
                  {saveStatus === 'loading' ? t('saving') : 
                   saveStatus === 'success' ? t('saved') : 
                   saveStatus === 'error' ? t('errorOccurred') : 
                   t('saveToSheet')}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('copyright')}
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  )
}
