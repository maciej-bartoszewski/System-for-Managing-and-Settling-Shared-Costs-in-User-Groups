import StorySetImage from '../components/basic/StorySetImage.tsx'
import People from '../assets/people.svg'
import { Link, useNavigate } from 'react-router-dom'
import type { RegisterFormErrors, RegisterFormValues } from '../validation/validateRegister'
import { validateRegister } from '../validation/validateRegister'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from '../components/basic/FormInput'
import FormButton from '../components/basic/FormButton'
import { useAuth } from '../contexts/AuthContext'
import { showError, showSuccess } from '../components/alerts/swalAlerts.ts'

function RegisterPage() {
  const { t } = useTranslation()
  const { register, loading: authLoading, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<RegisterFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<RegisterFormErrors>({})
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
    const validationErrors = validateRegister(values, t)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...registrationData } = values
        await register(registrationData)
        showSuccess(t('registerPage.successTitle'))
        navigate('/')
      } catch (err) {
        console.error('Registration error:', err)
      }
    }
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
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-accent text-2xl font-semibold md:text-3xl">{t('registerPage.title')}</h1>
          <form className="my-5 flex w-full flex-col items-center gap-4 md:p-6" onSubmit={handleSubmit}>
            <FormInput
              label={t('registerPage.firstName')}
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              error={submitted ? errors.firstName : undefined}
            />
            <FormInput
              label={t('registerPage.lastName')}
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              error={submitted ? errors.lastName : undefined}
            />
            <FormInput
              label={t('registerPage.email')}
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={submitted ? errors.email : undefined}
            />
            <FormInput
              label={t('registerPage.password')}
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={submitted ? errors.password : undefined}
            />
            <FormInput
              label={t('registerPage.confirmPassword')}
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              error={submitted ? errors.confirmPassword : undefined}
            />
            <FormButton type="submit" disabled={authLoading}>
              {t('registerPage.registerButton')}
            </FormButton>
          </form>
          <p>
            {t('registerPage.alreadyHaveAccount')}{' '}
            <Link to="/" className="text-accent">
              {t('registerPage.loginLink')}
            </Link>
          </p>
        </div>
        <div className="hidden w-full items-center justify-center lg:flex">
          <StorySetImage
            image={People}
            alt="Register Illustration"
            link="https://storyset.com/people"
            text="People illustrations by Storyset"
          />
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
