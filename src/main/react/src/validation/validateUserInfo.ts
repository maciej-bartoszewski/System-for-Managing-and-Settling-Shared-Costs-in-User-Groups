import type { TFunction } from 'i18next'

export interface UserInfoFormValues {
  firstName: string
  lastName: string
}

export interface UserInfoFormErrors {
  firstName?: string
  lastName?: string
}

export function validateUserInfo(values: UserInfoFormValues, t: TFunction): UserInfoFormErrors {
  const errors: UserInfoFormErrors = {}

  if (!values.firstName) {
    errors.firstName = t('profilePage.info.errors.firstNameRequired')
  }

  if (!values.lastName) {
    errors.lastName = t('profilePage.info.errors.lastNameRequired')
  }

  return errors
}
