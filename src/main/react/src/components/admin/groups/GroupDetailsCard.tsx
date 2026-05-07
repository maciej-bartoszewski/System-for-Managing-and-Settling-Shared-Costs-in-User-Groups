import FormButton from '../../basic/FormButton'
import FormInput from '../../basic/FormInput'
import { type GroupDto, type GroupRequestDto } from '../../../api/groupService'
import { useTranslation } from 'react-i18next'
import { FiLink } from 'react-icons/fi'

interface GroupDetailsCardProps {
  group: GroupDto
  formData: GroupRequestDto
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete: (e: React.FormEvent) => void
  generateCode: (e: React.FormEvent) => void
}

function GroupDetailsCard({ group, formData, onChange, onSubmit, onDelete, generateCode }: GroupDetailsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 p-0">
      <h2 className="text-accent mb-2 text-xl font-semibold md:text-2xl">{t('adminGroupEdit.groupDetails')}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormInput label={t('adminGroupEdit.name')} name="name" value={formData.name} onChange={onChange} />
        <FormInput label={t('adminGroupEdit.description')} name="description" value={formData.description} onChange={onChange} />
        <div>
          <p className="mb-1 text-xs font-medium md:text-sm">{t('adminGroups.groupCard.createdBy')}</p>
          <p className="bg-bg dark:bg-bg-dark/80 rounded-lg border border-gray-300 p-2">
            {group.createdByEmail ? group.createdByEmail : '-'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium md:text-sm">{t('adminGroups.groupCard.inviteCode')}</p>
          <div className="flex flex-row gap-2">
            <p className="bg-bg dark:bg-bg-dark/80 w-full rounded-lg border border-gray-300 p-2">
              {group.inviteCode ? group.inviteCode : '-'}
            </p>
            <FormButton className="max-w-fit px-3" onClick={generateCode}>
              <FiLink size={16} />
            </FormButton>
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium md:text-sm">{t('adminGroups.groupCard.createdAt')}</p>
          <p className="bg-bg dark:bg-bg-dark/80 rounded-lg border border-gray-300 p-2">{new Date(group.createdAt).toLocaleDateString()}</p>
        </div>
        <FormButton className="mx-auto mt-4" type="submit">
          {t('saveChanges')}
        </FormButton>
        <FormButton type="button" onClick={onDelete} className="bg-red-400 hover:bg-red-300">
          {t('adminGroups.groupCard.delete')}
        </FormButton>
      </form>
    </div>
  )
}

export default GroupDetailsCard
