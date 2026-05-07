import type { TFunction } from 'i18next'

export interface LoginFormValues {
  email: string
  password: string
}

export interface LoginFormErrors {
  email?: string
  password?: string
}

export function validateLogin(values: LoginFormValues, t: TFunction): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.email) {
    errors.email = t('loginPage.errors.emailRequired')
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
    errors.email = t('loginPage.errors.emailInvalid')
  }

  if (!values.password) {
    errors.password = t('loginPage.errors.passwordRequired')
  }

  return errors
}
