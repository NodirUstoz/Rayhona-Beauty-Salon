import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

// Error handling
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Runtime error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}
