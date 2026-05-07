import type { TFunction } from 'i18next'

export interface EmailUpdateFormValues {
  email: string
  password: string
}

export interface EmailUpdateFormErrors {
  email?: string
  password?: string
}

export function validateEmailUpdate(values: EmailUpdateFormValues, t: TFunction): EmailUpdateFormErrors {
  const errors: EmailUpdateFormErrors = {}

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
