import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import Loading from '../../components/basic/Loading'
import { deleteGroup, type GroupDto, searchGroups } from '../../api/groupService'
import Pagination from '../../components/basic/Pagination'
import SearchBar from '../../components/basic/SearchBar'
import { showConfirm, showSuccess } from '../../components/alerts/swalAlerts'
import GroupCard from '../../components/admin/groups/GroupCard'
import FormButton from '../../components/basic/FormButton'
import CreateGroupModal from '../../components/modals/CreateGroupModal'

function GroupsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<GroupDto[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [querySearch, setNameSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchGroups = async (query = querySearch, pageNum = page) => {
    setLoading(true)
    try {
      const response = await searchGroups(query, pageNum, 12)
      setGroups(response.content)
      setTotalPages(response.page.totalPages)
    } catch (e) {
      console.error('Error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [page])

  const handleSearch = (value: string) => {
    setPage(0)
    setNameSearch(value)
    fetchGroups(value, 0)
  }

  const handleGroupCreated = (newGroup?: GroupDto) => {
    if (newGroup) {
      navigate(`/admin/groups/${newGroup.id}`)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await showConfirm(t('adminGroups.confirmDelete'), t('adminGroups.groupCard.delete'))
    if (result.isConfirmed) {
      try {
        await deleteGroup(id)
        setPage(0)
        fetchGroups()
        showSuccess(t('adminGroups.deleteSuccess'))
      } catch (e) {
        console.error('Error:', e)
      }
    }
  }

  if (loading && groups.length === 0) return <Loading />

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark flex h-full w-full flex-col rounded-2xl p-5 shadow-md lg:max-w-[90%]">
        <div className="flex flex-grow flex-col">
          <div className="mb-6 flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-accent w-full text-center text-2xl font-bold md:text-left">{t('adminGroups.title')}</h1>

            <div className="flex w-full items-center gap-2">
              <SearchBar onSearch={handleSearch} initialValue={querySearch} placeholder={t('adminGroups.searchPlaceholder')} />
              <FormButton className="max-w-fit px-3" onClick={() => setShowCreateModal(true)}>
                <FiPlus className="text-lg" />
              </FormButton>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {groups.length === 0 ? (
              <div className="col-span-full text-center">{t('adminGroups.noResults')}</div>
            ) : (
              groups.map((group) => <GroupCard key={group.id} group={group} onDelete={handleDelete} />)
            )}
          </div>
        </div>
        <div className="mt-auto">{totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}</div>
      </div>
      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onGroupCreated={handleGroupCreated} />}
    </section>
  )
}

export default GroupsPage
