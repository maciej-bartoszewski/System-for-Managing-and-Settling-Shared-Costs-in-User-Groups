import FormButton from '../../basic/FormButton'
import FormInput from '../../basic/FormInput'
import Loading from '../../basic/Loading'
import { type UserDto } from '../../../api/userService'
import { FiTrash } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

interface GroupMembersCardProps {
  members: UserDto[]
  newEmail: string
  emailError: string
  adding: boolean
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAddMember: () => void
  onRemoveMember: (userId: number) => void
}

function GroupMembersCard({ members, newEmail, emailError, adding, onEmailChange, onAddMember, onRemoveMember }: GroupMembersCardProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-4 flex flex-col gap-4 p-0">
      <h2 className="text-accent mb-2 text-xl font-semibold md:text-2xl">{t('adminGroupEdit.members')}</h2>
      <div className="mb-2 flex items-center gap-2">
        <FormInput label={t('adminGroupEdit.emailPlaceholder')} name="email" value={newEmail} onChange={onEmailChange} error={emailError} />
        <div className="flex items-center gap-2">
          <FormButton type="button" onClick={onAddMember} disabled={adding} className="max-w-fit px-3 whitespace-nowrap">
            {t('adminGroupEdit.add')}
          </FormButton>
          {adding && <Loading />}
        </div>
      </div>
      <h3 className="mt-2 text-base font-semibold">{t('adminGroupEdit.membersList')}</h3>
      {members.length === 0 ? (
        <p className="text-sm text-gray-500">{t('adminGroupEdit.noMembers')}</p>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-bg dark:bg-surface-dark flex items-center justify-between rounded-lg border border-gray-300 p-2 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium">{`${member.firstName} ${member.lastName}`}</span>
                <span className="text-sm text-gray-500">{member.email}</span>
              </div>
              <FormButton
                type="button"
                onClick={() => onRemoveMember(member.id)}
                className="max-w-fit rounded-lg bg-red-400 px-3 text-white hover:bg-red-300"
              >
                <FiTrash />
              </FormButton>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GroupMembersCard
