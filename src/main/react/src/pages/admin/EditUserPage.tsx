import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Loading from '../../components/basic/Loading'
import FormButton from '../../components/basic/FormButton'
import { deleteUserById, editUserById, getUserById, type UserDto, type UserEditRequest } from '../../api/userService'
import { getRoles } from '../../api/roleService'
import { FiArrowLeft } from 'react-icons/fi'
import { showConfirm, showError, showSuccess } from '../../components/alerts/swalAlerts'
import { type EditUserFormErrors, validateEditUser } from '../../validation/validateEditUser'
import EditUser from '../../assets/user-edit.svg'
import StorySetImage from '../../components/basic/StorySetImage.tsx'
import PersonalDataCard from '../../components/admin/users/PersonalDataCard'
import AccountDetailsCard from '../../components/admin/users/AccountDetailsCard'

function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserDto | null>(null)
  const [roles, setRoles] = useState<string[]>([])

  const [formData, setFormData] = useState<UserEditRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  })

  const [errors, setErrors] = useState<EditUserFormErrors>({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (!id) return

        const userData = await getUserById(Number(id))
        const rolesData = await getRoles()

        setUser(userData)
        setRoles(rolesData)

        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: '',
          role: userData.role,
        })

        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate, t])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !id) return

    const validationErrors = validateEditUser({ ...formData, authProvider: user.authProvider }, t)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await editUserById(Number(id), formData)
      showSuccess(t('profilePage.info.infoUpdated'))
      setErrors({})
    } catch (error) {
      console.error('Error:', error)
      showError(t('profilePage.info.errors.updateFailed'))
    }
  }

  const handleDelete = async () => {
    const result = await showConfirm(t('adminUsers.confirmDelete'), t('adminUsers.userCard.delete'))
    if (result.isConfirmed) {
      try {
        await deleteUserById(Number(id))
        showSuccess(t('adminUsers.deleteSuccess'))
        navigate('/admin/users')
      } catch (e) {
        console.error('Error:', e)
        showError(t('adminUsers.deleteError'))
      }
    }
  }

  const goBack = () => {
    navigate('/admin/users')
  }

  if (loading || !user) return <Loading />

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark relative flex h-full w-full max-w-[90%] flex-col rounded-2xl p-5 shadow-md lg:flex-row">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            backgroundImage: `url(${EditUser})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08,
          }}
        />

        <div className="relative z-10 flex w-full items-center justify-center lg:w-1/2">
          <div className="flex w-full max-w-lg flex-col">
            <button onClick={goBack} className="text-accent hover:text-accent/70 mb-4 flex cursor-pointer items-center gap-2">
              <FiArrowLeft /> {t('adminUsers.title')}
            </button>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <PersonalDataCard formData={formData} errors={errors} user={user} onChange={handleChange} />
              <AccountDetailsCard formData={formData} user={user} roles={roles} onChange={handleChange} />
              <FormButton className="mx-auto mt-4" type="submit">
                {t('saveChanges')}
              </FormButton>
              <FormButton type="button" onClick={handleDelete} className="bg-red-400 hover:bg-red-300">
                {t('adminUsers.userCard.delete')}
              </FormButton>
            </form>
          </div>
        </div>

        <div className="mt-10 hidden w-1/2 items-center justify-center lg:mt-0 lg:flex">
          <StorySetImage
            image={EditUser}
            alt={t('adminUsers.alt')}
            link="https://storyset.com/business"
            text="Business illustrations by Storyset"
            imgClassName="max-h-200"
          />
        </div>
      </div>
    </section>
  )
}

export default EditUserPage
