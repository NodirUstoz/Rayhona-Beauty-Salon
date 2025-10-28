// Authentication configuration
// IMPORTANT: For production, set these values via environment variables or secure configuration
// See .env.example for proper setup

export const AUTH_CONFIG = {
  // Login va parol ma'lumotlari
  // Demo credentials for development - CHANGE THESE FOR PRODUCTION!
  CREDENTIALS: {
    username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'user',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'CHANGE_THIS_PASSWORD'
  },
  
  // Sessiya sozlamalari
  SESSION: {
    DURATION: 24 * 60 * 60 * 1000, // 1 kun (millisekundlarda)
    STORAGE_KEY: 'rayhona_session',
    TOKEN_KEY: 'rayhona_token'
  },
  
  // Xavfsizlik sozlamalari
  SECURITY: {
    MAX_ATTEMPTS: 5, // Maksimal urinishlar soni
    LOCKOUT_TIME: 5 * 60 * 1000, // 5 daqiqa (millisekundlarda)
    ATTEMPTS_KEY: 'rayhona_login_attempts'
  },
  
  // Xabar matnlari
  MESSAGES: {
    LOGIN_SUCCESS: 'Muvaffaqiyatli kirildi!',
    LOGIN_ERROR: 'Login yoki parol noto\'g\'ri!',
    SESSION_EXPIRED: 'Sessiya muddati tugagan. Qayta kiring.',
    ACCOUNT_LOCKED: 'Juda ko\'p noto\'g\'ri urinish! 5 daqiqa kutib turing.',
    LOGOUT_SUCCESS: 'Muvaffaqiyatli chiqildi!',
    FIELDS_REQUIRED: 'Login va parolni kiriting!'
  }
}

// Login va parolni o'zgartirish uchun:
// 1. Production uchun .env.local fayli yarating va NEXT_PUBLIC_ADMIN_PASSWORD o'rnating
// 2. Development uchun CREDENTIALS.password qiymatini o'zgartiring
// 3. Faylni qayta saqlang
// 4. Serverni qayta ishga tushiring
//
// IMPORTANT SECURITY NOTES:
// - Never commit real passwords to version control
// - Use environment variables for production deployments
// - Consider implementing proper authentication server-side for production use
// - Review and update security settings as needed

export default AUTH_CONFIG
