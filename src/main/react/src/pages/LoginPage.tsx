import StorySetImage from '../components/basic/StorySetImage.tsx'
import People from '../assets/people.svg'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import type { LoginFormErrors, LoginFormValues } from '../validation/validateLogin'
import { validateLogin } from '../validation/validateLogin'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from '../components/basic/FormInput'
import FormButton from '../components/basic/FormButton'
import { showError, showSuccess } from '../components/alerts/swalAlerts'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const { t } = useTranslation()
  const { login, loading: authLoading, error: authError, clearError } = useAuth()
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (authError) {
      showError(authError)
      clearError()
    }
  }, [authError, clearError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    clearError()
    const validationErrors = validateLogin(values, t)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      try {
        await login(values)
        showSuccess(t('loginPage.successTitle'))
      } catch (err) {
        console.error('Login error:', err)
      }
    }
  }

  const handleGoogleLogin = () => {
    clearError()
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <section className="flex h-full w-full items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark relative flex h-full w-full items-center justify-center rounded-2xl p-10 shadow-md md:flex-row lg:max-w-3/4">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            backgroundImage: `url(${People})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08,
          }}
        />
        <div className="realtive z-10 flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-accent text-2xl font-semibold md:text-3xl">{t('loginPage.title')}</h1>
          <form className="my-5 flex w-full flex-col items-center gap-4 md:p-6" onSubmit={handleSubmit} noValidate>
            <FormInput
              label={t('loginPage.email')}
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={submitted ? errors.email : undefined}
            />
            <FormInput
              label={t('loginPage.password')}
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={submitted ? errors.password : undefined}
            />
            <FormButton type="submit" disabled={authLoading}>
              {t('loginPage.loginButton')}
            </FormButton>
            <FormButton
              type="button"
              disabled={authLoading}
              onClick={handleGoogleLogin}
              className="!text-gray border-gray-300 bg-white hover:bg-gray-100"
            >
              <FcGoogle className="text-xl" />
              {t('loginPage.loginWithGoogleButton')}
            </FormButton>
          </form>
          <p>
            {t('loginPage.noAccount')}{' '}
            <Link to="/register" className="text-accent">
              {t('loginPage.registerLink')}
            </Link>
          </p>
        </div>
        <div className="hidden w-full items-center justify-center lg:flex">
          <StorySetImage
            image={People}
            alt="Login Illustration"
            link="https://storyset.com/people"
            text="People illustrations by Storyset"
          />
        </div>
      </div>
    </section>
  )
}

export default LoginPage
