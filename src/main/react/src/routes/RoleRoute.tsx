import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROLE_PATHS } from './RolePaths.tsx'
import type { JSX } from 'react'

interface RoleRouteProps {
  children: JSX.Element
  allowedRoles?: string[]
  publicOnly?: boolean
}

const RoleRoute = ({ children, allowedRoles, publicOnly }: RoleRouteProps) => {
  const { user } = useAuth()

  if (publicOnly && user) {
    const redirectPath = ROLE_PATHS[user.role] || ROLE_PATHS.DEFAULT
    return <Navigate to={redirectPath} replace />
  }

  if (allowedRoles && !user) {
    return <Navigate to="/" />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_PATHS.DEFAULT} />
  }

  return children
}

export default RoleRoute
