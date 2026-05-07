import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Loading from '../../components/basic/Loading'
import { FiArrowLeft } from 'react-icons/fi'
import {
  addUserToGroup,
  deleteGroup,
  generateInviteCode,
  getGroupById,
  getGroupMembers,
  type GroupDto,
  type GroupRequestDto,
  removeUserFromGroup,
  updateGroup,
} from '../../api/groupService'
import { type UserDto } from '../../api/userService'
import { showConfirm, showError, showSuccess } from '../../components/alerts/swalAlerts'
import Group from '../../assets/group.svg'
import StorySetImage from '../../components/basic/StorySetImage'
import GroupDetailsCard from '../../components/admin/groups/GroupDetailsCard.tsx'
import GroupMembersCard from '../../components/admin/groups/GroupMembersCard.tsx'

function EditGroupPage() {
  const { id } = useParams<{ id: string }>()
  const groupId = parseInt(id || '0')
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [group, setGroup] = useState<GroupDto | null>(null)
  const [members, setMembers] = useState<UserDto[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const [formData, setFormData] = useState<GroupRequestDto>({
    name: '',
    description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) return

      setLoading(true)
      try {
        const groupData = await getGroupById(groupId)
        setGroup(groupData)
        setFormData({
          name: groupData.name,
          description: groupData.description || '',
        })

        const membersData = await getGroupMembers(groupId)
        setMembers(membersData)
      } catch (error) {
        console.error('Error fetching group data:', error)
        showError(t('errors.serverError'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [groupId, t])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showError(t('adminGroupEdit.errors.nameRequired'))
      return
    }

    try {
      await updateGroup(groupId, formData)
      showSuccess(t('adminGroupEdit.updateSuccess'))

      const groupData = await getGroupById(groupId)
      setGroup(groupData)
    } catch (error) {
      console.error('Error updating group:', error)
      showError(t('errors.serverError'))
    }
  }

  const handleAddMember = async () => {
    if (!newEmail.trim()) {
      setEmailError(t('adminGroupEdit.errors.emailRequired'))
      return
    }

    setAdding(true)
    try {
      await addUserToGroup(groupId, newEmail)
      const membersData = await getGroupMembers(groupId)
      setMembers(membersData)
      setNewEmail('')
      setEmailError('')
      showSuccess(t('adminGroupEdit.memberAddSuccess'))
    } catch (error) {
      console.error('Error adding member:', error)
      setEmailError(t('adminGroupEdit.errors.userNotFound'))
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveMember = async (userId: number) => {
    const result = await showConfirm(t('adminGroupEdit.confirmRemove'), t('adminGroupEdit.remove'))

    if (result.isConfirmed) {
      try {
        await removeUserFromGroup(groupId, userId)
        const membersData = await getGroupMembers(groupId)
        setMembers(membersData)
        showSuccess(t('adminGroupEdit.memberRemoveSuccess'))
      } catch (error) {
        console.error('Error removing member:', error)
        showError(t('errors.serverError'))
      }
    }
  }

  const handleDeleteGroup = async () => {
    const result = await showConfirm(t('adminGroups.confirmDelete'), t('adminGroups.groupCard.delete'))

    if (result.isConfirmed) {
      try {
        await deleteGroup(groupId)
        showSuccess(t('adminGroups.deleteSuccess'))
        navigate('/admin/groups')
      } catch (error) {
        console.error('Error deleting group:', error)
      }
    }
  }

  const handleGenerateInviteCode = async () => {
    try {
      await generateInviteCode(groupId)
      const groupData = await getGroupById(groupId)
      setGroup(groupData)
      showSuccess(t('adminGroups.inviteCodeGenerated'))
    } catch (error) {
      console.error('Error:', error)
      showError(t('adminGroups.inviteCodeGenerateFailed'))
    }
  }

  const goBack = () => {
    navigate('/admin/groups')
  }

  if (loading || !group) return <Loading />

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark relative flex h-full w-full max-w-[90%] flex-col rounded-2xl p-5 shadow-md lg:flex-row">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            backgroundImage: `url(${Group})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08,
          }}
        />

        <div className="relative z-10 flex w-full items-center justify-center lg:w-1/2">
          <div className="flex w-full max-w-lg flex-col gap-6">
            <button onClick={goBack} className="text-accent hover:text-accent/70 flex cursor-pointer items-center gap-2">
              <FiArrowLeft /> {t('adminGroups.title')}
            </button>
            <GroupDetailsCard
              group={group}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onDelete={handleDeleteGroup}
              generateCode={handleGenerateInviteCode}
            />

            <GroupMembersCard
              members={members}
              newEmail={newEmail}
              emailError={emailError}
              adding={adding}
              onEmailChange={(e) => {
                setNewEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          </div>
        </div>

        <div className="mt-10 hidden w-1/2 items-center justify-center lg:mt-0 lg:flex">
          <StorySetImage
            image={Group}
            alt={t('adminGroupEdit.title')}
            link="https://storyset.com/people"
            text="People illustrations by Storyset"
            imgClassName="max-h-200"
          />
        </div>
      </div>
    </section>
  )
}

export default EditGroupPage
