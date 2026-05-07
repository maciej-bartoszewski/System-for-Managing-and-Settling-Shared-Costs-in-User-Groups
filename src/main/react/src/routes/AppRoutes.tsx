import { Route, Routes } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.tsx'
import RoleRoute from './RoleRoute.tsx'
import Loading from '../components/basic/Loading.tsx'
import LoginPage from '../pages/LoginPage.tsx'
import RegisterPage from '../pages/RegisterPage.tsx'
import NotFound from '../pages/NotFound.tsx'
import GoogleCallback from '../pages/GoogleCallback.tsx'
import ProfilePage from '../pages/ProfilePage.tsx'
import BlockedPage from '../pages/user/BlockedPage.tsx'
import StatisticsPage from '../pages/admin/StatisticsPage.tsx'
import UsersPage from '../pages/admin/UsersPage.tsx'
import EditUserPage from '../pages/admin/EditUserPage.tsx'
import GroupsPage from '../pages/admin/GroupsPage.tsx'
import EditGroupPage from '../pages/admin/EditGroupPage.tsx'
import UGroupsPage from '../pages/user/GroupsPage.tsx'
import GroupPage from '../pages/user/GroupPage.tsx'
import SummaryPage from '../pages/user/SummaryPage.tsx'

function AppRoutes() {
  const { loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RoleRoute publicOnly>
            <LoginPage />
          </RoleRoute>
        }
      />
      <Route
        path="/auth/google/callback"
        element={
          <RoleRoute publicOnly>
            <GoogleCallback />
          </RoleRoute>
        }
      />
      <Route
        path="/register"
        element={
          <RoleRoute publicOnly>
            <RegisterPage />
          </RoleRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <RoleRoute allowedRoles={['ADMIN', 'USER']}>
            <ProfilePage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/statistics"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <StatisticsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <UsersPage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <EditUserPage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/groups"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <GroupsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/groups/:id/"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <EditGroupPage />
          </RoleRoute>
        }
      />

      <Route
        path="/blocked"
        element={
          <RoleRoute allowedRoles={['BLOCKED']}>
            <BlockedPage />
          </RoleRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <RoleRoute allowedRoles={['USER']}>
            <UGroupsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/groups/:groupId/"
        element={
          <RoleRoute allowedRoles={['USER']}>
            <GroupPage />
          </RoleRoute>
        }
      />

      <Route
        path="/summary"
        element={
          <RoleRoute allowedRoles={['USER']}>
            <SummaryPage />
          </RoleRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
