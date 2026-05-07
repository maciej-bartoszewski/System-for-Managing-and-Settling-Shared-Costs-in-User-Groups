import { useTranslation } from 'react-i18next'
import { type UserDto, type UserEditRequest } from '../../../api/userService'
import type { ChangeEvent } from 'react'

interface AccountDetailsCardProps {
  formData: UserEditRequest
  user: UserDto
  roles: string[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

function AccountDetailsCard({ formData, user, roles, onChange }: AccountDetailsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-4 flex flex-col gap-4 p-0">
      <h2 className="text-accent mb-2 text-xl font-semibold md:text-2xl">{t('adminUsers.userCard.accountType')}</h2>
      <div>
        <p className="mb-1 text-xs font-medium md:text-sm">{t('adminUsers.userCard.accountType')}</p>
        <p className="bg-bg dark:bg-bg-dark/80 rounded-lg border border-gray-300 p-2">{t(`adminUsers.userCard.${user.authProvider}`)}</p>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium md:text-sm">{t('adminUsers.userCard.lastLogin')}</p>
        <p className="bg-bg dark:bg-bg-dark/80 rounded-lg border border-gray-300 p-2">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
        </p>
      </div>
      <div>
        <label htmlFor="role" className="mb-1 block text-xs font-medium md:text-sm">
          {t('adminUsers.userCard.role')}
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={onChange}
          className="focus:border-accent dark:border-bg dark:bg-surface-dark w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:outline-none"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {t(`adminUsers.userCard.${role}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AccountDetailsCard
