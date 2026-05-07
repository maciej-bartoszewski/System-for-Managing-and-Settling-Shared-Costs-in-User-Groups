import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from '../basic/FormInput.tsx'
import { MdEmail } from 'react-icons/md'
import ProfileViewLayout from './ProfileViewLayout.tsx'
import ProfileCardItem from './ProfileCardItem.tsx'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { updateUserEmail } from '../../api/userService'
import { type EmailUpdateFormErrors, type EmailUpdateFormValues, validateEmailUpdate } from '../../validation/validateEmailUpdate'
import { showError, showSuccess } from '../alerts/swalAlerts'

const EmailView = () => {
  const { t } = useTranslation()
  const { user, updateUserData } = useAuth()
  const [formData, setFormData] = useState<EmailUpdateFormValues>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<EmailUpdateFormErrors>({})

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!user) return

    const validationErrors = validateEmailUpdate(formData, t)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await updateUserEmail(user.id, formData)
      updateUserData({ email: formData.email })
      setFormData((prev) => ({
        ...prev,
        password: '',
      }))
      showSuccess(t('profilePage.email.emailUpdated'))
    } catch (error) {
      console.error('Error updating email:', error)

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showError(t('profilePage.email.errors.invalidPassword'))
      } else {
        showError(t('profilePage.email.errors.updateFailed'))
      }
    }
  }

  return (
    <ProfileViewLayout icon={MdEmail} titleKey="profilePage.email.title" subtitleKey="profilePage.email.subtitle" onSubmit={handleSubmit}>
      <ProfileCardItem title={t('profilePage.email.newEmail')} description={t('profilePage.email.newEmailDescription')}>
        <FormInput
          label={t('loginPage.email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </ProfileCardItem>

      <ProfileCardItem title={t('profilePage.email.confirmIdentity')} description={t('profilePage.email.confirmIdentityDescription')}>
        <FormInput
          label={t('loginPage.password')}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
      </ProfileCardItem>
    </ProfileViewLayout>
  )
}

export default EmailView
