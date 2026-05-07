import type { TFunction } from 'i18next'

export interface PasswordUpdateFormValues {
  currentPassword: string
  newPassword: string
  repeatedPassword: string
}

export interface PasswordUpdateFormErrors {
  currentPassword?: string
  newPassword?: string
  repeatedPassword?: string
}

export function validatePasswordUpdate(values: PasswordUpdateFormValues, t: TFunction): PasswordUpdateFormErrors {
  const errors: PasswordUpdateFormErrors = {}

  if (!values.currentPassword) {
    errors.currentPassword = t('profilePage.password.errors.currentPasswordRequired')
  }

  if (!values.newPassword) {
    errors.newPassword = t('profilePage.password.errors.newPasswordRequired')
  } else if (values.newPassword.length < 6) {
    errors.newPassword = t('profilePage.password.errors.newPasswordTooShort')
  } else {
    const hasUppercase = /[A-Z]/.test(values.newPassword)
    const hasLowercase = /[a-z]/.test(values.newPassword)
    const hasDigit = /[0-9]/.test(values.newPassword)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(values.newPassword)

    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      errors.newPassword = t('profilePage.password.errors.newPasswordTooWeak')
    }
  }

  if (!values.repeatedPassword) {
    errors.repeatedPassword = t('profilePage.password.errors.repeatedPasswordRequired')
  } else if (values.newPassword !== values.repeatedPassword) {
    errors.repeatedPassword = t('profilePage.password.errors.passwordsDoNotMatch')
  }

  return errors
}
