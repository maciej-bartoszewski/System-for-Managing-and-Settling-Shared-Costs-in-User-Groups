import { FiTrash, FiUser } from 'react-icons/fi'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { ImBlocked } from 'react-icons/im'
import { type UserDto } from '../../../api/userService.ts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import FormButton from '../../basic/FormButton.tsx'

interface UserCardProps {
  user: UserDto
  onDelete: (id: number) => void
}

function UserCard({ user, onDelete }: UserCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="border-gray/20 dark:border-gray-dark/30 flex cursor-pointer items-center justify-between rounded-2xl border p-5 shadow-md transition-transform duration-300 hover:scale-103"
      onClick={() => navigate(`/admin/users/${user.id}`)}
    >
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(() => {
              switch (user.role) {
                case 'ADMIN':
                  return <MdOutlineAdminPanelSettings className="text-accent text-3xl" />
                case 'BLOCKED':
                  return <ImBlocked className="text-accent text-2xl" />
                case 'USER':
                default:
                  return <FiUser className="text-accent text-2xl" />
              }
            })()}
            <div>
              <div className="text-lg font-semibold md:text-lg">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs md:text-sm">{user.email}</div>
            </div>
          </div>
          <FormButton
            className="max-w-fit bg-red-400 px-3 hover:bg-red-300"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(user.id)
            }}
          >
            <FiTrash />
          </FormButton>
        </div>

        <div className="mb-1 text-xs md:text-sm">
          <span className="font-semibold">{t('adminUsers.userCard.role')}</span> {t(`adminUsers.userCard.${user.role}`)}
        </div>

        <div className="mb-1 text-xs md:text-sm">
          <span className="font-semibold">{t('adminUsers.userCard.accountType')}</span> {t(`adminUsers.userCard.${user.authProvider}`)}
        </div>

        <div className="mb-4 text-xs md:text-sm">
          <span className="font-semibold">{t('adminUsers.userCard.lastLogin')}</span>{' '}
          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
        </div>
      </div>
    </div>
  )
}

export default UserCard
