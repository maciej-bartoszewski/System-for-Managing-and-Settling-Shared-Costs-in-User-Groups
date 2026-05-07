import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface HeaderIconProps {
  to?: string
  icon: React.ReactNode
  onClick?: () => void
  children?: ReactNode
  className?: string
}

function HeaderIcon({ to, icon, onClick, children, className }: HeaderIconProps) {
  const commonStyles =
    'text-accent flex items-center text-base font-semibold md:text-2xl p-2 cursor-pointer hover:scale-110 transition duration-300'

  if (to) {
    return (
      <Link to={to} className={`${commonStyles} ${className}`} onClick={onClick}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <div onClick={onClick} className={`${commonStyles} ${className}`} role="button">
      {icon}
      {children}
    </div>
  )
}

export default HeaderIcon
