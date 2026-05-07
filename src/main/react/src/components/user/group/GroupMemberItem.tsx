import { useTranslation } from 'react-i18next'
import type { UserDto } from '../../../api/userService'
import { FiTrash } from 'react-icons/fi'
import FormButton from '../../basic/FormButton.tsx'
import { useAuth } from '../../../contexts/AuthContext.tsx'

interface Props {
  member: UserDto
  balances: Record<number, number>
  getUserById: (id: number) => UserDto | undefined
  onRemoveMember: (userId: number) => void
  creditorEmail: string
}

function GroupMemberItem({ member, balances, getUserById, onRemoveMember, creditorEmail }: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="flex items-center justify-between gap-2">
      <li className="bg-bg dark:bg-bg-dark/80 w-full rounded-md p-2">
        <div className="font-medium">
          {member.firstName} {member.lastName}
        </div>
        {balances && Object.keys(balances).length > 0 ? (
          <ul className="mt-1">
            {Object.entries(balances).map(([creditorId, amount]) => {
              const creditor = getUserById(parseInt(creditorId))
              if (amount > 0 && creditor) {
                return (
                  <li key={creditorId} className="grid grid-cols-[1fr_auto] text-xs text-gray-600 md:text-sm dark:text-gray-400">
                    <span className="text-left">
                      {t('groupPage.mustPay')} {creditor.firstName} {creditor.lastName}:
                    </span>
                    <span className="font-medium">{amount} PLN</span>
                  </li>
                )
              }
              return null
            })}
          </ul>
        ) : (
          <div className="mt-1 text-xs text-gray-600 md:text-sm dark:text-gray-400">{t('groupPage.nothingToSettle')}</div>
        )}
      </li>
      {user && creditorEmail === user.email && member.email != creditorEmail && (
        <FormButton
          type="button"
          onClick={() => onRemoveMember(member.id)}
          className="max-w-fit rounded-lg bg-red-400 px-3 text-white hover:bg-red-300"
        >
          <FiTrash />
        </FormButton>
      )}
    </div>
  )
}

export default GroupMemberItem
