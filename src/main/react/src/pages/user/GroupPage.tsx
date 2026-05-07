import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addUserToGroup,
  deleteGroup,
  generateInviteCode,
  getGroupById,
  getGroupMembers,
  type GroupDto,
  leaveGroup,
  removeUserFromGroup,
} from '../../api/groupService'
import type { ExpenseResponseDto, ExpenseSplitDto } from '../../api/expenseService'
import { getExpensesByGroupId, getGroupBalances } from '../../api/expenseService'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import FormButton from '../../components/basic/FormButton'
import FormInput from '../../components/basic/FormInput'
import CreateExpenseModal from '../../components/modals/CreateExpenseModal'
import CreateSettlementModal from '../../components/modals/CreateSettlementModal'
import { showConfirm, showError, showSuccess } from '../../components/alerts/swalAlerts'
import type { UserDto } from '../../api/userService'
import { getSettlementsByGroupId, type SettlementResponseDto } from '../../api/settlementService'
import Loading from '../../components/basic/Loading.tsx'
import GroupMemberItem from '../../components/user/group/GroupMemberItem'
import GroupExpenseItem from '../../components/user/group/GroupExpenseItem'
import GroupSettlementItem from '../../components/user/group/GroupSettlementItem'
import { FiChevronDown, FiLink } from 'react-icons/fi'
import StorySetImage from '../../components/basic/StorySetImage.tsx'
import People from '../../assets/people.svg'

function GroupPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { groupId } = useParams<{ groupId: string }>()
  const [group, setGroup] = useState<GroupDto | null>(null)
  const [members, setMembers] = useState<UserDto[]>([])
  const [expenses, setExpenses] = useState<ExpenseResponseDto[]>([])
  const [settlements, setSettlements] = useState<SettlementResponseDto[]>([])
  const [balances, setBalances] = useState<Record<number, Record<number, number>>>({})
  const [loading, setLoading] = useState(true)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [showAddSettlementModal, setShowAddSettlementModal] = useState(false)
  const [showMembers, setShowMembers] = useState(true)
  const [showExpenses, setShowExpenses] = useState(true)
  const [showSettlements, setShowSettlements] = useState(true)

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return

      try {
        const id = parseInt(groupId)
        const groupData = await getGroupById(id)
        const membersData = await getGroupMembers(id)
        const expensesResponse = await getExpensesByGroupId(id)
        const balancesResponse = await getGroupBalances(id)
        const settlementsResponse = await getSettlementsByGroupId(id)

        setGroup(groupData)
        setMembers(membersData)
        setExpenses(expensesResponse.data)
        setBalances(balancesResponse.data)
        setSettlements(settlementsResponse.data)
      } catch (error) {
        console.error('Error:', error)
        showError(t('errors.serverError'))
      } finally {
        setLoading(false)
      }
    }

    fetchGroupData()
  }, [groupId, t])

  const handleAddMember = async () => {
    if (!groupId || !newMemberEmail.trim()) return

    setAddingMember(true)
    try {
      await addUserToGroup(parseInt(groupId), newMemberEmail)
      const membersData = await getGroupMembers(parseInt(groupId))
      setMembers(membersData)
      setNewMemberEmail('')
      showSuccess(t('groupPage.addMemberSuccess'))
    } catch (error) {
      console.error('Error:', error)
      showError(t('groupPage.addMemberFailed'))
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (userId: number) => {
    if (!groupId) return
    const result = await showConfirm(t('groupPage.confirmRemove'), t('groupPage.remove'))

    if (result.isConfirmed) {
      try {
        await removeUserFromGroup(parseInt(groupId), userId)
        const membersData = await getGroupMembers(parseInt(groupId))
        setMembers(membersData)
        showSuccess(t('groupPage.memberRemoveSuccess'))
      } catch (error) {
        console.error('Error removing member:', error)
        showError(t('errors.serverError'))
      }
    }
  }

  const handleLeaveGroup = async () => {
    const result = await showConfirm(t('groupPage.leaveConfirm'), t('groupPage.confirmLeave'))
    if (!result.isConfirmed) return

    if (!groupId) return
    try {
      await leaveGroup(parseInt(groupId))
      showSuccess(t('groupPage.leaveSuccess'))
      navigate('/groups')
    } catch (error) {
      console.error('Error:', error)
      showError(t('groupPage.leaveFailed'))
    }
  }

  const handleDeleteGroup = async () => {
    const result = await showConfirm(t('groupPage.deleteConfirm'), t('groupPage.confirmDelete'))
    if (!result.isConfirmed) return

    if (!groupId) return
    try {
      await deleteGroup(parseInt(groupId))
      showSuccess(t('groupPage.deleteSuccess'))
      navigate('/groups')
    } catch (error) {
      console.error('Error:', error)
      showError(t('groupPage.deleteFailed'))
    }
  }

  const handleGenerateInviteCode = async () => {
    if (!groupId) return
    try {
      await generateInviteCode(parseInt(groupId))
      const groupData = await getGroupById(parseInt(groupId))
      setGroup(groupData)
      showSuccess(t('groupPage.inviteCodeGenerated'))
    } catch (error) {
      console.error('Error:', error)
      showError(t('groupPage.inviteCodeGenerateFailed'))
    }
  }

  const getPayerName = (expense: ExpenseResponseDto): string => {
    const payer = members.find((member) => member.id === expense.paidByUserId)
    if (payer) {
      return `${payer.firstName} ${payer.lastName}`
    } else {
      return expense.paidByUserEmail || t('groupPage.unknownUser')
    }
  }

  const getUserName = (split: ExpenseSplitDto): string => {
    const user = members.find((member) => member.id === split.userId)
    if (user) {
      return `${user.firstName} ${user.lastName}`
    } else {
      return split.userEmail || t('groupPage.unknownUser')
    }
  }

  const getSettlementUserName = (userId: number): string => {
    const user = getUserById(userId)
    if (user) {
      return `${user.firstName} ${user.lastName}`
    }
    return t('groupPage.unknownUser')
  }

  const getUserById = (userId: number): UserDto | undefined => {
    return members.find((member) => member.id === userId)
  }

  if (loading) {
    return <Loading />
  }

  if (!group)
    return (
      <div className="flex h-full items-center justify-center">
        <div>{t('groupPage.groupNotFound')}</div>
      </div>
    )

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 lg:p-5">
      <div className="bg-surface dark:bg-surface-dark flex h-full w-full flex-col rounded-2xl p-5 shadow-md lg:max-w-[90%]">
        <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-3">
              <h1 className="text-accent text-2xl font-bold">{group.name}</h1>
              <FormButton className="max-w-fit px-3" onClick={handleGenerateInviteCode}>
                <FiLink size={16} />
              </FormButton>
            </div>
            <div className="items-center text-sm text-gray-600 dark:text-gray-300">
              {t('groupPage.inviteCode')}: <span className="text-accent font-semibold">{group.inviteCode ? group.inviteCode : '-'}</span>
            </div>
          </div>
          <div className="flex gap-2 lg:w-1/3">
            <FormButton onClick={() => setShowAddExpenseModal(true)}>{t('groupPage.addExpense')}</FormButton>
            <FormButton onClick={() => setShowAddSettlementModal(true)}>{t('groupPage.settle')}</FormButton>
            <FormButton className="bg-red-400 hover:bg-red-300" onClick={handleLeaveGroup}>
              {t('groupPage.leaveGroup')}
            </FormButton>
            {group && user && group.createdByEmail === user.email && (
              <FormButton className="bg-red-400 hover:bg-red-300" onClick={handleDeleteGroup}>
                {t('groupPage.deleteGroup')}
              </FormButton>
            )}
          </div>
        </div>

        <div className="flex h-full flex-col gap-x-4 overflow-hidden lg:flex-row">
          <div className="mb-10 w-full overflow-y-auto lg:w-1/3">
            <div className="mb-3 flex cursor-pointer items-center justify-between" onClick={() => setShowMembers((v) => !v)}>
              <h2 className="text-accent text-xl font-semibold">{t('groupPage.members')}</h2>
              <div className="flex items-center justify-center gap-3">
                {members.length} {t('groupPage.members')}
                <FiChevronDown className={`text-2xl ${showMembers ? 'rotate-0' : '-rotate-90'} transition-transform duration-200`} />
              </div>
            </div>

            {showMembers && (
              <>
                <div className="mb-4 flex flex-row gap-2 lg:flex-col xl:flex-row">
                  <FormInput
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    label={t('groupPage.addMember')}
                    className="max-w-full"
                  />
                  <FormButton type="button" onClick={handleAddMember} disabled={addingMember} className="max-w-fit px-3">
                    {t('adminGroupEdit.add')}
                  </FormButton>
                  {addingMember && <Loading className="max-w-fit" />}
                </div>

                <ul className="space-y-2">
                  {members.map((member) => (
                    <GroupMemberItem
                      key={member.id}
                      member={member}
                      balances={balances[member.id]}
                      getUserById={getUserById}
                      onRemoveMember={handleRemoveMember}
                      creditorEmail={group.createdByEmail}
                    />
                  ))}
                </ul>

                <div className="mt-10 w-full items-center justify-center">
                  <StorySetImage
                    image={People}
                    alt="People illustration"
                    link="https://storyset.com/people"
                    text="People illustrations by Storyset"
                  />
                </div>
              </>
            )}
          </div>

          <div className="w-full overflow-y-auto lg:w-2/3 lg:border-l lg:pl-4">
            <div className="mb-10">
              <div className="mb-3 flex cursor-pointer items-center justify-between" onClick={() => setShowSettlements((v) => !v)}>
                <h2 className="text-accent text-xl font-semibold">{t('groupPage.settlements')}</h2>
                <FiChevronDown className={`text-2xl ${showSettlements ? 'rotate-0' : '-rotate-90'} transition-transform duration-200`} />
              </div>
              {showSettlements && (
                <>
                  {settlements.length > 0 ? (
                    <div className="space-y-3">
                      {settlements.map((settlement) => (
                        <GroupSettlementItem
                          key={settlement.id}
                          settlement={settlement}
                          getSettlementUserName={getSettlementUserName}
                          t={t}
                          currentUserId={user?.id || 0}
                          onSettlementDeleted={async () => {
                            const settlementsResponse = await getSettlementsByGroupId(parseInt(groupId!))
                            setSettlements(settlementsResponse.data)
                            const balancesResponse = await getGroupBalances(parseInt(groupId!))
                            setBalances(balancesResponse.data)
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-bg dark:bg-bg-dark/80 rounded-md p-3">
                      <p>{t('groupPage.noSettlements')}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mb-3 flex cursor-pointer items-center justify-between" onClick={() => setShowExpenses((v) => !v)}>
              <h2 className="text-accent text-xl font-semibold">{t('groupPage.expenses')}</h2>
              <FiChevronDown className={`text-2xl ${showExpenses ? 'rotate-0' : '-rotate-90'} transition-transform duration-200`} />
            </div>
            {showExpenses && (
              <>
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <GroupExpenseItem
                        key={expense.id}
                        expense={expense}
                        getPayerName={getPayerName}
                        getUserName={getUserName}
                        t={t}
                        currentUserId={user?.id || 0}
                        onExpenseDeleted={async () => {
                          const expensesResponse = await getExpensesByGroupId(parseInt(groupId!))
                          setExpenses(expensesResponse.data)
                          const balancesResponse = await getGroupBalances(parseInt(groupId!))
                          setBalances(balancesResponse.data)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-bg dark:bg-bg-dark/80 rounded-md p-3">
                    <p>{t('groupPage.noExpenses')}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {showAddExpenseModal && (
        <CreateExpenseModal
          groupId={parseInt(groupId!)}
          members={members}
          onClose={() => setShowAddExpenseModal(false)}
          onExpenseCreated={async () => {
            setShowAddExpenseModal(false)
            const expensesResponse = await getExpensesByGroupId(parseInt(groupId!))
            setExpenses(expensesResponse.data)
            const balancesResponse = await getGroupBalances(parseInt(groupId!))
            setBalances(balancesResponse.data)
          }}
        />
      )}
      {showAddSettlementModal && (
        <CreateSettlementModal
          groupId={parseInt(groupId!)}
          members={members}
          onClose={() => setShowAddSettlementModal(false)}
          onSettlementCreated={async () => {
            setShowAddSettlementModal(false)
            const settlementsResponse = await getSettlementsByGroupId(parseInt(groupId!))
            setSettlements(settlementsResponse.data)
            const balancesResponse = await getGroupBalances(parseInt(groupId!))
            setBalances(balancesResponse.data)
          }}
        />
      )}
    </section>
  )
}

export default GroupPage
