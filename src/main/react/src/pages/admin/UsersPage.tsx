import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '../../components/basic/Loading.tsx'
import { deleteUserById, searchUsers, type UserDto } from '../../api/userService.ts'
import { FiFilter, FiPlus } from 'react-icons/fi'
import Pagination from '../../components/basic/Pagination.tsx'
import UserCard from '../../components/admin/users/UserCard.tsx'
import SearchBar from '../../components/basic/SearchBar'
import AdvancedFilters from '../../components/admin/users/AdvancedFilters'
import FormButton from '../../components/basic/FormButton.tsx'
import CreateUserModal from '../../components/modals/CreateUserModal.tsx'
import { useNavigate } from 'react-router-dom'
import { showConfirm, showError, showSuccess } from '../../components/alerts/swalAlerts'

function UsersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserDto[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [emailSearch, setEmailSearch] = useState('')
  const [searchInput] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [providerFilter, setProviderFilter] = useState<string>('')

  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchUsers = async (email = emailSearch, role = roleFilter, provider = providerFilter, pageNum = page) => {
    setLoading(true)
    try {
      const response = await searchUsers(email, role, provider, pageNum, 9)
      setUsers(response.content)
      setTotalPages(response.page.totalPages)
    } catch (e) {
      console.error('Error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handleSearch = (value: string) => {
    setPage(0)
    setEmailSearch(value)
    fetchUsers(value, roleFilter, providerFilter, 0)
  }

  const resetFilters = () => {
    setRoleFilter('')
    setProviderFilter('')
    setPage(0)
    fetchUsers(emailSearch, '', '', 0)
  }

  const handleUserCreated = (newUser?: UserDto) => {
    if (newUser) {
      navigate(`/admin/users/${newUser.id}`)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await showConfirm(t('adminUsers.confirmDelete'), t('adminUsers.userCard.delete'))
    if (result.isConfirmed) {
      try {
        await deleteUserById(id)
        setPage(0)
        fetchUsers()
        showSuccess(t('adminUsers.deleteSuccess'))
      } catch (e) {
        console.error('Error:', e)
        showError(t('adminUsers.deleteError'))
      }
    }
  }

  if (loading && users.length === 0) return <Loading />

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark flex h-full w-full flex-col rounded-2xl p-5 shadow-md lg:max-w-[90%]">
        <div className="flex flex-grow flex-col">
          <div className="mb-6 flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-accent w-full text-center text-2xl font-bold md:text-left">{t('adminUsers.title')}</h1>

            <div className="flex w-full items-center gap-2">
              <SearchBar onSearch={handleSearch} initialValue={searchInput} placeholder={t('adminUsers.searchPlaceholder')} />
              <FormButton onClick={() => setShowFilters(!showFilters)} className="max-w-fit px-3">
                <FiFilter />
              </FormButton>
              <FormButton className="max-w-fit px-3" onClick={() => setShowCreateModal(true)}>
                <FiPlus className="text-lg" />
              </FormButton>
            </div>
          </div>

          <AdvancedFilters
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            providerFilter={providerFilter}
            setProviderFilter={setProviderFilter}
            resetFilters={resetFilters}
            show={showFilters}
          />

          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {users.length === 0 ? (
              <div className="col-span-full text-center">{t('adminUsers.noResults')}</div>
            ) : (
              users.map((user) => <UserCard key={user.id} user={user} onDelete={handleDelete} />)
            )}
          </div>
        </div>
        <div className="mt-auto">{totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}</div>
      </div>
      {showCreateModal && <CreateUserModal onClose={() => setShowCreateModal(false)} onUserCreated={handleUserCreated} />}
    </section>
  )
}

export default UsersPage
