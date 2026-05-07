import type { TFunction } from 'i18next'

export interface RegisterFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
}

export interface RegisterFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function validateRegister(values: RegisterFormValues, t: TFunction): RegisterFormErrors {
  const errors: RegisterFormErrors = {}

  if (!values.firstName) {
    errors.firstName = t('registerPage.errors.firstNameRequired')
  }

  if (!values.lastName) {
    errors.lastName = t('registerPage.errors.lastNameRequired')
  }

  if (!values.email) {
    errors.email = t('registerPage.errors.emailRequired')
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
    errors.email = t('registerPage.errors.emailInvalid')
  }

  if (!values.password) {
    errors.password = t('registerPage.errors.passwordRequired')
  } else if (values.password.length < 6) {
    errors.password = t('registerPage.errors.passwordTooShort')
  } else {
    const hasUppercase = /[A-Z]/.test(values.password)
    const hasLowercase = /[a-z]/.test(values.password)
    const hasDigit = /[0-9]/.test(values.password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(values.password)

    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      errors.password = t('registerPage.errors.passwordTooWeak')
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = t('registerPage.errors.confirmPasswordRequired')
  } else if (values.password && values.confirmPassword !== values.password) {
    errors.confirmPassword = t('registerPage.errors.passwordsDoNotMatch')
  }

  return errors
}
