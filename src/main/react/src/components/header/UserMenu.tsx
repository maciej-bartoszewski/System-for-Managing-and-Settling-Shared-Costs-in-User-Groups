import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccess } from '../alerts/swalAlerts.ts'
import UserAvatar from '../basic/UserAvatar.tsx'

interface UserMenuProps {
  className?: string
}

function UserMenu({ className = '' }: UserMenuProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const auth = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    auth.logout()
    setOpen(false)
    showSuccess(t('logoutSuccess'))
    navigate('/')
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className={`relative font-semibold ${className}`} ref={ref}>
      <UserAvatar className="cursor-pointer hover:scale-105" onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="bg-surface text-accent dark:bg-surface-dark absolute right-0 z-10 mt-2 w-32 rounded-2xl text-sm shadow md:text-base">
          {auth.user?.role !== 'BLOCKED' && (
            <Link
              to="/profile"
              className="dark:hover:text-gray-dark hover:text-gray flex cursor-pointer items-center gap-2 rounded-t-2xl px-2 py-2 transition duration-300"
              onClick={() => setOpen((v) => !v)}
            >
              <FiUser className="text-2xl" /> {t('profile')}
            </Link>
          )}
          <button
            className="dark:hover:text-gray-dark hover:text-gray flex w-full cursor-pointer items-center gap-2 rounded-b-2xl px-2 py-2 text-left transition duration-300"
            onClick={handleLogout}
          >
            <FiLogOut className="text-2xl" /> {t('logout')}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
