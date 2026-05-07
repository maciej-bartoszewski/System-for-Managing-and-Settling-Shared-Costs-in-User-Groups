import { GrGroup } from 'react-icons/gr'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { GroupDto } from '../../../api/groupService'

interface GroupCardProps {
  group: GroupDto
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="border-gray/20 dark:border-gray-dark/30 bg-surface dark:bg-surface-dark flex cursor-pointer flex-col items-center rounded-xl border p-6 text-center shadow-md transition-transform duration-300 hover:scale-103"
      onClick={() => navigate(`/groups/${group.id}`)}
    >
      <div className="bg-accent mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <GrGroup className="text-2xl text-white" />
      </div>
      <h2 className="mb-2 text-lg font-semibold md:text-xl">{group.name}</h2>
      <p className="text-gray dark:text-gray-dark mb-4 text-xs md:text-sm">{group.description}</p>
      <p className="text-gray dark:text-gray-dark text-xs md:text-xs">
        {t('userGroupsPage.createdBy', { email: group.createdByEmail ? group.createdByEmail : '-' })}
      </p>
    </div>
  )
}

export default GroupCard
