import { TbBellRinging } from 'react-icons/tb'
import { MdEmail, MdLockReset, MdPerson } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext.tsx'

interface ProfileMenuProps {
  selected: string
  onSelect: (view: string) => void
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ selected, onSelect }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const menuItems = [
    { key: 'info', label: t('profilePage.menu.info'), icon: MdPerson, displayForGoogleAccount: true },
    { key: 'email', label: t('profilePage.menu.email'), icon: MdEmail, displayForGoogleAccount: false },
    { key: 'password', label: t('profilePage.menu.password'), icon: MdLockReset, displayForGoogleAccount: false },
    { key: 'notifications', label: t('profilePage.menu.notifications'), icon: TbBellRinging, displayForGoogleAccount: true },
  ]

  return (
    <div className="bg-surface dark:bg-surface-dark flex h-fit max-h-screen w-full justify-between overflow-auto rounded-xl shadow-md lg:w-1/4 lg:flex-col lg:rounded-2xl">
      {menuItems.map((item) => {
        const Icon = item.icon
        return user?.authProvider === 'GOOGLE' && !item.displayForGoogleAccount ? null : (
          <div
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`group flex w-full cursor-pointer items-center justify-center gap-1 px-5 py-3 transition duration-300 lg:justify-start lg:gap-3 ${
              selected === item.key ? 'bg-accent font-bold text-white' : 'hover:bg-accent/60 hover:text-white'
            }`}
          >
            {Icon && <Icon className={`text-lg ${selected === item.key ? 'text-white' : 'text-accent group-hover:text-white'}`} />}
            {item.label}
          </div>
        )
      })}
    </div>
  )
}

export default ProfileMenu
