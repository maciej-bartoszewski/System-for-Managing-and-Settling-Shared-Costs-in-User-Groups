import { FiTrash } from 'react-icons/fi'
import { type GroupDto } from '../../../api/groupService'
import { useTranslation } from 'react-i18next'
import FormButton from '../../basic/FormButton'
import { GrGroup } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'

interface GroupCardProps {
  group: GroupDto
  onDelete: (id: number) => void
}

function GroupCard({ group, onDelete }: GroupCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="border-gray/20 dark:border-gray-dark/30 flex cursor-pointer items-center justify-between rounded-2xl border p-5 shadow-md transition-transform duration-300 hover:scale-103"
      onClick={() => navigate(`/admin/groups/${group.id}`)}
    >
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GrGroup className="text-accent text-2xl" />
            <div>
              <div className="text-lg font-semibold md:text-lg">{group.name}</div>
              <div className="text-xs md:text-sm">{group.description}</div>
            </div>
          </div>
          <FormButton
            className="max-w-fit bg-red-400 px-3 hover:bg-red-300"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(group.id)
            }}
          >
            <FiTrash />
          </FormButton>
        </div>

        <div className="mb-1 text-xs md:text-sm">
          <span className="font-semibold">{t('adminGroups.groupCard.createdBy')}</span> {group.createdByEmail ? group.createdByEmail : '-'}
        </div>

        <div className="mb-1 text-xs md:text-sm">
          <span className="font-semibold">{t('adminGroups.groupCard.createdAt')}</span>{' '}
          {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : '—'}
        </div>

        <div className="mb-1 text-xs md:text-sm">
          <span className="font-semibold">{t('adminGroups.groupCard.inviteCode')}</span> {group.inviteCode}
        </div>
      </div>
    </div>
  )
}

export default GroupCard
