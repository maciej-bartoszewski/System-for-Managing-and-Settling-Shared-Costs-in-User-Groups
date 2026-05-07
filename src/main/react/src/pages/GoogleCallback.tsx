import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from '../components/basic/Loading'
import { showSuccess } from '../components/alerts/swalAlerts'
import { useTranslation } from 'react-i18next'
import { ROLE_PATHS } from '../routes/RolePaths.tsx'

function GoogleCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithGoogle, user } = useAuth()
  const { t } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (isProcessing) return

      const searchParams = new URLSearchParams(location.search)
      const code = searchParams.get('code')

      if (!code) {
        return
      }

      try {
        setIsProcessing(true)
        await loginWithGoogle(code)
        showSuccess(t('loginPage.successTitle'))
      } catch (err) {
        console.error('Google authentication error:', err)
        navigate('/')
      }
    }

    handleGoogleCallback()
  }, [location, loginWithGoogle, navigate, isProcessing, t])

  useEffect(() => {
    if (user && isProcessing) {
      const redirectPath = user.role && ROLE_PATHS[user.role] ? ROLE_PATHS[user.role] : '/profile'
      navigate(redirectPath, { replace: true })
    }
  }, [user, navigate, isProcessing])

  return <Loading />
}

export default GoogleCallback
