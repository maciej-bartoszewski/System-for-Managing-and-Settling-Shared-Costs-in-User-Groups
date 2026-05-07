import { useTranslation } from 'react-i18next'
import ModalWithInputs from '../basic/ModalWithInputs.tsx'
import { registerUser } from '../../api/authService.ts'
import { showError, showSuccess } from '../alerts/swalAlerts.ts'
import { type UserDto } from '../../api/userService.ts'

interface CreateUserModalProps {
  onClose: () => void
  onUserCreated: (user?: UserDto) => void
}

function CreateUserModal({ onClose, onUserCreated }: CreateUserModalProps) {
  const { t } = useTranslation()

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const newUser = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      showSuccess(t('registerPage.successTitle2'))
      onUserCreated(newUser)
      onClose()
    } catch (e) {
      console.error('Error creating user:', e)
      if (e.response?.status === 409) {
        showError(t('errors.emailTaken'))
      } else if (e.response?.status === 400) {
        showError(t('errors.invalidRegistrationData'))
      } else {
        showError(t('errors.serverError'))
      }
    }
  }

  return (
    <ModalWithInputs
      title={t('registerPage.title2')}
      inputs={[
        { label: t('registerPage.firstName'), name: 'firstName', required: true },
        { label: t('registerPage.lastName'), name: 'lastName', required: true },
        { label: t('registerPage.email'), name: 'email', type: 'email', required: true },
        { label: t('registerPage.password'), name: 'password', type: 'password', required: true },
      ]}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitButtonText={t('registerPage.registerButton2')}
      cancelButtonText={t('registerPage.cancelButton')}
    />
  )
}

export default CreateUserModal
