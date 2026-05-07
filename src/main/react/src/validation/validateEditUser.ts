import type { TFunction } from 'i18next'

export interface EditUserFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  authProvider: string
}

export interface EditUserFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

export function validateEditUser(values: EditUserFormValues, t: TFunction): EditUserFormErrors {
  const errors: EditUserFormErrors = {}

  if (!values.firstName) {
    errors.firstName = t('profilePage.info.errors.firstNameRequired')
  }
  if (!values.lastName) {
    errors.lastName = t('profilePage.info.errors.lastNameRequired')
  }
  if (values.authProvider === 'LOCAL') {
    if (!values.email.trim()) {
      errors.email = t('profilePage.email.errors.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = t('profilePage.email.errors.emailInvalid')
    }
    if (values.password && values.password.length < 6) {
      errors.password = t('profilePage.password.errors.newPasswordTooShort')
    }
  }

  return errors
}
