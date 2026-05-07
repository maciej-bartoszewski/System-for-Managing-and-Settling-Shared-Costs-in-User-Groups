import { useTranslation } from 'react-i18next'
import ModalWithInputs from '../basic/ModalWithInputs.tsx'
import { createGroup, type GroupDto } from '../../api/groupService.ts'
import { showError, showSuccess } from '../alerts/swalAlerts.ts'

interface CreateGroupModalProps {
  onClose: () => void
  onGroupCreated: (group?: GroupDto) => void
}

function CreateGroupModal({ onClose, onGroupCreated }: CreateGroupModalProps) {
  const { t } = useTranslation()

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const newGroup = await createGroup({ name: formData.name, description: formData.description })
      showSuccess(t('userGroupsPage.createSuccess'))
      onGroupCreated(newGroup)
      onClose()
    } catch (e) {
      console.error('Error creating group:', e)
      showError(t('userGroupsPage.createError'))
    }
  }

  return (
    <ModalWithInputs
      title={t('userGroupsPage.createTitle')}
      inputs={[
        { label: t('userGroupsPage.createName'), name: 'name', required: true },
        { label: t('userGroupsPage.createDescription'), name: 'description' },
      ]}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitButtonText={t('userGroupsPage.createButton')}
      cancelButtonText={t('userGroupsPage.cancelButton')}
    />
  )
}

export default CreateGroupModal
