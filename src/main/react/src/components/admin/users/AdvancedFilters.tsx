import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

interface AdvancedFiltersProps {
  roleFilter: string
  setRoleFilter: (role: string) => void
  providerFilter: string
  setProviderFilter: (provider: string) => void
  resetFilters: () => void
  show: boolean
}

const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  BLOCKED: 'BLOCKED',
}

const AuthProvider = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
}

function AdvancedFilters({ roleFilter, setRoleFilter, providerFilter, setProviderFilter, resetFilters, show }: AdvancedFiltersProps) {
  const { t } = useTranslation()

  if (!show) return null

  return (
    <div className="bg-bg dark:bg-bg-dark/30 mb-6 rounded-xl p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium">{t('adminUsers.advancedFilters.title')}</h2>
        <button onClick={resetFilters} className="hover:text-accent flex cursor-pointer items-center gap-1">
          <FiX /> {t('adminUsers.advancedFilters.reset')}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block">{t('adminUsers.advancedFilters.role')}</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
            }}
            className="focus:border-accent dark:border-bg dark:bg-surface-dark w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:outline-none"
          >
            <option value="">{t('adminUsers.advancedFilters.allRoles')}</option>
            <option value={Role.ADMIN}>{t('adminUsers.userCard.ADMIN')}</option>
            <option value={Role.USER}>{t('adminUsers.userCard.USER')}</option>
            <option value={Role.BLOCKED}>{t('adminUsers.userCard.BLOCKED')}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block">{t('adminUsers.advancedFilters.accountType')}</label>
          <select
            value={providerFilter}
            onChange={(e) => {
              setProviderFilter(e.target.value)
            }}
            className="focus:border-accent dark:border-bg dark:bg-surface-dark w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:outline-none"
          >
            <option value="">{t('adminUsers.advancedFilters.allTypes')}</option>
            <option value={AuthProvider.LOCAL}>{t('adminUsers.userCard.LOCAL')}</option>
            <option value={AuthProvider.GOOGLE}>{t('adminUsers.userCard.GOOGLE')}</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilters
