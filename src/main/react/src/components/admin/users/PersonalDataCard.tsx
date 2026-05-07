import FormInput from '../../basic/FormInput'
import { type UserDto, type UserEditRequest } from '../../../api/userService'
import { type EditUserFormErrors } from '../../../validation/validateEditUser'
import { useTranslation } from 'react-i18next'
import type { ChangeEvent } from 'react'

interface PersonalDataCardProps {
  formData: UserEditRequest
  errors: EditUserFormErrors
  user: UserDto
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function PersonalDataCard({ formData, errors, user, onChange }: PersonalDataCardProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 p-0">
      <h2 className="text-accent mb-2 text-xl font-semibold md:text-2xl">{t('profilePage.info.personalData')}</h2>
      <FormInput
        label={t('profilePage.info.firstName')}
        name="firstName"
        value={formData.firstName}
        onChange={onChange}
        error={errors.firstName}
      />
      <FormInput
        label={t('profilePage.info.lastName')}
        name="lastName"
        value={formData.lastName}
        onChange={onChange}
        error={errors.lastName}
      />
      {user.authProvider === 'LOCAL' && (
        <FormInput
          label={t('profilePage.password.newPassword')}
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
        />
      )}
      {user.authProvider === 'LOCAL' ? (
        <FormInput label={t('loginPage.email')} name="email" value={formData.email} onChange={onChange} error={errors.email} />
      ) : (
        <div>
          <p className="mb-1 text-xs font-medium md:text-sm">{t('loginPage.email')}</p>
          <p className="bg-bg dark:bg-bg-dark/30 rounded-lg border border-gray-300 p-2">{user.email}</p>
        </div>
      )}
    </div>
  )
}

export default PersonalDataCard
