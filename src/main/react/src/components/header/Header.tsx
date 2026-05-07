import NavigationLinks from './NavigationLinks.tsx'
import UserMenu from './UserMenu.tsx'
import { FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { navigateBasedOnRole } from '../../routes/RolePaths.tsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showSuccess } from '../alerts/swalAlerts.ts'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const navigateToHomePage = () => {
    if (user) {
      navigateBasedOnRole(user.role, navigate)
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    showSuccess(t('logoutSuccess'))
    navigate('/')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="bg-surface dark:bg-surface-dark flex min-h-12 w-full items-center justify-between px-5 py-1 shadow-md">
      <div className="text-accent w-10 cursor-pointer text-center text-xl font-semibold transition duration-300 hover:scale-102 md:text-2xl">
        <h1 onClick={navigateToHomePage}>MB</h1>
      </div>

      {user && (
        <>
          <nav className="hidden gap-4 md:flex">
            <NavigationLinks variant="desktop" userRole={user.role} onLogout={handleLogout} />
          </nav>

          <div className="flex items-center gap-2">
            <UserMenu className="hidden w-10 md:block" />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-accent z-30 cursor-pointer text-2xl transition duration-300 hover:scale-110 md:hidden"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div
              className="bg-opacity-30 bg-surface dark:bg-surface-dark fixed inset-0 z-20 opacity-80 md:hidden"
              onClick={closeMobileMenu}
            />
          )}

          <div
            ref={menuRef}
            className={`bg-surface dark:bg-surface-dark fixed top-0 right-0 z-20 h-full w-2/3 max-w-xs transform shadow-lg transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} `}
          >
            <NavigationLinks variant="mobile" userRole={user.role} onItemClick={closeMobileMenu} onLogout={handleLogout} />
          </div>
        </>
      )}
    </header>
  )
}

export default Header
