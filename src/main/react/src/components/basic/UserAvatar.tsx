import { useAuth } from '../../contexts/AuthContext.tsx'

interface UserAvatarProps {
  onClick?: () => void
  className?: string
}

function UserAvatar({ onClick, className = '' }: UserAvatarProps) {
  const auth = useAuth()

  const userInitials = auth.user ? `${auth.user.firstName?.charAt(0) || ''}${auth.user.lastName?.charAt(0) || ''}`.toUpperCase() : '??'

  return (
    <div
      onClick={onClick}
      className={`bg-accent flex h-9 w-9 cursor-default items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition duration-300 md:text-lg ${className}`}
    >
      {userInitials}
    </div>
  )
}

export default UserAvatar
