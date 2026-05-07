import { createRoot } from 'react-dom/client'
import './i18n'
import { AuthProvider } from './contexts/AuthContext.tsx'
import App from './App.tsx'

const theme = localStorage.getItem('theme')
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
