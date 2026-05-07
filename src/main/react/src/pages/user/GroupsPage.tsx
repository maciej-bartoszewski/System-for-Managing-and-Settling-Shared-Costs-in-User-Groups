import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FormInput from '../../components/basic/FormInput.tsx'
import FormButton from '../../components/basic/FormButton.tsx'
import { getMyGroups, type GroupDto, joinGroup } from '../../api/groupService.ts'
import { showError, showSuccess } from '../../components/alerts/swalAlerts.ts'
import GroupCard from '../../components/user/groups/GroupCard.tsx'
import Loading from '../../components/basic/Loading.tsx'
import CreateGroupModal from '../../components/modals/CreateGroupModal.tsx'
import Group from '../../assets/group.svg'

function GroupsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')
  const [groups, setGroups] = useState<GroupDto[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const userGroups = await getMyGroups()
      setGroups(userGroups)
    } catch (e) {
      console.error('Error fetching groups:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      showError(t('userGroupsPage.emptyInviteCode'))
      return
    }

    setJoining(true)
    try {
      const group = await joinGroup(inviteCode)
      showSuccess(t('userGroupsPage.joinSuccess'))
      setInviteCode('')
      if (group) {
        navigate(`/groups/${group.id}`)
      } else {
        fetchGroups()
      }
    } catch (e) {
      console.error('Error joining group:', e)
      showError(t('userGroupsPage.joinError'))
    } finally {
      setJoining(false)
    }
  }

  const handleGroupCreated = (newGroup?: GroupDto) => {
    if (newGroup) {
      navigate(`/groups/${newGroup.id}`)
    } else {
      fetchGroups()
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark relative z-10 flex h-full w-full flex-col overflow-hidden rounded-2xl p-5 shadow-md lg:max-w-[90%]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${Group})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.1,
          }}
        />

        <div className="relative z-10">
          <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-accent text-xl font-bold text-nowrap lg:text-2xl">{t('userGroupsPage.title')}</h1>
            <div className="flex w-full max-w-full flex-col gap-4 sm:flex-row sm:items-center md:max-w-md">
              <FormInput
                label={t('userGroupsPage.inviteCode')}
                name="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <FormButton className="px-5 sm:max-w-fit" onClick={handleJoinGroup} disabled={joining}>
                  {t('userGroupsPage.joinButton')}
                </FormButton>
                {joining && <Loading />}
              </div>
            </div>
            <FormButton className="px-5 sm:max-w-fit" onClick={() => setShowCreateModal(true)}>
              {t('userGroupsPage.createButton')}
            </FormButton>
          </div>

          {groups.length === 0 ? (
            <div className="bg-bg dark:bg-bg-dark rounded-md p-3 text-center">{t('userGroupsPage.noGroups')}</div>
          ) : (
            <div className="relative grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onGroupCreated={handleGroupCreated} />}
    </section>
  )
}

export default GroupsPage
