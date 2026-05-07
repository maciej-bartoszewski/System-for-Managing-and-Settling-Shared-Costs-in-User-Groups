import HeaderIcon from './HeaderIcon.tsx'
import { FiCreditCard, FiLogOut, FiUser, FiUsers } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import { MdOutlineQueryStats } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

interface NavigationLinksProps {
  variant: 'mobile' | 'desktop'
  userRole: string
  onItemClick?: () => void
  onLogout: () => void
}

interface NavLink {
  to: string
  icon: ReactNode
  label: string
}

function NavigationLinks({ variant, userRole, onItemClick, onLogout }: NavigationLinksProps) {
  const { t } = useTranslation()
  const isMobile = variant === 'mobile'

  const navLinks: NavLink[] = (() => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { to: '/admin/statistics', icon: <MdOutlineQueryStats className="text-2xl" />, label: 'statistics' },
          { to: '/admin/users', icon: <FiUsers className="text-2xl" />, label: 'users' },
          { to: '/admin/groups', icon: <GrGroup className="text-2xl" />, label: 'groups' },
        ]
      case 'USER':
        return [
          { to: '/groups', icon: <GrGroup className="text-2xl" />, label: 'myGroups' },
          { to: '/summary', icon: <FiCreditCard className="text-2xl" />, label: 'summary' },
        ]
      default:
        return []
    }
  })()

  return (
    <div className={`flex h-full flex-col justify-between px-5 ${isMobile && 'py-10'}`}>
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-6'}`}>
        {isMobile && (
          <HeaderIcon to="/profile" className="mb-5" icon={<FiUser className="text-2xl" />} onClick={onItemClick}>
            <span className="ml-2">{t('profile')}</span>
          </HeaderIcon>
        )}

        {navLinks.map((link: NavLink, index: number) => (
          <HeaderIcon key={index} to={link.to} icon={link.icon} onClick={onItemClick}>
            <span className="ml-2 md:text-base">{t(link.label)}</span>
          </HeaderIcon>
        ))}
      </div>

      {isMobile && (
        <HeaderIcon icon={<FiLogOut className="text-2xl" />} onClick={onLogout}>
          <span className="ml-2">{t('logout')}</span>
        </HeaderIcon>
      )}
    </div>
  )
}

export default NavigationLinks
