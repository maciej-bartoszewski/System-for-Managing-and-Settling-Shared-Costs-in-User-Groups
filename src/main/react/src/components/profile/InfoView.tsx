import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from '../basic/FormInput.tsx'
import { MdPerson } from 'react-icons/md'
import ProfileViewLayout from './ProfileViewLayout.tsx'
import ProfileCardItem from './ProfileCardItem.tsx'
import { useAuth } from '../../contexts/AuthContext'
import { updateUserName } from '../../api/userService'
import { type UserInfoFormErrors, type UserInfoFormValues, validateUserInfo } from '../../validation/validateUserInfo'
import { showError, showSuccess } from '../alerts/swalAlerts'

const InfoView = () => {
  const { t } = useTranslation()
  const { user, updateUserData } = useAuth()
  const [formData, setFormData] = useState<UserInfoFormValues>({
    firstName: '',
    lastName: '',
  })
  const [errors, setErrors] = useState<UserInfoFormErrors>({})

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
      })
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

    const validationErrors = validateUserInfo(formData, t)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await updateUserName(user.id, formData)
      updateUserData(formData)
      showSuccess(t('profilePage.info.infoUpdated'))
    } catch (error) {
      console.error('Error updating user info:', error)
      showError(t('profilePage.info.errors.updateFailed'))
    }
  }

  return (
    <ProfileViewLayout icon={MdPerson} titleKey="profilePage.info.title" subtitleKey="profilePage.info.subtitle" onSubmit={handleSubmit}>
      <ProfileCardItem title={t('profilePage.info.personalData')} description={t('profilePage.info.personalDataDescription')}>
        <div className="flex flex-col gap-4">
          <FormInput
            label={t('profilePage.info.firstName')}
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <FormInput
            label={t('profilePage.info.lastName')}
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>
      </ProfileCardItem>
    </ProfileViewLayout>
  )
}

export default InfoView
