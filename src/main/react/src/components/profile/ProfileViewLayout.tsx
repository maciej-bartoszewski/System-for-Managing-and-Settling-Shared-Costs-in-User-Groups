import React from 'react'
import { useTranslation } from 'react-i18next'
import FormButton from '../basic/FormButton.tsx'
import type { IconType } from 'react-icons'

interface ProfileViewLayoutProps {
  icon: IconType
  titleKey: string
  subtitleKey: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  submitButtonText?: string
}

const ProfileViewLayout: React.FC<ProfileViewLayoutProps> = ({
  icon: Icon,
  titleKey,
  subtitleKey,
  children,
  onSubmit,
  submitButtonText = 'saveChanges',
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <div className="mb-4 flex flex-col items-center">
        <Icon className="text-accent mb-2 text-xl md:text-3xl" />
        <h1 className="text-center text-base md:text-xl">{t(titleKey)}</h1>
        <p className="text-2xs text-center md:text-sm">{t(subtitleKey)}</p>
      </div>
      <form className="mx-auto flex w-full max-w-130 flex-col p-4" onSubmit={onSubmit}>
        <div className="mb-6 flex flex-col gap-7">{children}</div>
        <FormButton type="submit">{t(submitButtonText)}</FormButton>
      </form>
    </div>
  )
}

export default ProfileViewLayout
