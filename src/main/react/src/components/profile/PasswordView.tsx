import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from '../basic/FormInput.tsx'
import { MdLockReset } from 'react-icons/md'
import ProfileViewLayout from './ProfileViewLayout.tsx'
import ProfileCardItem from './ProfileCardItem.tsx'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { updateUserPassword } from '../../api/userService'
import {
  type PasswordUpdateFormErrors,
  type PasswordUpdateFormValues,
  validatePasswordUpdate,
} from '../../validation/validatePasswordUpdate'
import { showError, showSuccess } from '../alerts/swalAlerts'

const PasswordView = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [formData, setFormData] = useState<PasswordUpdateFormValues>({
    currentPassword: '',
    newPassword: '',
    repeatedPassword: '',
  })
  const [errors, setErrors] = useState<PasswordUpdateFormErrors>({})

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

    const validationErrors = validatePasswordUpdate(formData, t)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await updateUserPassword(user.id, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      setFormData({
        currentPassword: '',
        newPassword: '',
        repeatedPassword: '',
      })
      showSuccess(t('profilePage.password.passwordUpdated'))
    } catch (error) {
      console.error('Error updating password:', error)

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showError(t('profilePage.password.errors.invalidPassword'))
      } else {
        showError(t('profilePage.password.errors.updateFailed'))
      }
    }
  }

  return (
    <ProfileViewLayout
      icon={MdLockReset}
      titleKey="profilePage.password.title"
      subtitleKey="profilePage.password.subtitle"
      onSubmit={handleSubmit}
    >
      <ProfileCardItem title={t('profilePage.password.currentPassword')} description={t('profilePage.password.currentPasswordDescription')}>
        <FormInput
          label={t('profilePage.password.currentPassword')}
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />
      </ProfileCardItem>

      <ProfileCardItem title={t('profilePage.password.newPassword')} description={t('profilePage.password.newPasswordDescription')}>
        <div className="flex flex-col gap-4">
          <FormInput
            label={t('profilePage.password.newPassword')}
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <FormInput
            label={t('profilePage.password.repeatPassword')}
            type="password"
            name="repeatedPassword"
            value={formData.repeatedPassword}
            onChange={handleChange}
            error={errors.repeatedPassword}
          />
        </div>
      </ProfileCardItem>
    </ProfileViewLayout>
  )
}

export default PasswordView
