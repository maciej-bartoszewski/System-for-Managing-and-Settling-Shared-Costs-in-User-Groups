import type { NavigateFunction } from 'react-router-dom'

export const ROLE_PATHS: Record<string, string> = {
  ADMIN: '/admin/statistics',
  USER: '/groups',
  BLOCKED: '/blocked',
  DEFAULT: '/not-found',
}

export function navigateBasedOnRole(role: string | undefined, navigate: NavigateFunction) {
  const path = role ? ROLE_PATHS[role] || ROLE_PATHS.DEFAULT : ROLE_PATHS.DEFAULT
  navigate(path, { replace: true })
}
